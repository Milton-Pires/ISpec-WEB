package br.com.ispec.Service;

import br.com.ispec.Entities.AgenteExtintor;
import br.com.ispec.Repository.AgenteExtintorRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AgenteExtintorService {
    private final AgenteExtintorRepository repository;

    public AgenteExtintorService(AgenteExtintorRepository repository) {
        this.repository = repository;
    }

    public List<AgenteExtintor> listarTodos() { return repository.findAll(); }

    public AgenteExtintor buscarPorId(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agente extintor não encontrado"));
    }

    public AgenteExtintor salvar(AgenteExtintor agente) { return repository.save(agente); }

    public void deletar(Integer id) { repository.deleteById(id); }
}
