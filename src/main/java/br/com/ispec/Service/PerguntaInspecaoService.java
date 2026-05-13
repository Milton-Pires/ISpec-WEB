package br.com.ispec.Service;

import br.com.ispec.Entities.PerguntaInspecao;
import br.com.ispec.Repository.PerguntaInspecaoRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PerguntaInspecaoService {

    private final PerguntaInspecaoRepository repository;

    public PerguntaInspecaoService(PerguntaInspecaoRepository repository) {
        this.repository = repository;
    }

    public List<PerguntaInspecao> listarTodas() {
        return repository.findAll();
    }

    public List<PerguntaInspecao> listarPorTipo(String tipoEquipamento) {
        return repository.findByTipoEquipamentoAndAtivoTrue(tipoEquipamento);
    }

    public PerguntaInspecao salvar(PerguntaInspecao pergunta) {
        return repository.save(pergunta);
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }
}