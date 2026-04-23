package br.com.ispec.Service;

import br.com.ispec.Entities.Equipamento;
import br.com.ispec.Repository.EquipamentoRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class EquipamentoService {
    private final EquipamentoRepository repository;

    public EquipamentoService(EquipamentoRepository repository) {
        this.repository = repository;
    }

    public List<Equipamento> listarTodos() { return repository.findAll(); }

    public Equipamento buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipamento não encontrado"));
    }

    public Equipamento salvar(Equipamento equipamento) { return repository.save(equipamento); }

    public Equipamento atualizar(Long id, Equipamento equipamentoAtualizado) {
        Equipamento equipamento = buscarPorId(id);
        equipamento.setNome(equipamentoAtualizado.getNome());
        equipamento.setNumSerie(equipamentoAtualizado.getNumSerie());
        equipamento.setStatus(equipamentoAtualizado.getStatus());
        equipamento.setDtValidade(equipamentoAtualizado.getDtValidade());
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

