package br.com.ispec.Service;

import br.com.ispec.Entities.ClasseFogo;
import br.com.ispec.Repository.ClasseFogoRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ClasseFogoService {
    private final ClasseFogoRepository repository;

    public ClasseFogoService(ClasseFogoRepository repository) {
        this.repository = repository;
    }

    public List<ClasseFogo> listarTodas() { return repository.findAll(); }

    public ClasseFogo buscarPorId(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Classe de fogo não encontrada"));
    }

    public ClasseFogo salvar(ClasseFogo classe) { return repository.save(classe); }

    public void deletar(Integer id) { repository.deleteById(id); }
}
