package br.com.ispec.Controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import br.com.ispec.Entities.Manutencao;
import br.com.ispec.Service.ManutencaoService;

@RestController
@RequestMapping("/manutencoes")
public class ManutencaoController {
    private final ManutencaoService service;

    public ManutencaoController(ManutencaoService service){
        this.service = service;
    }

    @GetMapping
    public List<Manutencao> listar(){
        return service.listarTodas();
    }

    @GetMapping("/{id}")
    public Manutencao buscar(@PathVariable Long id){
        return service.buscarPorId(id);
    }

    @PostMapping
    public Manutencao salvar(@RequestBody Manutencao manutencao){
        return service.salvar(manutencao);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id){
        service.deletar(id);
    }
}
