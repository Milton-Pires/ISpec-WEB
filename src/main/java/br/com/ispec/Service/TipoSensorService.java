package br.com.ispec.Service;

import br.com.ispec.Entities.TipoSensor;
import br.com.ispec.Repository.TipoSensorRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TipoSensorService {
    private final TipoSensorRepository repository;

    public TipoSensorService(TipoSensorRepository repository) {
        this.repository = repository;
    }

    public List<TipoSensor> listarTodos() { return repository.findAll(); }

    public TipoSensor buscarPorId(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tipo de sensor não encontrado"));
    }

    public TipoSensor salvar(TipoSensor sensor) { return repository.save(sensor); }

    public void deletar(Integer id) { repository.deleteById(id); }
}
