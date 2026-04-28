package br.com.ispec.Entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "extintor")
@PrimaryKeyJoinColumn(name = "id_equipamento")
public class Extintor extends Equipamento {

    @ManyToOne
    @JoinColumn(name = "id_agente", nullable = false)
    private AgenteExtintor agente;

    @Column(name = "capacidade")
    private Double capacidade;

    @Column(name = "pressao")
    private Double pressao;

    @ManyToMany
    @JoinTable(
        name = "equipamento_classe_fogo",
        joinColumns = @JoinColumn(name = "id_equipamento"),
        inverseJoinColumns = @JoinColumn(name = "id_cl_fogo")
    )
    private List<ClasseFogo> classesFogo;

    public Extintor() {}

    public boolean pressaoAdequada() {
        return pressao != null && pressao >= 10;
    }

    @Override
    public boolean precisaManutencao() {
        return estaVencido() || !pressaoAdequada();
    }

    @Override
    public String tipoEquipamentoNome() {
        return "Extintor";
    }

    public AgenteExtintor getAgente() { return agente; }
    public void setAgente(AgenteExtintor agente) { this.agente = agente; }

    public Double getCapacidade() { return capacidade; }
    public void setCapacidade(Double capacidade) { this.capacidade = capacidade; }

    public Double getPressao() { return pressao; }
    public void setPressao(Double pressao) { this.pressao = pressao; }

    public List<ClasseFogo> getClassesFogo() { return classesFogo; }
    public void setClassesFogo(List<ClasseFogo> classesFogo) { this.classesFogo = classesFogo; }
}
