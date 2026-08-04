package br.com.ispec.Entities;

import jakarta.persistence.*;

@Entity
@Table(name = "tipo_sensor")
public class TipoSensor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tipo_sensor")
    private Integer id;

    @Column(name = "desc_sensor", nullable = false, length = 50)
    private String descSensor;

    public TipoSensor() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getDescSensor() { return descSensor; }
    public void setDescSensor(String descSensor) { this.descSensor = descSensor; }
}
