package br.com.ispec.Controller;

import br.com.ispec.Entities.AgenteExtintor;
import br.com.ispec.Service.AgenteExtintorService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/agentes-extintor")
public class AgenteExtintorController {
    private final AgenteExtintorService service;

    public AgenteExtintorController(AgenteExtintorService service) {
        this.service = service;
    }

    @GetMapping
    public List<AgenteExtintor> listar() { return service.listarTodos(); }

    @GetMapping("/{id}")
    public AgenteExtintor buscar(@PathVariable Integer id) { return service.buscarPorId(id); }

    @PostMapping
    public AgenteExtintor salvar(@RequestBody AgenteExtintor agente) { return service.salvar(agente); }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Integer id) { service.deletar(id); }
}
