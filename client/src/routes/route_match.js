const ESTADOS_PARTIDO = {
  READY_TO_PLAY: 0,
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
  constructor(partido) {
    this.club_local = partido.club_local;
    this.club_visitante = partido.club_visitante;
    this.stadium = partido.stadium;
    this.location = partido.location;
    this.date = partido.fecha;
    this.marcador_local = partido.marcador_local;
    this.marcador_visitante = partido.marcador_visitante;
    this.cuota_local = partido.cuota_local;
    this.cuota_empate = partido.cuota_empate;
    this.cuota_visitante = partido.cuota_visitante;
    this.estado_partido = partido.estado_partido;
    this.id_group = partido.id_group;
    this.ID = partido.Idd;
  }

  generateMatchResult() {
    this.marcador_local = Math.round(Math.random() * 4);
    this.marcador_visitante = Math.round(Math.random() * 4);
    this.estado_partido = "ENDED";
    return this;
  }

  updateDatosBackend() {
    
    //get the data and make the put
  }

  generateBettingValues() {
    this.local_cuota = (1.01 + Math.random() * (2.99 - 1.0)).toFixed(2);
    this.empate_cuota = (1.01 + Math.random() * (2.99 - 1.0)).toFixed(2);
    this.visitante_cuota = (1.01 + Math.random() * (2.99 - 1.0)).toFixed(2);
  }

  getResult() {
    return this.marcador_local, this.marcador_visitante;
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
