package br.com.ispec.Service;

import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import br.com.ispec.Entities.Cliente;
import br.com.ispec.Repository.ClienteRepository;

@Service
public class ClienteService {
    private final ClienteRepository repository;
    private final LogAtividadeService logService;

    public ClienteService(ClienteRepository repository, LogAtividadeService logService) {
        this.repository = repository;
        this.logService = logService;
    }

    public List<Cliente> listarTodos() {
        return repository.findAll();
    }

    public Cliente buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
    }

    public Cliente salvar(Cliente cliente) {
        Cliente salvo = repository.save(cliente);
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        logService.registrar(email, "POST", "/clientes", null, salvo);
        return salvo;
    }

    public Cliente atualizar(Long id, Cliente clienteNovo) {
        Cliente clienteAntigo = buscarPorId(id);
        clienteAntigo.setRazaoSocial(clienteNovo.getRazaoSocial());
        clienteAntigo.setCnpj(clienteNovo.getCnpj());
        clienteAntigo.setEmail(clienteNovo.getEmail());
        clienteAntigo.setTelefone(clienteNovo.getTelefone());
        clienteAntigo.setResponsavel(clienteNovo.getResponsavel());
        clienteAntigo.setCidade(clienteNovo.getCidade());
        clienteAntigo.setUf(clienteNovo.getUf());
        clienteAntigo.setEndereco(clienteNovo.getEndereco());
        clienteAntigo.setStatus(clienteNovo.getStatus());
        clienteAntigo.setObservacoes(clienteNovo.getObservacoes());

        Cliente atualizado = repository.save(clienteAntigo);
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        logService.registrar(email, "PUT", "/clientes/" + id, clienteAntigo, atualizado);
        return atualizado;
    }

    public void deletar(Long id) {
        Cliente cliente = buscarPorId(id);
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        logService.registrar(email, "DELETE", "/clientes/" + id, cliente, null);
        repository.deleteById(id);
    }
}