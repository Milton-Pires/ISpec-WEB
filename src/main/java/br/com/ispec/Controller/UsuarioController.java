package br.com.ispec.Controller;

import java.security.Principal;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import br.com.ispec.Entities.Usuario;
import br.com.ispec.Service.UsuarioService;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {
    private final UsuarioService service;

    public UsuarioController(UsuarioService service){
        this.service = service;
    }

    @GetMapping
    public List<Usuario> listar(){
        return service.listarTodos();
    }

    @GetMapping("/{id}")
    public Usuario buscar(@PathVariable Long id){
        return service.buscarPorId(id);
    }

    @PostMapping
    public Usuario salvar(@RequestBody Usuario usuario){
        return service.salvar(usuario);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id){
        service.deletar(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody Usuario usuario) {
        try {
            Usuario atualizado = service.atualizar(id, usuario);
            return ResponseEntity.ok(atualizado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/me")
    public ResponseEntity<Usuario> me(Authentication authentication) {
        Usuario usuario = service.buscarPorEmail(authentication.getName());
        return ResponseEntity.ok(usuario);
    }

    @GetMapping("/todos")
    public List<Usuario> listarTodos() {
        return service.listarTodos();
    }

    @PutMapping("/me")
    public ResponseEntity<?> atualizarPerfil(@RequestBody Usuario dados, Principal principal) {
        try {
            Usuario atual = service.buscarPorEmail(principal.getName());
            Usuario atualizado = service.atualizar(atual.getId(), dados);
            return ResponseEntity.ok(atualizado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PatchMapping("/me/senha")
    public ResponseEntity<?> trocarSenha(@RequestBody Map<String, String> body, Principal principal) {
        try {
            service.trocarSenha(principal.getName(), body.get("senhaAtual"), body.get("novaSenha"));
            return ResponseEntity.ok("Senha alterada com sucesso!");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
