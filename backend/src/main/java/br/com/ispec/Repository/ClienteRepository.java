package br.com.ispec.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.ispec.Entities.Cliente;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    
}
