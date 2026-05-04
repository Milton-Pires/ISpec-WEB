package br.com.ispec.Controller;

import br.com.ispec.Entities.Usuario;
import br.com.ispec.Service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UsuarioService usuarioService;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UsuarioService usuarioService, PasswordEncoder passwordEncoder) {
        this.usuarioService = usuarioService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/cadastro")
    public ResponseEntity<?> cadastrar(@RequestBody Usuario usuario) {
        try {
            usuarioService.salvar(usuario);
            return ResponseEntity.ok("Usuário cadastrado com sucesso!");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuario usuario) {
        try {
            Usuario encontrado = usuarioService.buscarPorEmail(usuario.getEmail());
            if (passwordEncoder.matches(usuario.getSenha(), encontrado.getSenha())) {
                return ResponseEntity.ok("Login realizado com sucesso!");
            }
            return ResponseEntity.status(401).body("Senha incorreta.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body("Usuário não encontrado.");
        }
    }
}