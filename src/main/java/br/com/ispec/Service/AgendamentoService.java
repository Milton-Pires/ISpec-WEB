package br.com.ispec.Service;

import br.com.ispec.Entities.Agendamento;
import br.com.ispec.Entities.Usuario;
import br.com.ispec.Enums.StatusAgendamento;
import br.com.ispec.Repository.AgendamentoRepository;
import br.com.ispec.Repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class AgendamentoService {

    private final AgendamentoRepository repository;
    private final UsuarioRepository usuarioRepository;

    public AgendamentoService(AgendamentoRepository repository,
                              UsuarioRepository usuarioRepository) {
        this.repository = repository;
        this.usuarioRepository = usuarioRepository;
    }

    public List<Agendamento> listarTodos() {
        return repository.findAll();
    }

    public Agendamento buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agendamento não encontrado: " + id));
    }

    public List<Agendamento> listarPorMes(int ano, int mes) {
        LocalDate inicio = LocalDate.of(ano, mes, 1);
        LocalDate fim    = inicio.withDayOfMonth(inicio.lengthOfMonth());
        return repository.findByDataBetween(inicio, fim);
    }

    public List<Agendamento> listarVencidos() {
        return repository.findByDataLessThanEqualAndStatus(
                LocalDate.now(), StatusAgendamento.PENDENTE);
    }

    public Agendamento salvar(Agendamento agendamento, String emailResponsavel) {
        if (agendamento.getResponsavel() == null || agendamento.getResponsavel().getId() == null) {
            Usuario usuario = usuarioRepository.findByEmail(emailResponsavel)
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
            agendamento.setResponsavel(usuario);
        } else {
            Usuario usuario = usuarioRepository.findById(agendamento.getResponsavel().getId())
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
            agendamento.setResponsavel(usuario);
        }
        return repository.save(agendamento);
    }

    public Agendamento atualizarStatus(Long id, StatusAgendamento status) {
        Agendamento agendamento = buscarPorId(id);
        agendamento.setStatus(status);
        return repository.save(agendamento);
    }

    public Agendamento atualizar(Long id, Agendamento dados, String emailResponsavel) {
        Agendamento agendamento = buscarPorId(id);
        agendamento.setTitulo(dados.getTitulo());
        agendamento.setDescricao(dados.getDescricao());
        agendamento.setData(dados.getData());
        agendamento.setTipo(dados.getTipo());
        if (dados.getResponsavel() != null && dados.getResponsavel().getId() != null) {
            Usuario usuario = usuarioRepository.findById(dados.getResponsavel().getId())
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
            agendamento.setResponsavel(usuario);
        }
        return repository.save(agendamento);
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }
}