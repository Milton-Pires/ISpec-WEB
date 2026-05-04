package br.com.ispec.Entities;

import br.com.ispec.Enums.StatusCliente;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "cliente")
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cliente")
    private Long id;

    @Column(name = "email")
    private String email;

    @Column(name = "telefone", length = 15, nullable = false)
    private String telefone;

    @Column(name = "responsavel")
    private String responsavel;

    @Column(name = "cidade")
    private String cidade;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getObservacoes() {
        return observacoes;
    }

    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }

    public StatusCliente getStatus() {
        return status;
    }

    public void setStatus(StatusCliente status) {
        this.status = status;
    }

    public String getUf() {
        return uf;
    }

    public void setUf(String uf) {
        this.uf = uf;
    }

    public String getCidade() {
        return cidade;
    }

    public void setCidade(String cidade) {
        this.cidade = cidade;
    }

    public String getResponsavel() {
        return responsavel;
    }

    public void setResponsavel(String responsavel) {
        this.responsavel = responsavel;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    @Column(name = "uf", length = 2)
    private String uf;

    @Column(name = "status_cliente", nullable = false)
    private StatusCliente status = StatusCliente.pendente;

    @Column(name = "observacoes", length = 500)
    private String observacoes;

    @Column(name = "razao_social", nullable = false, length = 150)
    private String razaoSocial;

    @Column(name = "cnpj", unique = true, length = 18)
    private String cnpj;

    @Column(name = "endereco", length = 255)
    private String endereco;

    @OneToMany(mappedBy = "cliente")
    @JsonIgnoreProperties("cliente")
    private List<Localizacao> localizacoes;

    public Cliente() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRazaoSocial() { return razaoSocial; }
    public void setRazaoSocial(String razaoSocial) { this.razaoSocial = razaoSocial; }

    public String getCnpj() { return cnpj; }
    public void setCnpj(String cnpj) { this.cnpj = cnpj; }

    public String getEndereco() { return endereco; }
    public void setEndereco(String endereco) { this.endereco = endereco; }

    public List<Localizacao> getLocalizacoes() { return localizacoes; }
    public void setLocalizacoes(List<Localizacao> localizacoes) { this.localizacoes = localizacoes; }
}