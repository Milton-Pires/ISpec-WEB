package br.com.ispec.Service;

import br.com.ispec.Entities.LogAtividade;
import br.com.ispec.Entities.Usuario;
import br.com.ispec.Repository.LogAtividadeRepository;
import br.com.ispec.Repository.UsuarioRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class LogAtividadeService {

    private final LogAtividadeRepository repository;
    private final UsuarioRepository usuarioRepository;
    private final ObjectMapper objectMapper;

    public LogAtividadeService(LogAtividadeRepository repository,
                               UsuarioRepository usuarioRepository,
                               ObjectMapper objectMapper) {
        this.repository = repository;
        this.usuarioRepository = usuarioRepository;
        this.objectMapper = objectMapper;
    }

    public void registrar(String emailUsuario, String acao, String endpoint,
                          Object dadoAntes, Object dadoDepois) {
        try {
            Usuario usuario = usuarioRepository.findByEmail(emailUsuario)
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

            LogAtividade log = new LogAtividade();
            log.setUsuario(usuario);
            log.setAcao(acao);
            log.setEndpoint(endpoint);
            log.setDataHora(LocalDateTime.now());
            log.setDadoAntes(dadoAntes != null ? objectMapper.writeValueAsString(dadoAntes) : null);
            log.setDadoDepois(dadoDepois != null ? objectMapper.writeValueAsString(dadoDepois) : null);

            repository.save(log);
        } catch (Exception e) {
            // Log não deve quebrar o fluxo principal
            System.err.println("Erro ao registrar log: " + e.getMessage());
        }
    }

    public List<LogAtividade> listarTodos() {
        return repository.findAll();
    }

    public List<LogAtividade> listarPorUsuario(Long idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        return repository.findByUsuario(usuario);
    }

    public List<LogAtividade> listarPorAcao(String acao) {
        return repository.findByAcao(acao);
    }
}