package br.com.ispec.DTO;

import br.com.ispec.Entities.ItemInspecao;
import java.time.LocalDate;
import java.util.List;

public class InspecaoDTO {

    private Long equipamentoId;
    private Long responsavelId;
    private LocalDate dataInspecao;
    private String observacoes;
    private List<ItemDTO> itens;

    public static class ItemDTO {
        private Long perguntaId;
        private boolean resposta;

        public Long getPerguntaId() { return perguntaId; }
        public void setPerguntaId(Long perguntaId) { this.perguntaId = perguntaId; }
        public boolean isResposta() { return resposta; }
        public void setResposta(boolean resposta) { this.resposta = resposta; }
    }

    public Long getEquipamentoId() { return equipamentoId; }
    public void setEquipamentoId(Long equipamentoId) { this.equipamentoId = equipamentoId; }

    public Long getResponsavelId() { return responsavelId; }
    public void setResponsavelId(Long responsavelId) { this.responsavelId = responsavelId; }

    public LocalDate getDataInspecao() { return dataInspecao; }
    public void setDataInspecao(LocalDate dataInspecao) { this.dataInspecao = dataInspecao; }

    public String getObservacoes() { return observacoes; }
    public void setObservacoes(String observacoes) { this.observacoes = observacoes; }

    public List<ItemDTO> getItens() { return itens; }
    public void setItens(List<ItemDTO> itens) { this.itens = itens; }
}
