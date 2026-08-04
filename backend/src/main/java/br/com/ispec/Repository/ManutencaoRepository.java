package br.com.ispec.Repository;

import br.com.ispec.Entities.Manutencao;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface ManutencaoRepository extends JpaRepository<Manutencao, Long> {
    List<Manutencao> findByEquipamento_Id(Long equipamentoId);
    List<Manutencao> findByTecnico_Id(Long tecnicoId);
    List<Manutencao> findByEquipamento_Cliente_IdAndDataManutencaoBetween(Long clienteId, LocalDate inicio, LocalDate fim);
}