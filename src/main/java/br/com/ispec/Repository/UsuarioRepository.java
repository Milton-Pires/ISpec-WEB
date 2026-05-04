package br.com.ispec.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import br.com.ispec.Entities.Usuario;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByEmail(String email);

} 
