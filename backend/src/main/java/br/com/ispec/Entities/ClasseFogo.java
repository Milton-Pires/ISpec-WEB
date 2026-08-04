package br.com.ispec.Entities;

import jakarta.persistence.*;

@Entity
@Table(name = "classe_fogo")
public class ClasseFogo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cl_fogo")
    private Integer id;

    @Column(name = "desc_cl_fogo", nullable = false, length = 10)
    private String descClFogo;

    public ClasseFogo() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getDescClFogo() { return descClFogo; }
    public void setDescClFogo(String descClFogo) { this.descClFogo = descClFogo; }
}
