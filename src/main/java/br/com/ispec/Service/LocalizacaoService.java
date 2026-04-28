package br.com.ispec.Service;

import br.com.ispec.Entities.Localizacao;
import br.com.ispec.Repository.LocalizacaoRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class LocalizacaoService {
    private final LocalizacaoRepository repository;

    public LocalizacaoService(LocalizacaoRepository repository) {
        this.repository = repository;
    }

    public List<Localizacao> listarTodas() { return repository.findAll(); }

    public Localizacao buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Localização não encontrada"));
    }

    public Localizacao salvar(Localizacao localizacao) { return repository.save(localizacao); }

    public Localizacao atualizar(Long id, Localizacao nova) {
        Localizacao localizacao = buscarPorId(id);
        localizacao.setBloco(nova.getBloco());
        localizacao.setAndar(nova.getAndar());
        localizacao.setSala(nova.getSala());
        localizacao.setDescricao(nova.getDescricao());
        return repository.save(localizacao);
    }

    public void deletar(Long id) { repository.deleteById(id); }
}

