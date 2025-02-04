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
  const [quizData, setQuizData] = useState({ questions: [] });         // Stores fetched quiz data
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Current question index
  const [score, setScore] = useState(0);                   // User's current score
  const [selectedOptions, setSelectedOptions] = useState({}); // Map of selected answers
  const [quizStarted, setQuizStarted] = useState(false);   // Quiz initialization flag
  const [isLoading, setIsLoading] = useState(false);       // Data loading state
  const [timeLeft, setTimeLeft] = useState(120);           // Remaining time in seconds
  const [isCountingDown, setIsCountingDown] = useState(false); // Pre-quiz countdown state
  const [countdown, setCountdown] = useState(3);           // Countdown from 3 to 1
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [error, setError] = useState(null);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
   // Main quiz active state

  // Data Fetching Effect
  useEffect(() => {
    if (quizStarted && !quizData?.questions?.length) {
      const fetchQuizData = async () => {
        setIsLoading(true);
        try {
          const response = await fetch('https://quiz-app-nwxo.onrender.com/api/questions');
          if (!response.ok) throw new Error('Failed to fetch questions');
          
          const data = await response.json();
          if (!data.questions) throw new Error('Invalid data format');
          setQuizData(data);
        } catch (error) {
          console.error('Error fetching quiz:', error);
          setError(error.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchQuizData();
    }
  }, [quizStarted, quizData?.questions?.length]);

  // Start Countdown When Data Loads
  useEffect(() => {
    if (quizData?.questions?.length && quizStarted) setIsCountingDown(true);
  }, [quizData, quizStarted]);

  // Quiz Timer Effect
  useEffect(() => {
    let timer;
    if (isQuizActive && quizData?.questions?.length) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsQuizSubmitted(true);;
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isQuizActive, quizData?.questions?.length]);

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
  const handleSubmit = () => {
    setIsQuizSubmitted(true);
  };

// src/components/Quiz/Quiz.jsx
const handleRestart = () => {
  // Reset to initial state properly
  setQuizStarted(false);
  setCurrentQuestionIndex(0);
  setScore(0);
  setSelectedOptions({});
  setQuizData({ questions: [] }); // Changed from null to initial state
  setTimeLeft(120);
  setIsQuizActive(false);
  setIsCountingDown(false);
  setIsQuizSubmitted(false); // Add this if you have submission state
};

  // Navigation Logic
  const findNextUnattemptedIndex = (currentIndex) => {
    const totalQuestions = quizData.questions.length;
    let nextIndex = currentIndex + 1;
    
    while (nextIndex < totalQuestions && selectedOptions.hasOwnProperty(nextIndex)) {
      nextIndex++;
    }
    
    // Loop back to start if reached end
    if (nextIndex >= totalQuestions) {
      nextIndex = quizData.questions.findIndex(
        (_, index) => !selectedOptions.hasOwnProperty(index)
      );
      
      // If all attempted, stay on current
      if (nextIndex === -1) nextIndex = currentIndex;
    }
    
    return nextIndex;
  };

  // Question Interaction Handlers
  const handleSkip = () => {
    setSelectedOptions(prev => ({ ...prev, [currentQuestionIndex]: 'skipped' }));
    setTimeout(() => {
      const nextIndex = findNextUnattemptedIndex(currentQuestionIndex);
      setCurrentQuestionIndex(nextIndex);
    }, 1000);
  };

  const handleAnswer = (optionId) => {
    setSelectedOptions(prev => ({ ...prev, [currentQuestionIndex]: optionId }));
    
    setTimeout(() => {
      const nextIndex = findNextUnattemptedIndex(currentQuestionIndex);
      
      // Only move if not at end of quiz
      if (nextIndex < quizData.questions.length) {
        setCurrentQuestionIndex(nextIndex);
      } else {
        // Check for remaining unattempted questions
        const firstUnattempted = quizData.questions.findIndex(
          (_, index) => !selectedOptions.hasOwnProperty(index)
        );
        
        if (firstUnattempted !== -1) {
          setCurrentQuestionIndex(firstUnattempted);
        }
      }
    }, 1000);
  };

  useEffect(() => {
    // Calculate score whenever submission happens or time runs out
    if (isQuizSubmitted || timeLeft === 0) {
      console.log("Calculating final score");
      const calculatedScore = quizData.questions.reduce((acc, question, index) => {
        const selectedId = selectedOptions[index];
        const correctAnswer = question.options.find(opt => opt.is_correct)?.id;
        // Only count answers for non-skipped questions
        return selectedId && selectedId !== 'skipped' && selectedId === correctAnswer ? acc + 1 : acc;
      }, 0);
      setScore(calculatedScore);
    }
  }, [isQuizSubmitted, timeLeft, quizData.questions, selectedOptions]);

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
  if (error) {
    return <div className="error">Error: {error}. Please try reloading.</div>;
  }

  if (isLoading || !quizData?.questions?.length) {
    return <div className="loading">Loading quiz...</div>;
  }

  if (isQuizSubmitted || timeLeft === 0) {
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
                    onClick={() => setCurrentQuestionIndex(index)}
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
              <div className="progress-controls">
                <span className="progress-text">
                  {currentQuestionIndex + 1}/{quizData.questions.length}
                </span>
                <button 
                  className="submit-button"
                  onClick={handleSubmit}
                >
                  Submit Quiz
                </button>
              </div>
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
                showCorrectness={false}
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