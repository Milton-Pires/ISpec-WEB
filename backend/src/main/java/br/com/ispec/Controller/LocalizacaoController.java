package br.com.ispec.Controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import br.com.ispec.Entities.Equipamento;
import br.com.ispec.Entities.Localizacao;
import br.com.ispec.Service.EquipamentoService;
import br.com.ispec.Service.LocalizacaoService;

@RestController
@RequestMapping("/localizacoes")
public class LocalizacaoController {
    private final LocalizacaoService service;
    private final EquipamentoService equipamentoService;

    public LocalizacaoController(LocalizacaoService service, EquipamentoService equipamentoService) {
        this.service = service;
        this.equipamentoService = equipamentoService;
    }

    @GetMapping
    public List<Localizacao> listar() {
        return service.listarTodas();
    }

    @GetMapping("/{id}")
    public Localizacao buscar(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    public Localizacao salvar(@RequestBody Localizacao localizacao) {
        return service.salvar(localizacao);
    }

    @PutMapping("/{id}")
    public Localizacao atualizar(@PathVariable Long id, @RequestBody Localizacao localizacao) {
        return service.atualizar(id, localizacao);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        service.deletar(id);
    }

    @GetMapping("/{id}/equipamentos")
    public List<Equipamento> equipamentosPorLocalizacao(@PathVariable Long id) {
        return equipamentoService.listarPorLocalizacao(id);
    }
}