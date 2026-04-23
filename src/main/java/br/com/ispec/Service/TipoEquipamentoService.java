package br.com.ispec.Service;

import br.com.ispec.Entities.TipoEquipamento;
import br.com.ispec.Repository.TipoEquipamentoRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TipoEquipamentoService {
    private final TipoEquipamentoRepository repository;

    public TipoEquipamentoService(TipoEquipamentoRepository repository) {
        this.repository = repository;
    }

    public List<TipoEquipamento> listarTodos() { return repository.findAll(); }

    public TipoEquipamento buscarPorId(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tipo de equipamento não encontrado"));
    }

    public TipoEquipamento salvar(TipoEquipamento tipo) { return repository.save(tipo); }

    public void deletar(Integer id) { repository.deleteById(id); }
}
