const ESTADOS_PARTIDO = {
  SIN_JUGAR: 0,
  EN_JUEGO: 1,
  TERMINADO: 2,
};

const ESTADOS_APUESTA = {
  SIN_APUESTA: 0,
  APUESTA_EN_JUEGO: 1,
  GANADA: 2,
  PERDIDA: 3,
};
class MatchGenerator {
  constructor(local, visitante,competicion="amistoso") {
    this.local = local;
    this.visitante = visitante;
    this.stadium = local.stadium;
    this.date = new Date();
    this.matchResult = {};
    this.competicion = competicion;
    this.local_cuota = 0.0;
    this.empate_cuota = 0.0;
    this.visitante_cuota = 0.0;
    this.estado = ESTADOS_PARTIDO.SIN_JUGAR;
    this.bet_result = null;
    this.generateBettingValues();
  }

  generateMatchResult() {
    this.matchResult.localGoals = Math.round(Math.random() * 4);
    this.matchResult.visitanteGoals = Math.round(Math.random() * 4);
  }

  generateBettingValues() {
    this.local_cuota = (
      1.01 +
      Math.random() * (2.99 - 1.0)
    ).toFixed(2);
    this.empate_cuota = (
      1.01 +
      Math.random() * (2.99 - 1.0)
    ).toFixed(2);
    this.visitante_cuota = (
      1.01 +
      Math.random() * (2.99 - 1.0)
    ).toFixed(2);
  }

  getResult() {
    this.generateMatchResult();
    return {
      match: { localGoals: 0, visitanteGoals: 0 },
      bet: this.bettingValues,
    };
  }
  getPreMatch() {
    return {
      local: this.local.name,
      visitante: this.visitante.name,
      golesLocal: 0,
      golesVisitante: 0,
      estado: ESTADOS_PARTIDO.SIN_JUGAR,
      localizacion: this.local.stadium,
      competicion: this.competicion,
      fecha: this.date.toString(),
      local_cuota: this.local_cuota,
      empate_couta: this.empate_cuota,
      visitante_cuota: this.visitante_cuota,
    };
  }
}
module.exports = MatchGenerator;
