package br.com.ispec.Controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import br.com.ispec.Entities.Cliente;
import br.com.ispec.Entities.Equipamento;
import br.com.ispec.Service.ClienteService;
import br.com.ispec.Service.EquipamentoService;

@RestController
@RequestMapping("/clientes")
public class ClienteController {
    private final ClienteService service;
    private final EquipamentoService equipamentoService;

    public ClienteController(ClienteService service, EquipamentoService equipamentoService) {
        this.service = service;
        this.equipamentoService = equipamentoService;
    }

    @GetMapping
    public List<Cliente> listar() {
        return service.listarTodos();
    }

    @GetMapping("/{id}")
    public Cliente buscar(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    public Cliente criar(@RequestBody Cliente cliente) {
        return service.salvar(cliente);
    }

    @PutMapping("/{id}")
    public Cliente atualizar(@PathVariable Long id, @RequestBody Cliente cliente) {
        return service.atualizar(id, cliente);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        service.deletar(id);
    }

    @GetMapping("/{id}/equipamentos")
    public List<Equipamento> equipamentosCliente(@PathVariable Long id) {
        return equipamentoService.listarPorCliente(id);
    }
}