import React from 'react'

function Route_matches() {
  return (
    <div>Route_matches</div>
  )
}
function create_odds(local_elo, away_elo) {
  // marcador esperado para el local y el visitante siguiendo la formula  de Elo
  let expected_local = 1 / (1 + Math.pow(10, (away_elo - local_elo) / 400));
  let expected_away = 1 / (1 + Math.pow(10, (local_elo - away_elo) / 400));

  //suponiendo que cada equipo tiene el 50% lo coventimos en 33% (1/3) para añadir la posbabilidad de empate
  const final_for_local = expected_local * 0.66;
  const final_for_away = expected_away * 0.66;
  const final_for_draw = 1 - final_for_local - final_for_away;

  // Sacando las cuotas a partir de los resultados esperados
  return {
    local: (1 / final_for_local).toFixed(2),
    draw: (1 / final_for_draw).toFixed(2),
    away: (1 / final_for_away).toFixed(2),
  };
}

function generateMatchResult(local_category, away_category) {

  let local_score = Math.floor(Math.random() * 4);
  let away_score = Math.floor(Math.random() * 4);

  if (local_category !== away_category) {

    const worse_team = local_category > away_category ? { team: 'local', maracador: local_score } : { team: 'away', maracador: away_score };
    const better_team = worse_team.team === 'local' ? { team: 'away', maracador: away_score } : { team: 'local', maracador: local_score };

    let aux_score_1 = Math.floor(Math.random() * 4);

    if (aux_score_1 < worse_team.maracador) {
      worse_team.maracador = aux_score_1;
      console.log("cambio en ", worse_team.team);
    }
    if (Math.abs(local_category - away_category) >= 2) {
      var aux_score_2 = Math.floor(Math.random() * 6);
      if (aux_score_2 > better_team.maracador) {
        better_team.maracador = aux_score_2;
      }
    }
    if (worse_team.team === "local") {
      local_score = worse_team.maracador;
      away_score = better_team.maracador;
    } else {
      local_score = better_team.maracador;
      away_score = worse_team.maracador;
    }
  }
  return {
    local: local_score,
    away: away_score,
  };

}

export { Route_matches, create_odds, generateMatchResult };