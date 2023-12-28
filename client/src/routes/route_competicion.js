import { Temporada } from "./Temporada";
import { Apuesta } from "./Apuesta";

class PartidaUsuario {
  constructor(usuario,partidaID) {
    this.usuario = usuario;
    this.partidaID = partidaID;
    this.temporada = '2023-2024';
    postNewCompeticion();
  }
  
  async postNewCompeticion() {
    const response = await fetch("http://localhost:3001/addPartida", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  }

  cobrarMonedas(monto) {
    this.monedas += monto;
  }
}

export default PartidaUsuario;
