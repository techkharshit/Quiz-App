// src/components/Question/Question.jsx
import './Question.css';

const Question = ({ question, selectedOption, onAnswer, onSkip }) => {
  return (
    <div className="question-card">
      <h2 dangerouslySetInnerHTML={{ __html: question.description }} />
      
      <div className="options-grid">
        {question.options.map(option => (
          <button
            key={option.id}
            className={`option-btn ${selectedOption === option.id ? 
              (option.is_correct ? 'correct' : 'incorrect') : ''}`}
            onClick={() => onAnswer(option.id, option.is_correct)}
            dangerouslySetInnerHTML={{ __html: option.description }}
          />
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