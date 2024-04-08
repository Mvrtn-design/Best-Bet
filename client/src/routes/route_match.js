import axios from "axios";

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

export async function getClubes() {
  await axios
    .get("http://localhost:3001/getClubes")
    .then((result) => {
      return (result.data);
    })
    .catch((err) => {
      console.error("No va por: ", err);
    });
}
export class MatchGenerator {
  constructor(local, visitante, fecha) {

    this.visitante = {
      nombre: visitante.name,
      marcador: null,
    }
    this.local = {
      nombre: local.name,
      marcador: null,
    }
    this.stadium = local.stadium;
    this.location = local.country;
    this.date = fecha;
    this.cuota_local = null;
    this.cuota_empate = null;
    this.cuota_visitante = null;
    this.estado_partido = 'NOT_STARTED';
    this.competicion = 'aaaamistoso';
    this.makeCuotas();
  }

  generateMatchResult() {
    console.log(this);
    this.local.marcador = Math.round(Math.random() * 4);
    this.visitante.marcador = Math.round(Math.random() * 4);
    this.estado_partido = "ENDED";
    return this;
  }

  play() {
    this.generateMatchResult();
    return (this.getPartidoHTML());
  }

  makeCuotas() {
    this.cuota_local = parseFloat(Math.random() * (1.9 - 1.1) + 1.1).toFixed(2);
    this.cuota_visitante = parseFloat(Math.random() * (1.9 - 1.1) + 1.1).toFixed(2);
    this.cuota_empate = parseFloat(Math.random() * (1.9 - 1.1) + 1.1).toFixed(2);
  }
  generateBettingValues() {
    this.local_cuota = (1.01 + Math.random() * (2.99 - 1.0)).toFixed(2);
    this.empate_cuota = (1.01 + Math.random() * (2.99 - 1.0)).toFixed(2);
    this.visitante_cuota = (1.01 + Math.random() * (2.99 - 1.0)).toFixed(2);
  }

  getResult() {
    return (this.marcador_local, this.marcador_visitante);
  }

  getPreMatch() {
    return {
      local: this.local.nombre,
      visitante: this.visitante.nombre,
      golesLocal: this.marcador_local,
      golesVisitante: this.marcador_visitante,
      estado: this.estado_partido,
      localizacion: this.stadium,
      competicion: this.competicion,
      fecha: this.date,
      local_cuota: this.local_cuota,
      empate_couta: this.empate_cuota,
      visitante_cuota: this.visitante_cuota,
    };
  }
  getPartidoHTML() {
    return (

      <div className="match-container">
        <div className="match-header">
          <div className="match-date">{this.date}</div>
          <div className="match-location">
            <p className="match-stadium">{this.stadium}</p> - {this.location}
          </div>
          <div className="match-status">{this.estado_partido}</div>
        </div>
        <div className="match-body">
          <div className="match-column">
            <p className="match-team"> {this.local.nombre}</p>
          </div>
          <div className="match-column">
            {this.local.marcador}-
            {this.visitante.marcador}
          </div>
          <div className="match-column">
            <p className="match-team">{this.visitante.nombre}</p>
          </div>

        </div>
        <div className="match-actions">
          1<button
            onClick={() => handleBet(match,
              match.cuota_local,
              "Local")}
            disabled={this.estado_partido !== "NOT_STARTED"} >
            {this.cuota_local}
          </button>
          X<button>{this.cuota_empate}</button>
          2<button>{this.cuota_visitante}</button>
        </div>
        <div className="match-footer">
          <button
            onClick={() => handlePlayMatch()}
            disabled={ this.estado_partido !== "READY_TO_PLAY"}
          >
            JUGAR PARTIDO
          </button>
        </div>
      </div>
    )
  }
}
