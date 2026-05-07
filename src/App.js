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

  
  return (
    <div className="app">
      <header className="app-header" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: 'clamp(1rem, 2vw, 1.5rem) clamp(1rem, 4vw, 2rem)',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 'clamp(8px, 2vw, 12px)',
          minWidth: 'min-content'
        }}>
          <h1 style={{ 
            margin: 0,
            fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #f472b6 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.5px',
            whiteSpace: 'nowrap'
          }}>
            ⚛️ Periodic Table Explorer
          </h1>
          <p style={{
            margin: 0,
            fontSize: 'clamp(0.7rem, 1.5vw, 0.85rem)',
            color: '#9ca3af',
            fontStyle: 'italic',
            paddingLeft: 'clamp(8px, 2vw, 12px)',
            borderLeft: '2px solid rgba(167, 139, 250, 0.3)',
            lineHeight: '1.4',
            display: window.innerWidth < 600 ? 'none' : 'block'
          }}>
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
            onClick={() => setQuizOpen(true)}
            style={{
              padding: 'clamp(6px, 1.5vw, 8px) clamp(12px, 2.5vw, 16px)',
              borderRadius: '10px',
              border: '1px solid rgba(167, 139, 250, 0.35)',
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.22), rgba(167, 139, 250, 0.22))',
              color: theme === 'light' ? '#6d28d9' : '#ddd6fe',
              fontSize: 'clamp(12px, 2vw, 14px)',
              fontWeight: '600',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              transition: 'all 0.2s ease',
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

