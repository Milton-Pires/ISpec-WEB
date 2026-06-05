package br.com.ispec.Service;

import br.com.ispec.Entities.*;
import br.com.ispec.Repository.*;
import com.itextpdf.text.*;
import com.itextpdf.text.Font;
import com.itextpdf.text.pdf.*;
import com.itextpdf.text.pdf.draw.LineSeparator;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class RelatorioService {

    private final InspecaoRepository inspecaoRepository;
    private final ManutencaoRepository manutencaoRepository;
    private final EquipamentoRepository equipamentoRepository;
    private final ClienteRepository clienteRepository;

    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    // Cores iSpec
    private static final BaseColor COR_PRIMARIA   = new BaseColor(139, 0, 18);
    private static final BaseColor COR_CABECALHO  = new BaseColor(192, 0, 26);
    private static final BaseColor COR_LINHA_PAR  = new BaseColor(245, 230, 232);
    private static final BaseColor COR_BRANCO     = BaseColor.WHITE;

    public RelatorioService(InspecaoRepository inspecaoRepository,
                            ManutencaoRepository manutencaoRepository,
                            EquipamentoRepository equipamentoRepository,
                            ClienteRepository clienteRepository) {
        this.inspecaoRepository   = inspecaoRepository;
        this.manutencaoRepository = manutencaoRepository;
        this.equipamentoRepository = equipamentoRepository;
        this.clienteRepository    = clienteRepository;
    }

    // ── Helpers PDF ──────────────────────────────────────────────────────────

    private Font fonteTitulo()     { return new Font(Font.FontFamily.HELVETICA, 20, Font.BOLD,   COR_PRIMARIA); }
    private Font fonteSubtitulo()  { return new Font(Font.FontFamily.HELVETICA, 11, Font.NORMAL, BaseColor.GRAY); }
    private Font fonteCabecalho()  { return new Font(Font.FontFamily.HELVETICA, 9,  Font.BOLD,   COR_BRANCO); }
    private Font fonteCelula()     { return new Font(Font.FontFamily.HELVETICA, 8,  Font.NORMAL, BaseColor.DARK_GRAY); }
    private Font fonteSecao()      { return new Font(Font.FontFamily.HELVETICA, 13, Font.BOLD,   COR_PRIMARIA); }
    private Font fonteBadgeVerde() { return new Font(Font.FontFamily.HELVETICA, 8,  Font.BOLD,   new BaseColor(22, 101, 52)); }
    private Font fonteBadgeVerm()  { return new Font(Font.FontFamily.HELVETICA, 8,  Font.BOLD,   new BaseColor(153, 27, 27)); }

    private void adicionarCabecalhoPDF(Document doc, String titulo, String cliente,
                                       LocalDate inicio, LocalDate fim) throws DocumentException {
        // Logo + título
        Paragraph tit = new Paragraph("iSpec", fonteTitulo());
        tit.setAlignment(Element.ALIGN_LEFT);
        doc.add(tit);

        Paragraph sub = new Paragraph("Sistema de Inspeção de Equipamentos de Incêndio", fonteSubtitulo());
        sub.setSpacingAfter(4);
        doc.add(sub);

        // Linha separadora
        LineSeparator ls = new LineSeparator(1.5f, 100, COR_PRIMARIA, Element.ALIGN_CENTER, -4);
        doc.add(new Chunk(ls));

        Paragraph titRel = new Paragraph(titulo, fonteSecao());
        titRel.setSpacingBefore(10);
        titRel.setSpacingAfter(4);
        doc.add(titRel);

        Paragraph info = new Paragraph(
                "Cliente: " + cliente + "   |   Período: " + inicio.format(FMT) + " a " + fim.format(FMT) +
                        "   |   Gerado em: " + LocalDate.now().format(FMT),
                fonteSubtitulo());
        info.setSpacingAfter(14);
        doc.add(info);
    }

    private PdfPCell celulaHeader(String texto) {
        PdfPCell cell = new PdfPCell(new Phrase(texto, fonteCabecalho()));
        cell.setBackgroundColor(COR_CABECALHO);
        cell.setPadding(7);
        cell.setBorderColor(COR_PRIMARIA);
        return cell;
    }

    private PdfPCell celulaData(String texto, boolean linhaImpar) {
        PdfPCell cell = new PdfPCell(new Phrase(texto != null ? texto : "—", fonteCelula()));
        cell.setBackgroundColor(linhaImpar ? COR_BRANCO : COR_LINHA_PAR);
        cell.setPadding(6);
        cell.setBorderColor(new BaseColor(220, 220, 220));
        return cell;
    }

    private PdfPCell celulaResultado(boolean aprovado, boolean linhaImpar) {
        Font f = aprovado ? fonteBadgeVerde() : fonteBadgeVerm();
        String texto = aprovado ? "Aprovado" : "Reprovado";
        PdfPCell cell = new PdfPCell(new Phrase(texto, f));
        cell.setBackgroundColor(linhaImpar ? COR_BRANCO : COR_LINHA_PAR);
        cell.setPadding(6);
        cell.setBorderColor(new BaseColor(220, 220, 220));
        return cell;
    }

    private void adicionarRodapePDF(Document doc, int total) throws DocumentException {
        LineSeparator ls = new LineSeparator(0.5f, 100, BaseColor.LIGHT_GRAY, Element.ALIGN_CENTER, -4);
        doc.add(new Chunk(ls));
        Paragraph rodape = new Paragraph("Total de registros: " + total, fonteSubtitulo());
        rodape.setSpacingBefore(6);
        rodape.setAlignment(Element.ALIGN_RIGHT);
        doc.add(rodape);
    }

    // ── Helpers Excel ────────────────────────────────────────────────────────

    private CellStyle estiloHeader(Workbook wb) {
        CellStyle style = wb.createCellStyle();
        org.apache.poi.ss.usermodel.Font font = wb.createFont();
        font.setBold(true);
        font.setColor(IndexedColors.WHITE.getIndex());
        style.setFont(font);
        style.setFillForegroundColor(IndexedColors.DARK_RED.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setBorderBottom(BorderStyle.THIN);
        style.setAlignment(HorizontalAlignment.CENTER);
        return style;
    }

    private CellStyle estiloLinhaPar(Workbook wb) {
        CellStyle style = wb.createCellStyle();
        style.setFillForegroundColor(IndexedColors.ROSE.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        return style;
    }

    private org.apache.poi.ss.usermodel.Row criarLinha(Sheet sheet, int rowNum, CellStyle style, String... valores) {
        org.apache.poi.ss.usermodel.Row row = sheet.createRow(rowNum);
        for (int i = 0; i < valores.length; i++) {
            Cell cell = row.createCell(i);
            cell.setCellValue(valores[i] != null ? valores[i] : "—");
            if (style != null) cell.setCellStyle(style);
        }
        return row;
    }

    //PDF
    public byte[] gerarPdfInspecoes(Long clienteId, LocalDate inicio, LocalDate fim) throws Exception {
        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
        List<Inspecao> lista = inspecaoRepository
                .findByEquipamento_Cliente_IdAndDataInspecaoBetween(clienteId, inicio, fim);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document doc = new Document(PageSize.A4.rotate(), 30, 30, 40, 40);
        PdfWriter.getInstance(doc, baos);
        doc.open();

        adicionarCabecalhoPDF(doc, "Relatório de Inspeções", cliente.getRazaoSocial(), inicio, fim);

        PdfPTable table = new PdfPTable(7);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{2.5f, 1.5f, 1.5f, 2f, 1.5f, 1.2f, 2.5f});

        table.addCell(celulaHeader("Equipamento"));
        table.addCell(celulaHeader("Nº Série"));
        table.addCell(celulaHeader("Tipo"));
        table.addCell(celulaHeader("Data"));
        table.addCell(celulaHeader("Responsável"));
        table.addCell(celulaHeader("Resultado"));
        table.addCell(celulaHeader("Observações"));

        for (int i = 0; i < lista.size(); i++) {
            Inspecao ins = lista.get(i);
            boolean par = i % 2 == 0;
            table.addCell(celulaData(ins.getEquipamento()?.getNome(), par));
            table.addCell(celulaData(ins.getEquipamento()?.getNumSerie(), par));
            table.addCell(celulaData(ins.getEquipamento()?.getTipo(), par));
            table.addCell(celulaData(ins.getDataInspecao()?.format(FMT), par));
            table.addCell(celulaData(ins.getResponsavel()?.getNome(), par));
            table.addCell(celulaResultado(Boolean.TRUE.equals(ins.getAprovado()), par));
            table.addCell(celulaData(ins.getObservacoes(), par));
        }

        doc.add(table);
        adicionarRodapePDF(doc, lista.size());
        doc.close();
        return baos.toByteArray();
    }

   //PDF
    public byte[] gerarPdfEquipamentos(Long clienteId, LocalDate inicio, LocalDate fim) throws Exception {
        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
        List<Equipamento> lista = equipamentoRepository.findByCliente_Id(clienteId);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document doc = new Document(PageSize.A4.rotate(), 30, 30, 40, 40);
        PdfWriter.getInstance(doc, baos);
        doc.open();

        adicionarCabecalhoPDF(doc, "Relatório de Equipamentos", cliente.getRazaoSocial(), inicio, fim);

        PdfPTable table = new PdfPTable(6);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{2.5f, 1.5f, 2f, 1.5f, 1.5f, 1.5f});

        table.addCell(celulaHeader("Nome"));
        table.addCell(celulaHeader("Tipo"));
        table.addCell(celulaHeader("Localização"));
        table.addCell(celulaHeader("Status"));
        table.addCell(celulaHeader("Instalação"));
        table.addCell(celulaHeader("Validade"));

        for (int i = 0; i < lista.size(); i++) {
            Equipamento eq = lista.get(i);
            boolean par = i % 2 == 0;
            String loc = eq.getLocalizacao() != null
                    ? String.join(" / ", List.of(
                    eq.getLocalizacao().getBloco() != null ? eq.getLocalizacao().getBloco() : "",
                    eq.getLocalizacao().getAndar() != null ? eq.getLocalizacao().getAndar() : "",
                    eq.getLocalizacao().getSala()  != null ? eq.getLocalizacao().getSala()  : ""
            ).stream().filter(s -> !s.isEmpty()).toList())
                    : "—";
            table.addCell(celulaData(eq.getNome(), par));
            table.addCell(celulaData(eq.getTipo(), par));
            table.addCell(celulaData(loc, par));
            table.addCell(celulaData(eq.getStatus() != null ? eq.getStatus().name() : "—", par));
            table.addCell(celulaData(eq.getDataInstalacao() != null ? eq.getDataInstalacao().format(FMT) : "—", par));
            table.addCell(celulaData(eq.getDataValidade()   != null ? eq.getDataValidade().format(FMT)   : "—", par));
        }

        doc.add(table);
        adicionarRodapePDF(doc, lista.size());
        doc.close();
        return baos.toByteArray();
    }

    //PDF
    public byte[] gerarPdfManutencoes(Long clienteId, LocalDate inicio, LocalDate fim) throws Exception {
        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
        List<Manutencao> lista = manutencaoRepository
                .findByEquipamento_Cliente_IdAndDataManutencaoBetween(clienteId, inicio, fim);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document doc = new Document(PageSize.A4.rotate(), 30, 30, 40, 40);
        PdfWriter.getInstance(doc, baos);
        doc.open();

        adicionarCabecalhoPDF(doc, "Relatório de Manutenções", cliente.getRazaoSocial(), inicio, fim);

        PdfPTable table = new PdfPTable(6);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{2.5f, 1.5f, 1.5f, 2f, 1.5f, 2.5f});

        table.addCell(celulaHeader("Equipamento"));
        table.addCell(celulaHeader("Nº Série"));
        table.addCell(celulaHeader("Data"));
        table.addCell(celulaHeader("Técnico"));
        table.addCell(celulaHeader("Status"));
        table.addCell(celulaHeader("Descrição"));

        for (int i = 0; i < lista.size(); i++) {
            Manutencao m = lista.get(i);
            boolean par = i % 2 == 0;
            table.addCell(celulaData(m.getEquipamento() != null ? m.getEquipamento().getNome() : "—", par));
            table.addCell(celulaData(m.getEquipamento() != null ? m.getEquipamento().getNumSerie() : "—", par));
            table.addCell(celulaData(m.getDataManutencao() != null ? m.getDataManutencao().format(FMT) : "—", par));
            table.addCell(celulaData(m.getTecnico() != null ? m.getTecnico().getNome() : "—", par));
            table.addCell(celulaData(m.getStatus() != null ? m.getStatus().name() : "—", par));
            table.addCell(celulaData(m.getDescricao(), par));
        }

        doc.add(table);
        adicionarRodapePDF(doc, lista.size());
        doc.close();
        return baos.toByteArray();
    }

    //PDF
    public byte[] gerarPdfGeral(Long clienteId, LocalDate inicio, LocalDate fim) throws Exception {
        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

        List<Inspecao>   inspecoes   = inspecaoRepository.findByEquipamento_Cliente_IdAndDataInspecaoBetween(clienteId, inicio, fim);
        List<Manutencao> manutencoes = manutencaoRepository.findByEquipamento_Cliente_IdAndDataManutencaoBetween(clienteId, inicio, fim);
        List<Equipamento> equipamentos = equipamentoRepository.findByCliente_Id(clienteId);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document doc = new Document(PageSize.A4.rotate(), 30, 30, 40, 40);
        PdfWriter.getInstance(doc, baos);
        doc.open();

        adicionarCabecalhoPDF(doc, "Relatório Geral", cliente.getRazaoSocial(), inicio, fim);

        // Seção Inspeções
        Paragraph secInsp = new Paragraph("Inspeções", fonteSecao());
        secInsp.setSpacingBefore(10);
        secInsp.setSpacingAfter(6);
        doc.add(secInsp);

        PdfPTable tInsp = new PdfPTable(6);
        tInsp.setWidthPercentage(100);
        tInsp.setWidths(new float[]{2.5f, 1.5f, 1.5f, 2f, 1.5f, 1.2f});
        tInsp.addCell(celulaHeader("Equipamento"));
        tInsp.addCell(celulaHeader("Nº Série"));
        tInsp.addCell(celulaHeader("Tipo"));
        tInsp.addCell(celulaHeader("Data"));
        tInsp.addCell(celulaHeader("Responsável"));
        tInsp.addCell(celulaHeader("Resultado"));
        for (int i = 0; i < inspecoes.size(); i++) {
            Inspecao ins = inspecoes.get(i);
            boolean par = i % 2 == 0;
            tInsp.addCell(celulaData(ins.getEquipamento() != null ? ins.getEquipamento().getNome() : "—", par));
            tInsp.addCell(celulaData(ins.getEquipamento() != null ? ins.getEquipamento().getNumSerie() : "—", par));
            tInsp.addCell(celulaData(ins.getEquipamento() != null ? ins.getEquipamento().getTipo() : "—", par));
            tInsp.addCell(celulaData(ins.getDataInspecao() != null ? ins.getDataInspecao().format(FMT) : "—", par));
            tInsp.addCell(celulaData(ins.getResponsavel() != null ? ins.getResponsavel().getNome() : "—", par));
            tInsp.addCell(celulaResultado(Boolean.TRUE.equals(ins.getAprovado()), par));
        }
        doc.add(tInsp);
        adicionarRodapePDF(doc, inspecoes.size());

        // Seção Manutenções
        doc.add(new Paragraph(" "));
        Paragraph secMan = new Paragraph("Manutenções", fonteSecao());
        secMan.setSpacingBefore(10);
        secMan.setSpacingAfter(6);
        doc.add(secMan);

        PdfPTable tMan = new PdfPTable(5);
        tMan.setWidthPercentage(100);
        tMan.setWidths(new float[]{2.5f, 1.5f, 1.5f, 2f, 1.5f});
        tMan.addCell(celulaHeader("Equipamento"));
        tMan.addCell(celulaHeader("Nº Série"));
        tMan.addCell(celulaHeader("Data"));
        tMan.addCell(celulaHeader("Técnico"));
        tMan.addCell(celulaHeader("Status"));
        for (int i = 0; i < manutencoes.size(); i++) {
            Manutencao m = manutencoes.get(i);
            boolean par = i % 2 == 0;
            tMan.addCell(celulaData(m.getEquipamento() != null ? m.getEquipamento().getNome() : "—", par));
            tMan.addCell(celulaData(m.getEquipamento() != null ? m.getEquipamento().getNumSerie() : "—", par));
            tMan.addCell(celulaData(m.getDataManutencao() != null ? m.getDataManutencao().format(FMT) : "—", par));
            tMan.addCell(celulaData(m.getTecnico() != null ? m.getTecnico().getNome() : "—", par));
            tMan.addCell(celulaData(m.getStatus() != null ? m.getStatus().name() : "—", par));
        }
        doc.add(tMan);
        adicionarRodapePDF(doc, manutencoes.size());

        // Seção Equipamentos
        doc.add(new Paragraph(" "));
        Paragraph secEq = new Paragraph("Equipamentos", fonteSecao());
        secEq.setSpacingBefore(10);
        secEq.setSpacingAfter(6);
        doc.add(secEq);

        PdfPTable tEq = new PdfPTable(5);
        tEq.setWidthPercentage(100);
        tEq.setWidths(new float[]{2.5f, 1.5f, 1.5f, 1.5f, 1.5f});
        tEq.addCell(celulaHeader("Nome"));
        tEq.addCell(celulaHeader("Tipo"));
        tEq.addCell(celulaHeader("Status"));
        tEq.addCell(celulaHeader("Instalação"));
        tEq.addCell(celulaHeader("Validade"));
        for (int i = 0; i < equipamentos.size(); i++) {
            Equipamento eq = equipamentos.get(i);
            boolean par = i % 2 == 0;
            tEq.addCell(celulaData(eq.getNome(), par));
            tEq.addCell(celulaData(eq.getTipo(), par));
            tEq.addCell(celulaData(eq.getStatus() != null ? eq.getStatus().name() : "—", par));
            tEq.addCell(celulaData(eq.getDataInstalacao() != null ? eq.getDataInstalacao().format(FMT) : "—", par));
            tEq.addCell(celulaData(eq.getDataValidade()   != null ? eq.getDataValidade().format(FMT)   : "—", par));
        }
        doc.add(tEq);
        adicionarRodapePDF(doc, equipamentos.size());

        doc.close();
        return baos.toByteArray();
    }

    //EXCEL
    public byte[] gerarExcel(Long clienteId, String tipo, LocalDate inicio, LocalDate fim) throws Exception {
        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

        Workbook wb = new XSSFWorkbook();
        CellStyle headerStyle = estiloHeader(wb);
        CellStyle parStyle    = estiloLinhaPar(wb);

        if (tipo.equals("INSPECOES") || tipo.equals("GERAL")) {
            List<Inspecao> lista = inspecaoRepository
                    .findByEquipamento_Cliente_IdAndDataInspecaoBetween(clienteId, inicio, fim);
            Sheet sheet = wb.createSheet("Inspeções");
            criarLinha(sheet, 0, headerStyle, "Equipamento","Nº Série","Tipo","Data","Responsável","Resultado","Observações");
            for (int i = 0; i < lista.size(); i++) {
                Inspecao ins = lista.get(i);
                criarLinha(sheet, i + 1, i % 2 != 0 ? parStyle : null,
                        ins.getEquipamento() != null ? ins.getEquipamento().getNome() : "—",
                        ins.getEquipamento() != null ? ins.getEquipamento().getNumSerie() : "—",
                        ins.getEquipamento() != null ? ins.getEquipamento().getTipo() : "—",
                        ins.getDataInspecao() != null ? ins.getDataInspecao().format(FMT) : "—",
                        ins.getResponsavel() != null ? ins.getResponsavel().getNome() : "—",
                        Boolean.TRUE.equals(ins.getAprovado()) ? "Aprovado" : "Reprovado",
                        ins.getObservacoes() != null ? ins.getObservacoes() : "—"
                );
            }
            for (int i = 0; i < 7; i++) sheet.autoSizeColumn(i);
        }

        if (tipo.equals("MANUTENCOES") || tipo.equals("GERAL")) {
            List<Manutencao> lista = manutencaoRepository
                    .findByEquipamento_Cliente_IdAndDataManutencaoBetween(clienteId, inicio, fim);
            Sheet sheet = wb.createSheet("Manutenções");
            criarLinha(sheet, 0, headerStyle, "Equipamento","Nº Série","Data","Técnico","Status","Descrição");
            for (int i = 0; i < lista.size(); i++) {
                Manutencao m = lista.get(i);
                criarLinha(sheet, i + 1, i % 2 != 0 ? parStyle : null,
                        m.getEquipamento() != null ? m.getEquipamento().getNome() : "—",
                        m.getEquipamento() != null ? m.getEquipamento().getNumSerie() : "—",
                        m.getDataManutencao() != null ? m.getDataManutencao().format(FMT) : "—",
                        m.getTecnico() != null ? m.getTecnico().getNome() : "—",
                        m.getStatus() != null ? m.getStatus().name() : "—",
                        m.getDescricao() != null ? m.getDescricao() : "—"
                );
            }
            for (int i = 0; i < 6; i++) sheet.autoSizeColumn(i);
        }

        if (tipo.equals("EQUIPAMENTOS") || tipo.equals("GERAL")) {
            List<Equipamento> lista = equipamentoRepository.findByCliente_Id(clienteId);
            Sheet sheet = wb.createSheet("Equipamentos");
            criarLinha(sheet, 0, headerStyle, "Nome","Tipo","Status","Instalação","Validade");
            for (int i = 0; i < lista.size(); i++) {
                Equipamento eq = lista.get(i);
                criarLinha(sheet, i + 1, i % 2 != 0 ? parStyle : null,
                        eq.getNome(),
                        eq.getTipo(),
                        eq.getStatus() != null ? eq.getStatus().name() : "—",
                        eq.getDataInstalacao() != null ? eq.getDataInstalacao().format(FMT) : "—",
                        eq.getDataValidade()   != null ? eq.getDataValidade().format(FMT)   : "—"
                );
            }
            for (int i = 0; i < 5; i++) sheet.autoSizeColumn(i);
        }

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        wb.write(baos);
        wb.close();
        return baos.toByteArray();
    }
}