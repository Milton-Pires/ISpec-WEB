package br.com.ispec.Repository;

import br.com.ispec.Entities.Agendamento;
import br.com.ispec.Enums.StatusAgendamento;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {

    List<Agendamento> findByStatus(StatusAgendamento status);
    List<Agendamento> findByResponsavel_Id(Long responsavelId);
    List<Agendamento> findByDataBetween(LocalDate inicio, LocalDate fim);
    List<Agendamento> findByDataLessThanEqualAndStatus(LocalDate data, StatusAgendamento status);

}