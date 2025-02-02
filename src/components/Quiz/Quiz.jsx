// src/components/Quiz/Quiz.jsx
import { useState, useEffect } from 'react';
import Question from '../Question/Question';
import Results from '../Results/Results';
import { motion, AnimatePresence } from "framer-motion";
import './Quiz.css';
import { FaQuestionCircle } from 'react-icons/fa';
import { MdOutlineScreenshotMonitor } from 'react-icons/md';

const Quiz = () => {
  // State Management
  const [quizData, setQuizData] = useState(null);          // Stores fetched quiz data
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Current question index
  const [score, setScore] = useState(0);                   // User's current score
  const [selectedOptions, setSelectedOptions] = useState({}); // Map of selected answers
  const [quizStarted, setQuizStarted] = useState(false);   // Quiz initialization flag
  const [isLoading, setIsLoading] = useState(false);       // Data loading state
  const [timeLeft, setTimeLeft] = useState(120);           // Remaining time in seconds
  const [isCountingDown, setIsCountingDown] = useState(false); // Pre-quiz countdown state
  const [countdown, setCountdown] = useState(3);           // Countdown from 3 to 1
  const [isQuizActive, setIsQuizActive] = useState(false); // Main quiz active state

  // Data Fetching Effect
  useEffect(() => {
    if (quizStarted && !quizData) {
      const fetchQuizData = async () => {
        setIsLoading(true);
        try {
          const response = await fetch('/Uw5CrX');
          const data = await response.json();
          setQuizData(data);
        } catch (error) {
          console.error('Error fetching quiz:', error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchQuizData();
    }
  }, [quizStarted, quizData]);

  // Start Countdown When Data Loads
  useEffect(() => {
    if (quizData && quizStarted) setIsCountingDown(true);
  }, [quizData, quizStarted]);

  // Quiz Timer Effect
  useEffect(() => {
    let timer;
    if (isQuizActive && quizData) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev <= 1 ? 0 : prev - 1);
        if(timeLeft <= 1) setCurrentQuestionIndex(quizData.questions.length);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isQuizActive, quizData, timeLeft]);

  // Pre-Quiz Countdown Effect
  useEffect(() => {
    if (isCountingDown) {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setIsCountingDown(false);
            setIsQuizActive(true);  // Activate main quiz after countdown
            return 3; // Reset countdown for potential restarts
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isCountingDown]);

  // Quiz Control Handlers
  const handleStartQuiz = () => setQuizStarted(true);

  const handleRestart = () => {
    // Reset all states to initial values
    setQuizStarted(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedOptions({});
    setQuizData(null);
    setTimeLeft(120);
    setIsQuizActive(false);
    setIsCountingDown(false);
  };

  // Navigation Logic
  const findNextUnattemptedIndex = (currentIndex, totalQuestions) => {
    // Find next unanswered question index
    let nextIndex = currentIndex + 1;
    while (nextIndex < totalQuestions && selectedOptions.hasOwnProperty(nextIndex)) {
      nextIndex++;
    }
    return nextIndex >= totalQuestions ? totalQuestions : nextIndex;
  };

  // Question Interaction Handlers
  const handleSkip = () => {
    setSelectedOptions(prev => ({ ...prev, [currentQuestionIndex]: 'skipped' }));
    setTimeout(() => {
      const nextIndex = findNextUnattemptedIndex(currentQuestionIndex, quizData.questions.length);
      setCurrentQuestionIndex(nextIndex);
    }, 1000);
  };

  const handleAnswer = (optionId, isCorrect) => {
    setSelectedOptions(prev => ({ ...prev, [currentQuestionIndex]: optionId }));
    if (isCorrect) setScore(prev => prev + 1);
    setTimeout(() => {
      const nextIndex = findNextUnattemptedIndex(currentQuestionIndex, quizData.questions.length);
      setCurrentQuestionIndex(nextIndex);
    }, 1000);
  };

  // Helper Functions
  const formatTime = (seconds) => {
    // Convert seconds to MM:SS format
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Render States
  if (!quizStarted) {
    return <StartScreen onStart={handleStartQuiz} isLoading={isLoading} />;
  }

  if (isLoading || !quizData) {
    return <div className="loading">Loading quiz...</div>;
  }

  if (currentQuestionIndex >= quizData.questions.length) {
    return <Results 
      score={score} 
      total={quizData.questions.length} 
      questions={quizData.questions}
      selectedOptions={selectedOptions}
      onRestart={handleRestart}
    />;
  }

  // Calculate skipped questions for sidebar
  const skippedQuestions = Object.entries(selectedOptions)
    .filter(([_, value]) => value === 'skipped')
    .map(([key]) => Number(key));

  return (
    <>
      {/* Animated Countdown Overlay */}
      <AnimatePresence>
        {isCountingDown && (
          <motion.div
            key="countdown"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="countdown-overlay"
          >
            <motion.div
              key={countdown}
              initial={{ scale: 4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="countdown-number"
            >
              {countdown}
              <motion.div 
                className="countdown-text"
                animate={{ y: [0, 20, 0], opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                {countdown === 1 ? 'Go!' : 'Get Ready'}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Quiz Container */}
      <div className="quiz-container">
        {/* Left Sidebar Section */}
        <div className="quiz-sidebar">
          {isQuizActive && (
            <div className="sidebar-section">
              <h3>⏳ Time Remaining</h3>
              <div className={`timer ${timeLeft <= 30 ? 'warning' : ''}`}>
                {formatTime(timeLeft)}
              </div>
              
              <h3><MdOutlineScreenshotMonitor /> Questions</h3>
              <div className="question-numbers">
                {quizData.questions.map((_, index) => (
                  <button
                    key={index}
                    className={`question-number ${
                      currentQuestionIndex === index ? 'active' : 
                      selectedOptions[index] === 'skipped' ? 'skipped' :
                      selectedOptions[index] ? 'answered' : ''
                    }`}
                    onClick={() => selectedOptions[index] === 'skipped' && setCurrentQuestionIndex(index)}
                    disabled={selectedOptions[index] && selectedOptions[index] !== 'skipped'}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Skipped Questions Section */}
          <div className="sidebar-section">
            <h3><FaQuestionCircle /> Skipped</h3>
            {skippedQuestions.length > 0 ? (
              <div className="skipped-list">
                {skippedQuestions.map(index => (
                  <button
                    key={index}
                    className="skipped-item"
                    onClick={() => setCurrentQuestionIndex(index)}
                  >
                    Question {index + 1}
                  </button>
                ))}
              </div>
            ) : (
              <p className="no-skipped">No skipped questions</p>
            )}
          </div>
        </div>

        {/* Main Quiz Content */}
        {isQuizActive && (
          <div className="main-quiz-content">
            {/* Progress Bar */}
            <div className="progress-bar-container">
              <div 
                className="progress-fill"
                style={{
                  width: `${((currentQuestionIndex + 1) / quizData.questions.length) * 100}%`,
                  background: `linear-gradient(90deg, #6366f1 ${currentQuestionIndex * 10}%, #8b5cf6 100%)`
                }}
              />
              <span className="progress-text">
                {currentQuestionIndex + 1}/{quizData.questions.length}
              </span>
            </div>
          
            {/* Animated Question Container */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Question 
                question={quizData.questions[currentQuestionIndex]}
                selectedOption={selectedOptions[currentQuestionIndex]}
                onAnswer={handleAnswer}
                onSkip={handleSkip}
              />
            </motion.div>
          </div>
        )}
      </div>
    </>
  );
};

// Start Screen Component
const StartScreen = ({ onStart, isLoading }) => (
  <div className="start-screen">
    <h1>Welcome to the Genetics Quiz!</h1>
    <p>Test your knowledge of molecular biology and genetics</p>
    <button 
      className="start-button" 
      onClick={onStart}
      disabled={isLoading}
    >
      {isLoading ? 'Loading...' : 'Start Quiz'}
    </button>
  </div>
);

export default Quiz;