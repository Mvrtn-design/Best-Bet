import axios from "axios";
import Grupos from "../pages/partials/Groups";

class Competition {
  constructor(ID, nombre, temporada, estado) {
    this.ID = ID;
    this.nombre = nombre;
    this.temporada = temporada;
    this.estado = estado;
    this.clubes = [];
  }
  getNombre() {
    return this.nombre;
  }
  getClubes() {
    if (this.estado.includes("1")) {
      return [];
    } else if (this.estado.includes("2")) {
      return this.clubes;
    }
  }
  setNombre(estaado) {
    this.nombre = estaado;
  }
  

  getHTMLbyEstado() {
    let textt = [];

    if (this.estado.includes("1")) {
      return (
        <div>
          <button onClick={() => (textt = this.makeGroupDraw())}>
            HACER GRUPOS
          </button>
        </div>
      );
    } else if (this.estado.includes("2")) {
      return (
        <div>
          <Grupos hayAlgo={true} />
          {textt.map((item) => (
            <div key={item.ID}>
              <p>{item.name}</p>
              <p>{item.country}</p>
              <p>{item.stadium}</p>
            </div>
          ))}
        </div>
      );
    }
  }
  async makeGroupDraw() {
    const cantidadClubes = 32;
    try {
      const responseCompeticion = await axios.get(
        `http://localhost:3001/getSomeClubesByCategory/${cantidadClubes}`
      );
      const datos = responseCompeticion.data;
      this.estado = "2.CLUBES_COGIDOS";
      this.clubes = datos;
      return datos;
    } catch (error) {
      console.error("Error getting competitions:", error);
    }
  }
}
export default Competition;
