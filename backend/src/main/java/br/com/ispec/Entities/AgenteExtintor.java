package br.com.ispec.Entities;

import jakarta.persistence.*;

@Entity
@Table(name = "agente_extintor")
public class AgenteExtintor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_agente")
    private Integer id;

    @Column(name = "desc_agente", nullable = false, length = 100)
    private String descAgente;

    public AgenteExtintor() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getDescAgente() { return descAgente; }
    public void setDescAgente(String descAgente) { this.descAgente = descAgente; }
}

