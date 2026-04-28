package br.com.ispec.Repository;

import br.com.ispec.Entities.TipoSensor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TipoSensorRepository extends JpaRepository<TipoSensor, Integer> {
}
