package br.com.ispec.Controller;

import br.com.ispec.Entities.Equipamento;
import br.com.ispec.Entities.Inspecao;
import br.com.ispec.Repository.AgendamentoRepository;
import br.com.ispec.Repository.EquipamentoRepository;
import br.com.ispec.Repository.InspecaoRepository;
import br.com.ispec.Enums.StatusAgendamento;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/avisos")
public class AvisosController {

    private final EquipamentoRepository equipamentoRepository;
    private final InspecaoRepository inspecaoRepository;
    private final AgendamentoRepository agendamentoRepository;

    public AvisosController(EquipamentoRepository equipamentoRepository,
                            InspecaoRepository inspecaoRepository,
                            AgendamentoRepository agendamentoRepository) {
        this.equipamentoRepository = equipamentoRepository;
        this.inspecaoRepository    = inspecaoRepository;
        this.agendamentoRepository = agendamentoRepository;
    }

    @GetMapping
    public Map<String, Object> listarAvisos() {
        LocalDate hoje     = LocalDate.now();
        LocalDate em30dias = hoje.plusDays(30);
        LocalDate em90dias = hoje.plusDays(90);
        LocalDate semana   = hoje.plusDays(7);

        // Equipamentos já vencidos
        List<Equipamento> vencidos = equipamentoRepository
                .findByDataValidadeBefore(hoje);

        // Equipamentos vencendo em 30 dias
        List<Equipamento> vencendo30 = equipamentoRepository
                .findByDataValidadeBetween(hoje, em30dias);

        // Equipamentos vencendo em 90 dias
        List<Equipamento> vencendo90 = equipamentoRepository
                .findByDataValidadeBetween(em30dias.plusDays(1), em90dias);

        // Inspeções reprovadas recentes (últimos 30 dias)
        List<Inspecao> reprovadas = inspecaoRepository
                .findByDataInspecaoBetweenAndAprovado(hoje.minusDays(30), hoje, false);

        // Agenda da semana
        var agendaSemana = agendamentoRepository
                .findByDataBetween(hoje, semana)
                .stream()
                .filter(a -> a.getStatus() == StatusAgendamento.PENDENTE)
                .toList();

        Map<String, Object> resultado = new HashMap<>();
        resultado.put("vencidos",    vencidos);
        resultado.put("vencendo30",  vencendo30);
        resultado.put("vencendo90",  vencendo90);
        resultado.put("reprovadas",  reprovadas);
        resultado.put("agendaSemana", agendaSemana);
        return resultado;
    }
}