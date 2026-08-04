package br.com.ispec.Entities;

import jakarta.persistence.*;

@Entity
@Table(name = "item_inspecao")
public class ItemInspecao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_item")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_inspecao", nullable = false)
    private Inspecao inspecao;

    @ManyToOne
    @JoinColumn(name = "id_pergunta", nullable = false)
    private PerguntaInspecao pergunta;

    @Column(name = "resposta", nullable = false)
    private boolean resposta; // true = Sim, false = Não

    @Column(name = "observacao", length = 255)
    private String observacao;

    public ItemInspecao() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Inspecao getInspecao() { return inspecao; }
    public void setInspecao(Inspecao inspecao) { this.inspecao = inspecao; }

    public PerguntaInspecao getPergunta() { return pergunta; }
    public void setPergunta(PerguntaInspecao pergunta) { this.pergunta = pergunta; }

    public boolean isResposta() { return resposta; }
    public void setResposta(boolean resposta) { this.resposta = resposta; }

    public String getObservacao() { return observacao; }
    public void setObservacao(String observacao) { this.observacao = observacao; }
}