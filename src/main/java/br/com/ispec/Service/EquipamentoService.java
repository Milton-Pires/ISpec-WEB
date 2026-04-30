package br.com.ispec.Service;

import br.com.ispec.Entities.*;
import br.com.ispec.Repository.*;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EquipamentoService {

    private final EquipamentoRepository repository;
    private final ClienteRepository clienteRepository;
    private final LocalizacaoRepository localizacaoRepository;
    private final TipoEquipamentoRepository tipoEquipamentoRepository;
    private final AgenteExtintorRepository agenteExtintorRepository;
    private final ClasseFogoRepository classeFogoRepository;
    private final TipoSensorRepository tipoSensorRepository;

    public EquipamentoService(EquipamentoRepository repository,
                              ClienteRepository clienteRepository,
                              LocalizacaoRepository localizacaoRepository,
                              TipoEquipamentoRepository tipoEquipamentoRepository,
                              AgenteExtintorRepository agenteExtintorRepository,
                              ClasseFogoRepository classeFogoRepository,
                              TipoSensorRepository tipoSensorRepository) {
        this.repository = repository;
        this.clienteRepository = clienteRepository;
        this.localizacaoRepository = localizacaoRepository;
        this.tipoEquipamentoRepository = tipoEquipamentoRepository;
        this.agenteExtintorRepository = agenteExtintorRepository;
        this.classeFogoRepository = classeFogoRepository;
        this.tipoSensorRepository = tipoSensorRepository;
    }

    public List<Equipamento> listarTodos() { return repository.findAll(); }

    public Equipamento buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipamento não encontrado: " + id));
    }

    /**
     * Resolve todos os relacionamentos pelo ID antes de salvar,
     * evitando PropertyValueException do Hibernate.
     */
    public Equipamento salvar(Equipamento equipamento) {
        // Resolve cliente
        if (equipamento.getCliente() != null && equipamento.getCliente().getId() != null) {
            Cliente cliente = clienteRepository.findById(equipamento.getCliente().getId())
                    .orElseThrow(() -> new RuntimeException("Cliente não encontrado: " + equipamento.getCliente().getId()));
            equipamento.setCliente(cliente);
        }

        // Resolve localizacao
        if (equipamento.getLocalizacao() != null && equipamento.getLocalizacao().getId() != null) {
            Localizacao loc = localizacaoRepository.findById(equipamento.getLocalizacao().getId())
                    .orElseThrow(() -> new RuntimeException("Localização não encontrada: " + equipamento.getLocalizacao().getId()));
            equipamento.setLocalizacao(loc);
        }

        // Resolve tipoEquipamento
        if (equipamento.getTipoEquipamento() != null && equipamento.getTipoEquipamento().getId() != null) {
            TipoEquipamento tipo = tipoEquipamentoRepository.findById(equipamento.getTipoEquipamento().getId())
                    .orElseThrow(() -> new RuntimeException("Tipo de equipamento não encontrado: " + equipamento.getTipoEquipamento().getId()));
            equipamento.setTipoEquipamento(tipo);
        }

        // Resolve campos específicos por subtipo
        if (equipamento instanceof Extintor extintor) {
            // Resolve agente extintor
            if (extintor.getAgente() != null && extintor.getAgente().getId() != null) {
                AgenteExtintor agente = agenteExtintorRepository.findById(extintor.getAgente().getId())
                        .orElseThrow(() -> new RuntimeException("Agente extintor não encontrado: " + extintor.getAgente().getId()));
                extintor.setAgente(agente);
            }

            // Resolve classes de fogo
            if (extintor.getClassesFogo() != null && !extintor.getClassesFogo().isEmpty()) {
                List<ClasseFogo> classes = extintor.getClassesFogo().stream()
                        .map(cf -> classeFogoRepository.findById(cf.getId())
                                .orElseThrow(() -> new RuntimeException("Classe de fogo não encontrada: " + cf.getId())))
                        .collect(Collectors.toList());
                extintor.setClassesFogo(classes);
            }
        }

        if (equipamento instanceof Alarme alarme) {
            // Resolve tipo sensor
            if (alarme.getTipoSensor() != null && alarme.getTipoSensor().getId() != null) {
                TipoSensor sensor = tipoSensorRepository.findById(alarme.getTipoSensor().getId())
                        .orElseThrow(() -> new RuntimeException("Tipo de sensor não encontrado: " + alarme.getTipoSensor().getId()));
                alarme.setTipoSensor(sensor);
            }
        }

        return repository.save(equipamento);
    }

    public Equipamento atualizar(Long id, Equipamento equipamentoAtualizado) {
        Equipamento equipamento = buscarPorId(id);
        equipamento.setNome(equipamentoAtualizado.getNome());
        equipamento.setNumSerie(equipamentoAtualizado.getNumSerie());
        equipamento.setStatus(equipamentoAtualizado.getStatus());
        equipamento.setDataValidade(equipamentoAtualizado.getDataValidade());
        equipamento.setLocalizacao(equipamentoAtualizado.getLocalizacao());
        return repository.save(equipamento);
    }

    public void deletar(Long id) { repository.deleteById(id); }

    public List<Equipamento> listarPorCliente(Long clienteId) {
        return repository.findByCliente_Id(clienteId);
    }

    public List<Equipamento> listarPorLocalizacao(Long localizacaoId) {
        return repository.findByLocalizacao_Id(localizacaoId);
    }

    public List<Equipamento> equipamentosQuePrecisamManutencao() {
        return repository.findAll()
                .stream()
                .filter(Equipamento::precisaManutencao)
                .toList();
    }
}

