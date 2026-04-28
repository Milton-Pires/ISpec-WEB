package br.com.ispec.Entities;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "alarme")
@PrimaryKeyJoinColumn(name = "id_equipamento")
public class Alarme extends Equipamento {

    @ManyToOne
    @JoinColumn(name = "id_tipo_sensor", nullable = false)
    private TipoSensor tipoSensor;

    @Column(name = "funcionando", nullable = false)
    private boolean funcionando = true;

    @Column(name = "ultima_verificacao")
    private LocalDate ultimaVerificacao;

    public Alarme() {}

    public boolean precisaTeste() {
        if (ultimaVerificacao == null) return true;
        return ultimaVerificacao.plusMonths(6).isBefore(LocalDate.now());
    }

    @Override
    public boolean precisaManutencao() {
        return !funcionando || precisaTeste() || estaVencido();
    }

    @Override
    public String tipoEquipamentoNome() {
        return "Alarme";
    }

    public TipoSensor getTipoSensor() { return tipoSensor; }
    public void setTipoSensor(TipoSensor tipoSensor) { this.tipoSensor = tipoSensor; }

    public boolean isFuncionando() { return funcionando; }
    public void setFuncionando(boolean funcionando) { this.funcionando = funcionando; }

    public LocalDate getUltimaVerificacao() { return ultimaVerificacao; }
    public void setUltimaVerificacao(LocalDate ultimaVerificacao) { this.ultimaVerificacao = ultimaVerificacao; }
}
