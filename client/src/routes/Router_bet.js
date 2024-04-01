import {React,useState} from 'react';
import Popup from '../pages/partials/Popup';

function Router_bet() {
    const [profile, setProfile] = useState({ name: "John", coins: 100 });
    const [openPopup, setopenPopup] = useState(false);
    const [betCard, setBetCart] = useState(false);
    const [notifications, setNotificaction] = useState({
      apuestas_ganadas: 0,
      apuestas_perdidas: 0,
      apuestas_sin_finalizar: 0,
    });
    const [matches, setMatches] = useState([
      {
        id: 1,
        localTeam: "Team A",
        localGoals: null,
        awayTeam: "Team B",
        awayGoals: null,
        odds: { local: 2.1, draw: 3, away: 2 },
        status: "TO_START",
      },
      {
        id: 2,
        localTeam: "Team C",
        localGoals: null,
        awayTeam: "Team D",
        awayGoals: null,
        odds: { local: 1.5, draw: 3, away: 2.5 },
        status: "TO_START",
      },
      {
        id: 3,
        localTeam: "UUUUUUUUUUUUC",
        localGoals: null,
        awayTeam: "bjvjhvhv D",
        awayGoals: null,
        odds: { local: 1.5, draw: 3, away: 2.5 },
        status: "TO_START",
      },
      {
        id: 4,
        localTeam: "TTTTTTCCCCC",
        localGoals: null,
        awayTeam: "T  u  u  i  D",
        awayGoals: null,
        odds: { local: 1.5, draw: 3, away: 2.5 },
        status: "TO_START",
      },
    ]);
    const [bets, setBets] = useState([]);
    const [sidebar, setSidebar] = useState({
      open: false,
      match: null,
      coinBet: 0,
      odd: 0,
      betChoice: null,
    });
    const findMatchById = (id) =>
      matches.find((match) => match.id === id) || null;
    const handleBet = (matchId, odd, bet_choice) => {
      const match = findMatchById(matchId);
      setSidebar({ open: true, match, coinBet: 0, odd, betChoice: bet_choice });
    };
  
    const handleBetSubmit = (temp_bar) => {
      const bet_status = "ON_GOING"; // ON_GOING | WINNER | LOOSER
      const newBet = {
        match: temp_bar.match,
        amount_bet: temp_bar.coinBet,
        choice: temp_bar.betChoice,
        odd: temp_bar.odd,
        status: bet_status,
      };
      setBets((prevBets) => [...prevBets, newBet]);
      setSidebar({
        open: false,
        matchId: null,
        coinBet: 0,
        odd: 0,
        betChoice: null,
      });
  
      setProfile({ ...profile, coins: profile.coins - temp_bar.coinBet });
    };
  
    const handleBetIncrease = () => {
      if (profile.coins > 0) {
        setSidebar((prevSidebar) => ({
          ...prevSidebar,
          coinBet: sidebar.coinBet + 1,
        }));
      }
    };
  
    const handleBetDecrease = () => {
      if (sidebar.coinBet > 0) {
        setSidebar((prevSidebar) => ({
          ...prevSidebar,
          coinBet: sidebar.coinBet - 1,
        }));
      }
    };
  
    const handleSimulateMatch = (matchId) => {
      setMatches(
        matches.map((match) =>
          match.id === matchId
            ? {
                ...match,
                awayGoals: Math.floor(Math.random() * 5),
                localGoals: Math.floor(Math.random() * 5),
                status: "FINISHED",
              }
            : match
        )
      );
    };
  
    const handleBetClose = () => {
      setSidebar({
        open: false,
        matchId: null,
        coinBet: 0,
        odd: 0,
        betChoice: null,
      });
    };
    const openBetCard = () => {
      setBetCart(true);
    };
    const closeBetCard = () => {
      setBetCart(false);
    };
  
    const checkBetResults = () => {
      const temp_notification = {
        apuestas_ganadas: 0,
        apuestas_perdidas: 0,
        apuestas_sin_finalizar: 0,
      };
  
      let cash_won = 0;
  
      for (let i = 0; i < bets.length; i++) {
        const match_aux = findMatchById(bets[i].match.id);
  
        if (match_aux.status === "FINISHED") {
          console.log("Match  finished");
  
          let match_result = "";
          if (match_aux.localGoals > match_aux.awayGoals) {
            match_result = "Local";
          } else if (match_aux.localGoals < match_aux.awayGoals) {
            match_result = "Away";
          } else {
            match_result = "Draw";
          }
          let decitiion = "";
          if (bets[i].choice === match_result) {
            temp_notification.apuestas_ganadas++;
            decitiion = `WINNER (+ ${bets[i].amount_bet * bets[i].odd})`;
            cash_won += bets[i].amount_bet * bets[i].odd;
          } else {
            decitiion = "LOOSER";
            temp_notification.apuestas_perdidas++;
          }
          const newBets = [...bets];
          newBets[i].status = decitiion;
          setBets(newBets);
        } else {
          temp_notification.apuestas_sin_finalizar++;
        }
      }
  
      setNotificaction((prevNotifications) => ({
        ...prevNotifications,
        apuestas_sin_finalizar: temp_notification.apuestas_sin_finalizar,
        apuestas_ganadas: temp_notification.apuestas_ganadas,
        apuestas_perdidas: temp_notification.apuestas_perdidas,
      }));
      setopenPopup(true);
  
      setProfile({
        ...profile,
        coins: profile.coins + cash_won,
      });
    };
  
    if (openPopup) {
      return (
        <Popup trigger={openPopup} setTrigger={setopenPopup}>
          <p>- Ganadas: {notifications.apuestas_ganadas} </p>
          <p>- Perdidas: {notifications.apuestas_perdidas}</p>
          <p>- Sin finalizar: {notifications.apuestas_sin_finalizar} </p>
        </Popup>
      );
    }
  
    return (
      <div className="App">
        <h1>{profile.name}</h1>
        <p>Coins: {profile.coins}</p>
        <div className="matches">
          {matches.map((match) => (
            <div key={match.id} className="match">
              <p>
                {match.localTeam} vs {match.awayTeam}
              </p>
              <button
                onClick={() => handleBet(match.id, match.odds.local, "Local")}
                disabled={match.status !== "TO_START"}
              >
                Bet Local - {match.odds.local}
              </button>
              <button
                onClick={() => handleBet(match.id, match.odds.draw, "Draw")}
                disabled={match.status !== "TO_START"}
              >
                Bet Draw - {match.odds.draw}
              </button>
              <button
                onClick={() => handleBet(match.id, match.odds.away, "Away")}
                disabled={match.status !== "TO_START"}
              >
                Bet Away - {match.odds.away}
              </button>
              {match.status !== "TO_START" && (
                <p>
                  RESULT: {match.localGoals} - {match.awayGoals}
                </p>
              )}
              {match.status === "TO_START" && (
                <button onClick={() => handleSimulateMatch(match.id)}>
                  Simulate Match
                </button>
              )}
            </div>
          ))}
        </div>
        {sidebar.open && (
          <div className="popup">
            <div className="popup-inner">
              <h2>
                En partido: {sidebar.match.localTeam} vs {sidebar.match.awayTeam}
              </h2>
              <p>Bet Amount: {sidebar.coinBet}</p>
              <p>
                CHOICE: {sidebar.betChoice} ({sidebar.odd})
              </p>
              <button onClick={handleBetIncrease}>+</button>
              <button onClick={handleBetDecrease}>-</button>
              <p>Potential win: {sidebar.coinBet * sidebar.odd}</p>
              <button
                onClick={() => handleBetSubmit(sidebar)}
                disabled={sidebar.match.status !== "TO_START"}
              >
                Confirm Bet
              </button>
              <button onClick={handleBetClose}>Cancel</button>
            </div>
          </div>
        )}
        <h2>Bets</h2>
        <button onClick={openBetCard}>Ver Apuestas</button>
        {betCard && (
          <div className="popup">
            <div className="popup-inner">
              <div className="bets">
                {bets.map((bet, index) => (
                  <div key={index} className="bet">
                    <h2>
                      Match: {bet.match.localTeam} vs {bet.match.awayTeam}
                    </h2>
                    <p>Bet Amount: {bet.amount_bet}</p>
                    <p>
                      {" "}
                      Choice: {bet.choice} ({bet.odd})yy{" "}
                    </p>
                    <p>Result: {bet.status}</p>
                  </div>
                ))}
              </div>
              <button onClick={checkBetResults}>CHECK BET RESULTS</button>
              <button onClick={closeBetCard}>CERRAR</button>
            </div>
          </div>
        )}
      </div>
    );
}

export default Router_bet