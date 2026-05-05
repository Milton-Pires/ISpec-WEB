package br.com.ispec.Controller;

import br.com.ispec.Entities.LogAtividade;
import br.com.ispec.Service.LogAtividadeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/logs")
public class LogController {

    private final LogAtividadeService service;

    public LogController(LogAtividadeService service) {
        this.service = service;
    }

    @GetMapping
    public List<LogAtividade> listarTodos() {
        return service.listarTodos();
    }

    @GetMapping("/usuario/{id}")
    public List<LogAtividade> listarPorUsuario(@PathVariable Long id) {
        return service.listarPorUsuario(id);
    }

    @GetMapping("/acao/{acao}")
    public List<LogAtividade> listarPorAcao(@PathVariable String acao) {
        return service.listarPorAcao(acao.toUpperCase());
    }
}