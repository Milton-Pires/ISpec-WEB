package br.com.ispec.Service;

import br.com.ispec.Entities.Equipamento;
import br.com.ispec.Entities.Inspecao;
import br.com.ispec.Entities.Manutencao;
import br.com.ispec.Repository.EquipamentoRepository;
import br.com.ispec.Repository.InspecaoRepository;
import br.com.ispec.Repository.ManutencaoRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RelatorioService {
    private final EquipamentoRepository equipamentoRepository;
    private final InspecaoRepository inspecaoRepository;
    private final ManutencaoRepository manutencaoRepository;

    public RelatorioService(EquipamentoRepository equipamentoRepository,
                            InspecaoRepository inspecaoRepository,
                            ManutencaoRepository manutencaoRepository) {
        this.equipamentoRepository = equipamentoRepository;
        this.inspecaoRepository = inspecaoRepository;
        this.manutencaoRepository = manutencaoRepository;
    }

    public List<Equipamento> equipamentosQuePrecisamManutencao() {
        return equipamentoRepository.findAll()
                .stream()
                .filter(Equipamento::precisaManutencao)
                .collect(Collectors.toList());
    }

    public List<Inspecao> inspecoesPorPeriodo(LocalDate inicio, LocalDate fim) {
        return inspecaoRepository.findAll()
                .stream()
                .filter(i -> i.getDataInspecao() != null
                        && !i.getDataInspecao().isBefore(inicio)
                        && !i.getDataInspecao().isAfter(fim))
                .collect(Collectors.toList());
    }

    public List<Inspecao> relatorioPorCliente(Long clienteId) {
        return inspecaoRepository.findByEquipamento_Cliente_Id(clienteId);
    }

    public List<Inspecao> relatorioPorUsuario(Long usuarioId) {
        return inspecaoRepository.findByResponsavel_Id(usuarioId);
    }

    public List<Inspecao> relatorioPorLocalizacao(Long localizacaoId) {
        return inspecaoRepository.findByEquipamento_Localizacao_Id(localizacaoId);
    }

    public List<Manutencao> manutencoesPorTecnico(Long tecnicoId) {
        return manutencaoRepository.findByTecnico_Id(tecnicoId);
    }
}
