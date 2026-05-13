package br.com.ispec.Controller;

import br.com.ispec.Entities.PerguntaInspecao;
import br.com.ispec.Service.PerguntaInspecaoService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/perguntas-inspecao")
public class PerguntaInspecaoController {

    private final PerguntaInspecaoService service;

    public PerguntaInspecaoController(PerguntaInspecaoService service) {
        this.service = service;
    }

    @GetMapping
    public List<PerguntaInspecao> listar() {
        return service.listarTodas();
    }

    @GetMapping("/tipo/{tipo}")
    public List<PerguntaInspecao> listarPorTipo(@PathVariable String tipo) {
        return service.listarPorTipo(tipo);
    }

    @PostMapping
    public PerguntaInspecao salvar(@RequestBody PerguntaInspecao pergunta) {
        return service.salvar(pergunta);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        service.deletar(id);
    }
}