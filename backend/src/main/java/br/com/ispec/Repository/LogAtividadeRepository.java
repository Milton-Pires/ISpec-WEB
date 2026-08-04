package br.com.ispec.Repository;

import br.com.ispec.Entities.LogAtividade;
import br.com.ispec.Entities.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LogAtividadeRepository extends JpaRepository<LogAtividade, Long> {

    List<LogAtividade> findByUsuario(Usuario usuario);
    List<LogAtividade> findByEndpointContaining(String endpoint);
    List<LogAtividade> findByAcao(String acao);
}