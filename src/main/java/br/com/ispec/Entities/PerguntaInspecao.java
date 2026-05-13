package br.com.ispec.Entities;

import jakarta.persistence.*;

@Entity
@Table(name = "pergunta_inspecao")
public class PerguntaInspecao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pergunta")
    private Long id;

    @Column(name = "pergunta", nullable = false, length = 255, unique = true)
    private String pergunta;

    @Column(name = "tipo_equipamento", nullable = false, length = 50)
    private String tipoEquipamento; // Extintor, Alarme ou Hidrante

    @Column(name = "ativo", nullable = false)
    private boolean ativo = true;

    public PerguntaInspecao() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPergunta() { return pergunta; }
    public void setPergunta(String pergunta) { this.pergunta = pergunta; }

    public String getTipoEquipamento() { return tipoEquipamento; }
    public void setTipoEquipamento(String tipoEquipamento) { this.tipoEquipamento = tipoEquipamento; }

    public boolean isAtivo() { return ativo; }
    public void setAtivo(boolean ativo) { this.ativo = ativo; }
}
