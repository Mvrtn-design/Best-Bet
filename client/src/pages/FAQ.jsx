import React from 'react';
import { useState } from 'react';

function FAQ() {

        const [active, setActive] = useState(-1);
        const data = [
            {
              question: 'Question 1?',
              answer: 'Answer 1',
            },
            {
              question: 'Question 2?',
              answer: 'Answer 2',
            },
            // Add more questions and answers as needed
          ];
      
        const toggleAccordion = (index) => {
          if (active === index) {
            setActive(-1);
          } else {
            setActive(index);
          }
        };
      
        return (
          <div className="faq-container">
            <h2>Frequently Asked Questions</h2>
            <div className="faq-wrapper">
              {data.map((item, index) => (
                <div key={index} className="faq">
                  <div className="accordion_header" onClick={() => toggleAccordion(index)}>
                    <p>{item.question}</p>
                    <span>{active === index? '^' : '>'}</span>
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
        );
      };
      
      export default FAQ;