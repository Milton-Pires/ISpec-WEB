package br.com.ispec.Controller;

import br.com.ispec.DTO.InspecaoDTO;
import br.com.ispec.Entities.Inspecao;
import br.com.ispec.Entities.ItemInspecao;
import br.com.ispec.Service.InspecaoService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/inspecoes")
public class InspecaoController {

    private final InspecaoService service;

    public InspecaoController(InspecaoService service) {
        this.service = service;
    }

    @GetMapping
    public List<Inspecao> listar() {
        return service.listarTodas();
    }

    @GetMapping("/{id}")
    public Inspecao buscar(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @GetMapping("/{id}/itens")
    public List<ItemInspecao> listarItens(@PathVariable Long id) {
        return service.listarItensPorInspecao(id);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        service.deletar(id);
    }

    @PostMapping
    public Inspecao salvar(@RequestBody InspecaoDTO dto, Authentication authentication) {
        String email = authentication.getName();
        return service.salvarDTO(dto, email);
    }
}