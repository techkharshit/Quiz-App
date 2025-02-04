// src/components/Results/Results.jsx
import './Results.css';
import { motion } from 'framer-motion';
import { FaRedo } from 'react-icons/fa';
import { GiCheckMark, GiCrossMark, GiSkiBoot, GiSkullInJar } from 'react-icons/gi';

const Results = ({ score, total, questions, selectedOptions, onRestart }) => {
  // Calculate result metrics
  const percentage = Math.round((score / total) * 100);
  const skipped = Object.values(selectedOptions).filter(v => v === 'skipped').length;
  const attempted = Object.keys(selectedOptions).length;
  const unattempted = total - attempted;
  const answered = attempted - skipped;
  const wrong = answered - score;

  // Determine result message based on percentage
  const getResultMessage = () => {
    if (percentage >= 90) return "Genius Level! 🎓";
    if (percentage >= 75) return "Excellent Work! 🏆";
    if (percentage >= 50) return "Good Effort! 👍";
    if (percentage >= 30) return "Keep Practicing! 📚";
    return "Let's Try Again! 💪";
  };

  return (
    <motion.div 
      className="results-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Main Score Section */}
      <div className="score-header">
        <motion.div 
          className="score-card"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          {/* Circular Progress Indicator */}
          <div className="score-percentage">
            <svg className="progress-circle" viewBox="0 0 100 100">
              <circle className="circle-bg" cx="50" cy="50" r="45" />
              <circle 
                className="circle-progress"
                cx="50" 
                cy="50" 
                r="45"
                style={{
                  strokeDasharray: `${2 * Math.PI * 45}`,
                  strokeDashoffset: `${2 * Math.PI * 45 * (1 - percentage/100)}`
                }}
              />
            </svg>
            <div className="percentage-text">
              {percentage}%
              <div className="score-fraction">{score}/{total}</div>
            </div>
          </div>

          {/* Result Message with Animation */}
          <motion.div 
            className="result-message"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
          >
            {getResultMessage()}
            <div className="result-emoji">
              {percentage >= 75 ? "🎉" : percentage >= 50 ? "🙂" : "😕"}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Score Breakdown Section */}
      <motion.div className="score-breakdown">
        <div className="breakdown-item correct">
          <GiCheckMark className="breakdown-icon" />
          <span>{score} Correct</span>
        </div>
        <div className="breakdown-item wrong">
          <GiCrossMark className="breakdown-icon" />
          <span>{wrong} Wrong</span>
        </div>
        <div className="breakdown-item skipped">
          <GiSkiBoot className="breakdown-icon" />
          <span>{skipped} Skipped</span>
        </div>
        <div className="breakdown-item unattempted">
          <GiSkullInJar className="breakdown-icon" />
          <span>{unattempted} Unattempted</span>
        </div>
      </motion.div>

      {/* Questions Review Section */}
      <div className="review-section">
        {questions.map((question, index) => {
          const isUnattempted = !selectedOptions.hasOwnProperty(index);
          const isSkipped = selectedOptions[index] === 'skipped';

          return (
          <div key={question.id} className="review-item">
            <h3>Question {index + 1}:</h3>

          <div className="question-header">
            {isUnattempted && (<span className="status-badge unattempted">Unattempted</span>)}
            {isSkipped && <span className="status-badge skipped">Skipped</span>}
          </div>
            
            {/* Question Text */}
            <div 
              className="question-text" 
              dangerouslySetInnerHTML={{ __html: question.description }} 
            />
            
            {/* Options Review with Status Highlighting */}
            <div className="options-review">
              {question.options.map(option => (
                <div
                  key={option.id}
                  className={`review-option ${
                    option.is_correct 
                      ? 'correct-answer' 
                      : isSkipped 
                        ? 'skipped' 
                        : isUnattempted 
                          ? 'unattempted' 
                          : selectedOptions[index] === option.id 
                            ? 'wrong-answer' 
                            : ''
                  }`}
                  >
                  <span className="option-label">
                  {String.fromCharCode(65 + question.options.indexOf(option))}. 
                </span>
                <span dangerouslySetInnerHTML={{ __html: option.description }}
                />
                </div>
              ))}
            </div>

            {/* Detailed Solution */}
            <div className="solution-section">
              <h4>Detailed Solution:</h4>
              <div 
                className="solution-content" 
                dangerouslySetInnerHTML={{ 
                  __html: question.detailed_solution.replace(/\n/g, '<br>') 
                }} 
              />
            </div>
          </div>
          );
        })}
      </div>

      {/* Restart Button with Hover Animation */}
      <motion.button 
        className="restart-button"
        onClick={onRestart}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaRedo className="restart-icon" />
        Try Again
      </motion.button>
    </motion.div>
  );
};

export default Results;