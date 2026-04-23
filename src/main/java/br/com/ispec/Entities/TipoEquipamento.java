package br.com.ispec.Entities;

import jakarta.persistence.*;

@Entity
@Table(name = "tipo_equipamento")
public class TipoEquipamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tipo_equip")
    private Integer id;

    @Column(name = "desc_tipo", nullable = false, length = 50)
    private String descTipo;

    public TipoEquipamento() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getDescTipo() { return descTipo; }
    public void setDescTipo(String descTipo) { this.descTipo = descTipo; }
}
