package br.com.ispec.Controller;

import br.com.ispec.Entities.ClasseFogo;
import br.com.ispec.Service.ClasseFogoService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/classes-fogo")
public class ClasseFogoController {
    private final ClasseFogoService service;

    public ClasseFogoController(ClasseFogoService service) {
        this.service = service;
    }

    @GetMapping
    public List<ClasseFogo> listar() { return service.listarTodas(); }

    @GetMapping("/{id}")
    public ClasseFogo buscar(@PathVariable Integer id) { return service.buscarPorId(id); }

    @PostMapping
    public ClasseFogo salvar(@RequestBody ClasseFogo classe) { return service.salvar(classe); }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Integer id) { service.deletar(id); }
}
