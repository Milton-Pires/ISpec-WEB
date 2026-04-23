package br.com.ispec.Entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "inspecao")
public class Inspecao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_inspecao")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_equipamento", nullable = false)
    @JsonIgnoreProperties({"localizacao", "cliente", "tipoEquipamento"})
    private Equipamento equipamento;

    @ManyToOne
    @JoinColumn(name = "id_responsavel", nullable = false)
    private Usuario responsavel;

    @Column(name = "data_inspecao", nullable = false)
    private LocalDate dataInspecao;

    @Column(name = "aprovado")
    private Boolean aprovado;

    @Column(name = "observacoes", columnDefinition = "TEXT")
    private String observacoes;

    public Inspecao() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Equipamento getEquipamento() { return equipamento; }
    public void setEquipamento(Equipamento equipamento) { this.equipamento = equipamento; }

    public Usuario getResponsavel() { return responsavel; }
    public void setResponsavel(Usuario responsavel) { this.responsavel = responsavel; }

    public LocalDate getDataInspecao() { return dataInspecao; }
    public void setDataInspecao(LocalDate dataInspecao) { this.dataInspecao = dataInspecao; }

    public Boolean getAprovado() { return aprovado; }
    public void setAprovado(Boolean aprovado) { this.aprovado = aprovado; }

    public String getObservacoes() { return observacoes; }
    public void setObservacoes(String observacoes) { this.observacoes = observacoes; }
}

