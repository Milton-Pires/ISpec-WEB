package br.com.ispec.Service;

import br.com.ispec.Entities.*;
import br.com.ispec.Enums.StatusEquipamento;
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

    public List<Equipamento> listarTodos() {
        return repository.findAll().stream()
                .map(this::recalcularStatus)
                .toList();
    }

    public Equipamento buscarPorId(Long id) {
        Equipamento e = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipamento não encontrado: " + id));
        return recalcularStatus(e);
    }

    /**
     * Recalcula o status automaticamente, mas respeita definições manuais.
     * Se statusManual == true, o status definido pelo usuário prevalece sempre.
     * Se statusManual == false, o sistema calcula com base nas condições do equipamento.
     */
    private Equipamento recalcularStatus(Equipamento e) {
        if (e.isStatusManual()) return e;

        StatusEquipamento novoStatus;

        if (e.estaVencido()) {
            novoStatus = StatusEquipamento.VENCIDO;
        } else if (e.precisaManutencao()) {
            novoStatus = StatusEquipamento.EM_MANUTENCAO;
        } else {
            novoStatus = StatusEquipamento.ATIVO;
        }

        if (novoStatus != e.getStatus()) {
            e.setStatus(novoStatus);
            repository.save(e);
        }

        return e;
    }

    /**
     * Altera o status manualmente e marca statusManual = true,
     * impedindo que o recálculo automático sobrescreva depois.
     * Usado pelo endpoint PATCH /equipamentos/{id}/status.
     */
    public Equipamento atualizarStatus(Long id, StatusEquipamento status) {
        Equipamento e = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipamento não encontrado: " + id));
        e.setStatus(status);
        e.setStatusManual(true);
        return repository.save(e);
    }

    /**
     * Criação: sempre começa com status ATIVO e statusManual = false
     * (o recálculo automático entra na próxima listagem).
     */
    public Equipamento salvar(Equipamento equipamento) {
        equipamento.setStatus(StatusEquipamento.ATIVO);
        equipamento.setStatusManual(false);
        return resolverEPersistir(equipamento);
    }

    /**
     * Atualização: carrega o objeto gerenciado pelo Hibernate e aplica os campos,
     * evitando INSERT duplicado nas tabelas filhas da herança JOINED.
     * O statusManual não é alterado aqui — só muda via PATCH /status.
     */
    public Equipamento atualizar(Long id, Equipamento dados) {
        Equipamento existente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipamento não encontrado: " + id));

        // Campos comuns
        existente.setNome(dados.getNome());
        existente.setNumSerie(dados.getNumSerie());
        existente.setDataInstalacao(dados.getDataInstalacao());
        existente.setDataValidade(dados.getDataValidade());

        // Resolve cliente
        if (dados.getCliente() != null && dados.getCliente().getId() != null) {
            Cliente cliente = clienteRepository.findById(dados.getCliente().getId())
                    .orElseThrow(() -> new RuntimeException("Cliente não encontrado: " + dados.getCliente().getId()));
            existente.setCliente(cliente);
        }

        // Resolve localização
        if (dados.getLocalizacao() != null && dados.getLocalizacao().getId() != null) {
            Localizacao loc = localizacaoRepository.findById(dados.getLocalizacao().getId())
                    .orElseThrow(() -> new RuntimeException("Localização não encontrada: " + dados.getLocalizacao().getId()));
            existente.setLocalizacao(loc);
        }

        // Resolve tipo de equipamento
        if (dados.getTipoEquipamento() != null && dados.getTipoEquipamento().getId() != null) {
            TipoEquipamento tipo = tipoEquipamentoRepository.findById(dados.getTipoEquipamento().getId())
                    .orElseThrow(() -> new RuntimeException("Tipo de equipamento não encontrado: " + dados.getTipoEquipamento().getId()));
            existente.setTipoEquipamento(tipo);
        }

        // Campos específicos por subtipo
        if (existente instanceof Extintor extExistente && dados instanceof Extintor extDados) {
            extExistente.setCapacidade(extDados.getCapacidade());
            extExistente.setPressao(extDados.getPressao());

            if (extDados.getAgente() != null && extDados.getAgente().getId() != null) {
                AgenteExtintor agente = agenteExtintorRepository.findById(extDados.getAgente().getId())
                        .orElseThrow(() -> new RuntimeException("Agente extintor não encontrado: " + extDados.getAgente().getId()));
                extExistente.setAgente(agente);
            }

            if (extDados.getClassesFogo() != null && !extDados.getClassesFogo().isEmpty()) {
                List<ClasseFogo> classes = extDados.getClassesFogo().stream()
                        .map(cf -> classeFogoRepository.findById(cf.getId())
                                .orElseThrow(() -> new RuntimeException("Classe de fogo não encontrada: " + cf.getId())))
                        .collect(Collectors.toList());
                extExistente.setClassesFogo(classes);
            }
        }

        if (existente instanceof Alarme alarmeExistente && dados instanceof Alarme alarmeDados) {
            alarmeExistente.setFuncionando(alarmeDados.isFuncionando());
            alarmeExistente.setUltimaVerificacao(alarmeDados.getUltimaVerificacao());

            if (alarmeDados.getTipoSensor() != null && alarmeDados.getTipoSensor().getId() != null) {
                TipoSensor sensor = tipoSensorRepository.findById(alarmeDados.getTipoSensor().getId())
                        .orElseThrow(() -> new RuntimeException("Tipo de sensor não encontrado: " + alarmeDados.getTipoSensor().getId()));
                alarmeExistente.setTipoSensor(sensor);
            }
        }

        if (existente instanceof Hidrante hidExistente && dados instanceof Hidrante hidDados) {
            hidExistente.setPressaoAgua(hidDados.getPressaoAgua());
            hidExistente.setComprimentoMangueira(hidDados.getComprimentoMangueira());
        }

        return repository.save(existente);
    }

    // ── Usado apenas na criação ──────────────────────────────────────────────
    private Equipamento resolverEPersistir(Equipamento equipamento) {
        if (equipamento.getCliente() != null && equipamento.getCliente().getId() != null) {
            Cliente cliente = clienteRepository.findById(equipamento.getCliente().getId())
                    .orElseThrow(() -> new RuntimeException("Cliente não encontrado: " + equipamento.getCliente().getId()));
            equipamento.setCliente(cliente);
        }

        if (equipamento.getLocalizacao() != null && equipamento.getLocalizacao().getId() != null) {
            Localizacao loc = localizacaoRepository.findById(equipamento.getLocalizacao().getId())
                    .orElseThrow(() -> new RuntimeException("Localização não encontrada: " + equipamento.getLocalizacao().getId()));
            equipamento.setLocalizacao(loc);
        }

        if (equipamento.getTipoEquipamento() != null && equipamento.getTipoEquipamento().getId() != null) {
            TipoEquipamento tipo = tipoEquipamentoRepository.findById(equipamento.getTipoEquipamento().getId())
                    .orElseThrow(() -> new RuntimeException("Tipo de equipamento não encontrado: " + equipamento.getTipoEquipamento().getId()));
            equipamento.setTipoEquipamento(tipo);
        }

        if (equipamento instanceof Extintor extintor) {
            if (extintor.getAgente() != null && extintor.getAgente().getId() != null) {
                AgenteExtintor agente = agenteExtintorRepository.findById(extintor.getAgente().getId())
                        .orElseThrow(() -> new RuntimeException("Agente extintor não encontrado: " + extintor.getAgente().getId()));
                extintor.setAgente(agente);
            }

            if (extintor.getClassesFogo() != null && !extintor.getClassesFogo().isEmpty()) {
                List<ClasseFogo> classes = extintor.getClassesFogo().stream()
                        .map(cf -> classeFogoRepository.findById(cf.getId())
                                .orElseThrow(() -> new RuntimeException("Classe de fogo não encontrada: " + cf.getId())))
                        .collect(Collectors.toList());
                extintor.setClassesFogo(classes);
            }
        }

        if (equipamento instanceof Alarme alarme) {
            if (alarme.getTipoSensor() != null && alarme.getTipoSensor().getId() != null) {
                TipoSensor sensor = tipoSensorRepository.findById(alarme.getTipoSensor().getId())
                        .orElseThrow(() -> new RuntimeException("Tipo de sensor não encontrado: " + alarme.getTipoSensor().getId()));
                alarme.setTipoSensor(sensor);
            }
        }

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