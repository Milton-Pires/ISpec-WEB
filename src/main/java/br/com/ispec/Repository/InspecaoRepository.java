package br.com.ispec.Repository;

import br.com.ispec.Entities.Inspecao;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InspecaoRepository extends JpaRepository<Inspecao, Long> {

    List<Inspecao> findByEquipamento_Id(Long equipamentoId);

    List<Inspecao> findByResponsavel_Id(Long responsavelId);

    List<Inspecao> findByEquipamento_Cliente_Id(Long clienteId);

    List<Inspecao> findByEquipamento_Localizacao_Id(Long localizacaoId);
}
