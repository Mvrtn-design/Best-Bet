import React from 'react';
import { useState } from 'react';
import Layout from "./partials/Layout";
import { AiFillBackward } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

function FAQ() {

  const [active, setActive] = useState(-1);
  const navigate = useNavigate();
  const data = [
    {
      question: 'How can I simulate a match?',
      answer: ' You can simulate a match by clicking the "JUGAR PARTIDO" (Play Match) button in the "Matched" section. This action is only available if the competition is in the "Matched" state, the match is ready to play, and the user has the necessary permissions.',
    },
    {
      question: 'How can I place a bet on a match?',
      answer: 'You can place a bet on a match by selecting a match, choosing an outcome (local win, draw, or visiting win), and entering the amount of coins you want to bet. The potential prize is calculated based on the odds and the amount of coins bet.',
    },
    {
      question: 'How can I view the details of a match?',
      answer: 'You can view the details of a match by clicking on the match in the "Matched" section. This will display the teams, date, time, and location of the match.',
    }, {
      question: 'How can I view the odds of a match?',
      answer: 'You can view the odds of a match by clicking on the match in the "Matched" section. This will display the odds for each outcome (local win, draw, or visiting win).',
    }, {
      question: 'How can I view the teams that have qualified for the next stage?',
      answer: 'You can view the teams that have qualified for the next stage by navigating to the corresponding section (e.g., "Octavos" (Round of 16), "Cuartos" (Quarter-finals), "Semifinales" (Semi-finals), or "Final"). These sections display the teams names and countries.',
    }, {
      question: 'How can I create a new tournament?',
      answer: 'To create a new tournament, fill in the name, select the season, and choose the difficulty level using the radio buttons. Then, click the "COMENZAR NUEVA COMPETICION" (Start New Competition) button.'
    }
  ];

  const toggleAccordion = (index) => {
    if (active === index) {
      setActive(-1);
    } else {
      setActive(index);
    }
  };

  return (
    <Layout>
      <button className="back-button" onClick={() => navigate(-1)}><AiFillBackward /> Volver</button>
      <div className="faq-container">
        <h1>Preguntas comunes</h1>
        <div className="faq-wrapper">
          {data.map((item, index) => (
            <div key={index} className="faq">
              <div className="accordion_header" onClick={() => toggleAccordion(index)}>
                <p>{item.question}</p>
                <span>{active === index ? '^' : '>'}</span>
              </div>
              {active === index && (
                <div className="answer">
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default FAQ;