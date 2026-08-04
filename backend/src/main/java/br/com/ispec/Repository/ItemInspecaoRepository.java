package br.com.ispec.Repository;

import br.com.ispec.Entities.Inspecao;
import br.com.ispec.Entities.ItemInspecao;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ItemInspecaoRepository extends JpaRepository<ItemInspecao, Long> {
    List<ItemInspecao> findByInspecao(Inspecao inspecao);
    void deleteByInspecao(Inspecao inspecao);
}