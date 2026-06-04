import React, { useState } from "react";
import Assistant from "./Components/Assistant/Assistant";
import CompareElements from "./Components/compareElements";
import ElementDetailsPanel from "./Components/ElementDetailsPanel";
import PeriodicTable from "./Components/PeriodicTable";
import QuizMode from "./Components/QuizMode";
import ThemeToggle from "./Components/ThemeToggle/ThemeToggle";
import Trends from "./Components/Trends/Trends";

// Extracted style objects to improve scannability and eliminate inline re-renders
const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
  },
  titleContainer: {
    textAlign: "left",
  },
  mainTitle: {
    margin: 0,
    fontSize: "2.8rem",
    letterSpacing: "1px",
    fontWeight: "700",
  },
  subtitle: {
    marginTop: "8px",
    opacity: 0.7,
  },
  actionContainer: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  quizButton: {
    padding: "8px 16px",
    borderRadius: "10px",
    border: "1px solid rgba(167, 139, 250, 0.35)",
    background: "linear-gradient(135deg, rgba(139, 92, 246, 0.22), rgba(167, 139, 250, 0.22))",
    color: "#ddd6fe",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "Inter, sans-serif",
    transition: "transform 0.1s ease, opacity 0.2s ease",
  },
};

function App() {
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  return (
    <div className="app">
      <header className="app-header" style={styles.header}>
        <div style={styles.titleContainer}>
          <h1 style={styles.mainTitle}>Periodic Table Explorer</h1>
          <p style={styles.subtitle}>
            Interactive chemistry experience built with React
          </p>
        </div>

        <div className="btn" style={styles.actionContainer}>
          <button
            onClick={() => setIsQuizOpen(true)}
            style={styles.quizButton}
            title="Open Quiz Mode"
            aria-label="Open chemistry quiz mode"
          >
            <span role="img" aria-hidden="true">⚗️</span> Quiz Mode
          </button>
          <ThemeToggle />
        </div>
      </header>

      <main className="app-content">
        <PeriodicTable />
        <Trends />
        <CompareElements />
        <Assistant />
        <ElementDetailsPanel />
      </main>

      {isQuizOpen && <QuizMode onClose={() => setIsQuizOpen(false)} />}
    </div>
  );
}

export default App;
