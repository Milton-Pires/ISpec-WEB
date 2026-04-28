package br.com.ispec.Repository;

import br.com.ispec.Entities.Equipamento;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EquipamentoRepository extends JpaRepository<Equipamento, Long> {
    List<Equipamento> findByCliente_Id(Long clienteId);

    List<Equipamento> findByLocalizacao_Id(Long localizacaoId);
}
