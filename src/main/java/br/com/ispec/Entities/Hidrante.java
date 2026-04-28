package br.com.ispec.Entities;

import jakarta.persistence.*;

@Entity
@Table(name = "hidrante")
@PrimaryKeyJoinColumn(name = "id_equipamento")
public class Hidrante extends Equipamento {

    @Column(name = "pressao_agua")
    private Double pressaoAgua;

    @Column(name = "comprimento_mangueira")
    private Double comprimentoMangueira;

    public Hidrante() {}

    private boolean pressaoSuficiente() {
        return pressaoAgua != null && pressaoAgua >= 5;
    }

    @Override
    public boolean precisaManutencao() {
        return !pressaoSuficiente()
            || (comprimentoMangueira != null && comprimentoMangueira < 20)
            || estaVencido();
    }

    @Override
    public String tipoEquipamentoNome() {
        return "Hidrante";
    }

    public Double getPressaoAgua() { return pressaoAgua; }
    public void setPressaoAgua(Double pressaoAgua) { this.pressaoAgua = pressaoAgua; }

    public Double getComprimentoMangueira() { return comprimentoMangueira; }
    public void setComprimentoMangueira(Double comprimentoMangueira) { this.comprimentoMangueira = comprimentoMangueira; }
}
