package br.com.ispec.Controller;

import br.com.ispec.Entities.TipoSensor;
import br.com.ispec.Service.TipoSensorService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/tipos-sensor")
public class TipoSensorController {
    private final TipoSensorService service;

    public TipoSensorController(TipoSensorService service) {
        this.service = service;
    }

    @GetMapping
    public List<TipoSensor> listar() { return service.listarTodos(); }

    @GetMapping("/{id}")
    public TipoSensor buscar(@PathVariable Integer id) { return service.buscarPorId(id); }

    @PostMapping
    public TipoSensor salvar(@RequestBody TipoSensor sensor) { return service.salvar(sensor); }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Integer id) { service.deletar(id); }
}
