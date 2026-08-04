package br.com.ispec.Controller;

import br.com.ispec.Entities.TipoEquipamento;
import br.com.ispec.Service.TipoEquipamentoService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/tipos-equipamento")
public class TipoEquipamentoController {
    private final TipoEquipamentoService service;

    public TipoEquipamentoController(TipoEquipamentoService service) {
        this.service = service;
    }

    @GetMapping
    public List<TipoEquipamento> listar() { return service.listarTodos(); }

    @GetMapping("/{id}")
    public TipoEquipamento buscar(@PathVariable Integer id) { return service.buscarPorId(id); }

    @PostMapping
    public TipoEquipamento salvar(@RequestBody TipoEquipamento tipo) { return service.salvar(tipo); }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Integer id) { service.deletar(id); }
}
