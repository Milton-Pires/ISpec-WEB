package br.com.ispec.Controller;

import br.com.ispec.Entities.Agendamento;
import br.com.ispec.Enums.StatusAgendamento;
import br.com.ispec.Service.AgendamentoService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/agendamentos")
public class AgendamentoController {

    private final AgendamentoService service;

    public AgendamentoController(AgendamentoService service) {
        this.service = service;
    }

    @GetMapping
    public List<Agendamento> listar() {
        return service.listarTodos();
    }

    @GetMapping("/{id}")
    public Agendamento buscar(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @GetMapping("/mes")
    public List<Agendamento> listarPorMes(@RequestParam int ano, @RequestParam int mes) {
        return service.listarPorMes(ano, mes);
    }

    @GetMapping("/vencidos")
    public List<Agendamento> listarVencidos() {
        return service.listarVencidos();
    }

    @PostMapping
    public Agendamento salvar(@RequestBody Agendamento agendamento, Authentication authentication) {
        return service.salvar(agendamento, authentication.getName());
    }

    @PutMapping("/{id}")
    public Agendamento atualizar(@PathVariable Long id, @RequestBody Agendamento agendamento,
                                 Authentication authentication) {
        return service.atualizar(id, agendamento, authentication.getName());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Agendamento> atualizarStatus(@PathVariable Long id,
                                                       @RequestParam StatusAgendamento status) {
        return ResponseEntity.ok(service.atualizarStatus(id, status));
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        service.deletar(id);
    }

    @GetMapping("/meus")
    public List<Agendamento> meus(Principal principal) {
        return service.listarPorEmail(principal.getName());
    }
}