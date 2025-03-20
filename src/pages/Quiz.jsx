"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./Quiz.css";

function Quiz() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(() => {
    const savedIndex = localStorage.getItem('quizCurrentIndex');
    return savedIndex ? parseInt(savedIndex, 0) : 0;
  });
  const [selectedOption, setSelectedOption] = useState(null);
  const [timer, setTimer] = useState(() => {
    const savedTimer = localStorage.getItem('quizTimer');
    return savedTimer ? parseInt(savedTimer, 0) : 120;
  });
  const [progress, setProgress] = useState(5);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('java');
  const [output, setOutput] = useState('');
  const [isCompiling, setIsCompiling] = useState(false);

  // Fetch questions when component mounts
  useEffect(() => {
    const studentId = localStorage.getItem('studentId');
    if (!studentId) {
      navigate('/');
      return;
    }

    const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
    fetch(`${apiUrl}/api/questions/`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch questions');
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setQuestions(data);
          setProgress((1 / data.length) * 100);
        } else {
          throw new Error('Invalid data format');
        }
      })
      .catch((err) => {
        console.error('Error fetching questions:', err);
        // You might want to show an error message to the user
      });
  }, [navigate]);

  // Update localStorage when currentIndex changes
  useEffect(() => {
    localStorage.setItem('quizCurrentIndex', currentIndex);
    if (questions.length > 0) {
      setProgress(((currentIndex + 1) / questions.length) * 100);
    }
  }, [currentIndex, questions.length]);

  // Clear progress when quiz is completed
  const handleSubmit = useCallback(async () => {
    if (!questions.length) return;

    const studentId = localStorage.getItem('studentId');
    const currentQuestion = questions[currentIndex];
    const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

    if (selectedOption !== null) {
      try {
        const response = await fetch(`${apiUrl}/api/submit-answer/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            student_id: studentId,
            question_id: currentQuestion.id,
            chosen_option: String.fromCharCode(65 + selectedOption),
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to submit answer');
        }
      } catch (error) {
        console.error('Error submitting answer:', error);
      }
    }
  
    if (currentIndex + 1 >= questions.length) {
      localStorage.removeItem('quizCurrentIndex'); // Clear progress on completion
      navigate('/thank-you');
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setTimer(120);
      localStorage.setItem('quizTimer', '120');
    }
  }, [questions, currentIndex, selectedOption, navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => {
        const newTimer = prev <= 1 ? 0 : prev - 1;
        localStorage.setItem('quizTimer', newTimer);
        if (newTimer <= 0) {
          handleSubmit();
        }
        return newTimer;
      });
    }, 1000);
  
    return () => clearInterval(interval);
  }, [handleSubmit]);

  // Update timer when moving to next question
  const handleSubmit = useCallback(async () => {
    if (!questions.length) return;

    const studentId = localStorage.getItem('studentId');
    const currentQuestion = questions[currentIndex];
    const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

    if (selectedOption !== null) {
      try {
        const response = await fetch(`${apiUrl}/api/submit-answer/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            student_id: studentId,
            question_id: currentQuestion.id,
            chosen_option: String.fromCharCode(65 + selectedOption),
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to submit answer');
        }
      } catch (error) {
        console.error('Error submitting answer:', error);
      }
    }
  
    if (currentIndex + 1 >= questions.length) {
      localStorage.removeItem('quizCurrentIndex');
      localStorage.removeItem('quizTimer'); // Clear timer on completion
      navigate('/thank-you');
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setTimer(120);
      localStorage.setItem('quizTimer', '120');
    }
  }, [questions, currentIndex, selectedOption, navigate]);

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    
    // Set default code template based on language
    if (e.target.value === 'java') {
      setCode('public class Main {\n    public static void main(String[] args) {\n        // Your code here\n        System.out.println("Hello, World!");\n    }\n}');
    } else if (e.target.value === 'c') {
      setCode('#include <stdio.h>\n\nint main() {\n    // Your code here\n    printf("Hello, World!\\n");\n    return 0;\n}');
    } else if (e.target.value === 'python') {
      setCode('# Your code here\nprint("Hello, World!")');
    }
  };

  const compileAndRun = async () => {
    setIsCompiling(true);
    setOutput('Compiling and running...');
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      const response = await fetch(`${apiUrl}/api/compile/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          language
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      setOutput(result.output || 'No output');
    } catch (error) {
      setOutput(`Error: ${error.message}\n\nMake sure the /api/compile/ endpoint is implemented on your backend.`);
    } finally {
      setIsCompiling(false);
    }
  };

  if (!questions.length) {
    return <div className="loading">Loading questions...</div>;
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="quiz-container">
      <div className="timer">
        Time Left: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
      </div>
      
      <div className="progress-section">
        <div className="progress-text">
          Question {currentIndex + 1} of {questions.length}
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className="question-section">
        <h2>{currentQuestion.text}</h2>
        <div className="options">
          {['A', 'B', 'C', 'D'].map((option, index) => (
            <button
              key={option}
              className={`option ${selectedOption === index ? 'selected' : ''}`}
              onClick={() => setSelectedOption(index)}
            >
              {option}. {currentQuestion[`option_${option.toLowerCase()}`]}
            </button>
          ))}
        </div>
      </div>

      {/* Online Compiler Section */}
      <div className="compiler-section">
        <h3>Online Code Compiler</h3>
        <div className="compiler-controls">
          <select 
            value={language} 
            onChange={handleLanguageChange}
            className="language-selector"
          >
            <option value="java">Java</option>
            <option value="c">C</option>
            <option value="python">Python</option>
          </select>
          <button 
            className="run-btn"
            onClick={compileAndRun}
            disabled={isCompiling}
          >
            {isCompiling ? 'Running...' : 'Run Code'}
          </button>
        </div>
        <div className="code-editor-container">
          <textarea
            className="code-editor"
            value={code}
            onChange={handleCodeChange}
            placeholder="Write your code here..."
            spellCheck="false"
          ></textarea>
        </div>
        <div className="output-container">
          <div className="output-header">Output:</div>
          <pre className="output">{output}</pre>
        </div>
      </div>

      <button 
        className="submit-btn"
        onClick={handleSubmit}
        disabled={selectedOption === null}
      >
        {currentIndex === questions.length - 1 ? 'Finish' : 'Next'}
      </button>
    </div>
  );
}

export default Quiz;