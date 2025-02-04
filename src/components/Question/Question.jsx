// src/components/Question/Question.jsx
import './Question.css';

const Question = ({ question, selectedOption, onAnswer, onSkip, showCorrectness }) => {
  const optionLabels = ['A', 'B', 'C', 'D'];
  const handleOptionClick = (optionId) => {
    onAnswer(optionId); // Only pass option ID without correctness info
  };

  return (
    <div className="question-card">
      <h2 dangerouslySetInnerHTML={{ __html: question.description }} />
      
      <div className="options-grid">
        {question.options.map((option, index) => (
          <button
            key={option.id}
            className={`option-btn ${
              // Show only selection state during quiz
              selectedOption === option.id ? 'selected' : ''
            }`}
            onClick={() => handleOptionClick(option.id)}>
            <span className="option-label" style={{ textAlign: "left" }}>{optionLabels[index]}.</span>
            <span dangerouslySetInnerHTML={{ __html: option.description }} />
          
          </button>
        ))}
      </div>

      <div className="question-footer">
        <button 
          className="skip-btn"
          onClick={onSkip}
          disabled={selectedOption !== undefined}
        >
          ⏩ Skip Question
        </button>
      </div>
    </div>
  );
};

export default Question;