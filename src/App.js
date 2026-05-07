import React, { useState } from "react";
import PeriodicTable from "./Components/PeriodicTable";
import Trends from "./Components/Trends/Trends";
import CompareElements from "./Components/compareElements";
import ThemeToggle from "./Components/ThemeToggle/ThemeToggle";
import Assistant from "./Components/Assistant/Assistant";
import QuizMode from "./Components/QuizMode";
import { useTheme } from "./contexts/ThemeContext";


function App() {
  const [quizOpen, setQuizOpen] = useState(false);
  const { theme } = useTheme();
  const themeClass = theme === 'dark' ? 'dark' : 'light';

  
  return (
    <div className="app">
      <header className={`app-header ${themeClass}`} style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: 'clamp(1rem, 2vw, 1.5rem) clamp(1rem, 4vw, 2rem)',
        flexWrap: 'wrap',
        gap: '1rem',
        margin: 'clamp(0.75rem, 1.5vw, 1rem) clamp(0.75rem, 2vw, 1.25rem) 0',
        borderRadius: '20px'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 'clamp(8px, 2vw, 12px)',
          minWidth: 'min-content'
        }}>
          <h1 className="app-header-title">
            <img
              src="/favicon.ico"
              alt=""
              aria-hidden="true"
              className="app-header-title-icon"
            />
            <span>Periodic Table Explorer</span>
          </h1>
          <p className="app-header-subtitle">
            Discover<br/>Elements
          </p>
        </div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 'clamp(8px, 2vw, 12px)',
          flexShrink: 0
        }}>
          <button
            className="app-header-quiz-button"
            onClick={() => setQuizOpen(true)}
            style={{
              padding: 'clamp(6px, 1.5vw, 8px) clamp(12px, 2.5vw, 16px)',
              fontSize: 'clamp(12px, 2vw, 14px)',
              fontWeight: '600',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
            }}
            title="Open Quiz Mode">
            ⚗️ Quiz Mode
          </button>
          <ThemeToggle />
        </div>
      </header>
      <PeriodicTable />
      <Trends />
      <CompareElements />
      <Assistant />
      {quizOpen && <QuizMode onClose={() => setQuizOpen(false)} />}
    </div>
  );
}

export default App;

