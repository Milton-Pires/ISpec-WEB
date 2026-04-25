package br.com.ispec.Entities;

import br.com.ispec.Enums.StatusEquipamento;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import jakarta.persistence.*;
import java.time.LocalDate;

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "tipo")
@JsonSubTypes({
        @JsonSubTypes.Type(value = Extintor.class, name = "Extintor"),
        @JsonSubTypes.Type(value = Alarme.class,   name = "Alarme"),
        @JsonSubTypes.Type(value = Hidrante.class, name = "Hidrante")
})
@Entity
@Table(name = "equipamento")
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class Equipamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_equipamento")
    private Long id;

    @Column(name = "num_serie", length = 100)
    private String numSerie;

    @Column(name = "nome", nullable = false, length = 100)
    private String nome;

    @ManyToOne
    @JoinColumn(name = "id_tipo_equip", nullable = false)
    private TipoEquipamento tipoEquipamento;

    @ManyToOne
    @JoinColumn(name = "id_cliente", nullable = false)
    @JsonIgnoreProperties("localizacoes")
    private Cliente cliente;

    @ManyToOne
    @JoinColumn(name = "id_localizacao", nullable = false)
    @JsonIgnoreProperties("cliente")
    private Localizacao localizacao;

    @Column(name = "dt_instalacao", nullable = false)
    private LocalDate dataInstalacao;

    @Column(name = "dt_validade", nullable = false)
    private LocalDate dataValidade;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private StatusEquipamento status = StatusEquipamento.ATIVO;

    public Equipamento() {}

    // --- Lógica de negócio ---

    public boolean estaVencido() {
        return dataValidade != null && dataValidade.isBefore(LocalDate.now());
    }

    public boolean precisaRevisao() {
        if (dataInstalacao == null) return true;
        return dataInstalacao.plusYears(1).isBefore(LocalDate.now());
    }

    public int anosDeUso() {
        if (dataInstalacao == null) return 0;
        return LocalDate.now().getYear() - dataInstalacao.getYear();
    }

    public abstract boolean precisaManutencao();

    public abstract String tipoEquipamentoNome();

    // --- Getters e Setters ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNumSerie() { return numSerie; }
    public void setNumSerie(String numSerie) { this.numSerie = numSerie; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public TipoEquipamento getTipoEquipamento() { return tipoEquipamento; }
    public void setTipoEquipamento(TipoEquipamento tipoEquipamento) { this.tipoEquipamento = tipoEquipamento; }

    public Cliente getCliente() { return cliente; }
    public void setCliente(Cliente cliente) { this.cliente = cliente; }

    public Localizacao getLocalizacao() { return localizacao; }
    public void setLocalizacao(Localizacao localizacao) { this.localizacao = localizacao; }

    public LocalDate getDataInstalacao() {
        return dataInstalacao;
    }

    public void setDataInstalacao(LocalDate dataInstalacao) {
        this.dataInstalacao = dataInstalacao;
    }

    public LocalDate getDataValidade() {
        return dataValidade;
    }

    public void setDataValidade(LocalDate dataValidade) {
        this.dataValidade = dataValidade;
    }

    public StatusEquipamento getStatus() { return status; }
    public void setStatus(StatusEquipamento status) { this.status = status; }
}
