import React, { useState } from "react";
import SkillBoostTrainer from "./SkillBoostTrainer";
import SkillBoostStats from "./SkillBoostStats";

function App() {
  const [view, setView] = useState("trainer"); // "trainer" | "stats"

  return (
    <div style={{ minHeight: "100vh", margin: 0 }}>
      {/* Simple Tab-Navigation */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "0.5rem",
          padding: "0.5rem 0.75rem",
          background:
            "linear-gradient(135deg, #0ea5e9 0%, #22c55e 100%)",
        }}
      >
        <button
          onClick={() => setView("trainer")}
          style={{
            padding: "0.4rem 0.9rem",
            borderRadius: 999,
            border: "none",
            fontSize: "0.95rem",
            fontWeight: 600,
            cursor: "pointer",
            backgroundColor: view === "trainer" ? "#ffffff" : "rgba(255,255,255,0.3)",
            color: view === "trainer" ? "#0f172a" : "#f9fafb",
          }}
        >
          🎮 Training
        </button>
        <button
          onClick={() => setView("stats")}
          style={{
            padding: "0.4rem 0.9rem",
            borderRadius: 999,
            border: "none",
            fontSize: "0.95rem",
            fontWeight: 600,
            cursor: "pointer",
            backgroundColor: view === "stats" ? "#ffffff" : "rgba(255,255,255,0.3)",
            color: view === "stats" ? "#0f172a" : "#f9fafb",
          }}
        >
          📊 Statistik
        </button>
      </div>

      {view === "trainer" ? <SkillBoostTrainer /> : <SkillBoostStats />}
    </div>
  );
}

export default App;
