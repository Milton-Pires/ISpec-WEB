package br.com.ispec.Entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "log_atividade")
public class LogAtividade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_log")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @Column(name = "acao", nullable = false, length = 10)
    private String acao; // GET, POST, PUT, DELETE

    @Column(name = "endpoint", nullable = false, length = 255)
    private String endpoint;

    @Column(name = "data_hora", nullable = false)
    private LocalDateTime dataHora = LocalDateTime.now();

    @Column(name = "dado_antes", columnDefinition = "TEXT")
    private String dadoAntes;

    @Column(name = "dado_depois", columnDefinition = "TEXT")
    private String dadoDepois;

    public LogAtividade() {}

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }

    public String getAcao() { return acao; }
    public void setAcao(String acao) { this.acao = acao; }

    public String getEndpoint() { return endpoint; }
    public void setEndpoint(String endpoint) { this.endpoint = endpoint; }

    public LocalDateTime getDataHora() { return dataHora; }
    public void setDataHora(LocalDateTime dataHora) { this.dataHora = dataHora; }

    public String getDadoAntes() { return dadoAntes; }
    public void setDadoAntes(String dadoAntes) { this.dadoAntes = dadoAntes; }

    public String getDadoDepois() { return dadoDepois; }
    public void setDadoDepois(String dadoDepois) { this.dadoDepois = dadoDepois; }
}