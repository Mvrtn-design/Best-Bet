import { React, useState, createContext } from 'react';

const DataContext = createContext({});

export const DataProvider = ({ children }) => {
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
    return (
        <DataContext.Provider value={{
            matches
        }}>
            {children}
        </DataContext.Provider>
    );
}

export default DataContext;