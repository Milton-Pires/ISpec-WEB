package br.com.ispec.Controller;

import java.util.*;

import br.com.ispec.Enums.StatusEquipamento;
import org.springframework.web.bind.annotation.*;

import br.com.ispec.Entities.Equipamento;
import br.com.ispec.Entities.Inspecao;
import br.com.ispec.Entities.Manutencao;
import br.com.ispec.Service.EquipamentoService;
import br.com.ispec.Service.InspecaoService;
import br.com.ispec.Service.ManutencaoService;

@RestController
@RequestMapping("/equipamentos")
public class EquipamentoController {
    private final EquipamentoService service;
    private final InspecaoService inspecaoService;
    private final ManutencaoService manutencaoService;

    public EquipamentoController(EquipamentoService service, InspecaoService inspecaoService,
                                 ManutencaoService manutencaoService) {
        this.service = service;
        this.inspecaoService = inspecaoService;
        this.manutencaoService = manutencaoService;
    }

    @GetMapping
    public List<Equipamento> listar() {
        return service.listarTodos();
    }

    @GetMapping("/{id}")
    public Equipamento buscar(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    public Equipamento salvar(@RequestBody Equipamento equipamento) {
        return service.salvar(equipamento);
    }

    @PutMapping("/{id}")
    public Equipamento atualizar(@PathVariable Long id,
                                 @RequestBody Equipamento equipamento) {
        return service.atualizar(id, equipamento);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        service.deletar(id);
    }


    @PatchMapping("/{id}/status")
    public Equipamento atualizarStatus(@PathVariable Long id,
                                       @RequestParam StatusEquipamento status) {
        return service.atualizarStatus(id, status);
    }

    @GetMapping("/{id}/inspecoes")
    public List<Inspecao> inspecoesEquipamento(@PathVariable Long id) {
        return inspecaoService.listarPorEquipamento(id);
    }

    @GetMapping("/{id}/manutencoes")
    public List<Manutencao> manutencoesEquipamento(@PathVariable Long id) {
        return manutencaoService.listarPorEquipamento(id);
    }

    @GetMapping("/precisam-manutencao")
    public List<Equipamento> equipamentosManutencao() {
        return service.equipamentosQuePrecisamManutencao();
    }

}