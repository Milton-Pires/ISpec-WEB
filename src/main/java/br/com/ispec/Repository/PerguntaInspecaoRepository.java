package br.com.ispec.Repository;

import br.com.ispec.Entities.PerguntaInspecao;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PerguntaInspecaoRepository extends JpaRepository<PerguntaInspecao, Long> {
    List<PerguntaInspecao> findByTipoEquipamentoAndAtivoTrue(String tipoEquipamento);
}