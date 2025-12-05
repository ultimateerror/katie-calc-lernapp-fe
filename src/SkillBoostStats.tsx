import React, { useEffect, useState } from "react";

const API_BASE = "https://skillboost.foreach.at/api/public";

export default function SkillBoostStats(): JSX.Element {
  const [childId] = useState(1); // später auswählbar
  const [skill, setSkill] = useState("MUL_TABLE");
  const [skills, setSkills] = useState<any[]>([]);
  const [stats, setStats] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  // Skills laden (damit du theoretisch auch Add/Sub anzeigen kannst)
  useEffect(() => {
    fetch(`${API_BASE}/skills`)
      .then((res) => res.json())
      .then(setSkills)
      .catch((err) => console.error("Error loading skills", err));
  }, []);

  const loadStats = async () => {
    if (!childId || !skill) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/stats?childId=${childId}&skill=${encodeURIComponent(skill)}`
      );
      const data = await res.json();
      setStats(data);
    } catch (e) {
      console.error("Error loading stats", e);
    } finally {
      setLoading(false);
    }
  };

  // Beim ersten Anzeigen gleich laden
  useEffect(() => {
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skill]);

  const renderPerFactorBars = () => {
    if (!stats || !stats.perFactor) return null;

    const entries = Object.entries(stats.perFactor)
      .map(([factor, acc]) => ({ factor: Number(factor), acc: Number(acc) }))
      .sort((a, b) => a.factor - b.factor);

    if (!entries.length) {
      return (
        <p style={{ fontSize: "0.9rem", color: "#64748b" }}>
          Noch keine Daten für einzelne Reihen – mach ein paar Aufgaben 😊
        </p>
      );
    }

    return (
      <div style={{ marginTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
        {entries.map(({ factor, acc }) => {
          const percent = Math.round(acc * 100);
          return (
            <div key={factor}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.85rem",
                  marginBottom: "0.1rem",
                  color: "#475569",
                }}
              >
                <span>
                  {skill === "MUL_TABLE" ? `${factor}er-Reihe` : `Faktor ${factor}`}
                </span>
                <span>{percent}%</span>
              </div>
              <div style={{ width: "100%", height: 10, borderRadius: 999, backgroundColor: "#e2e8f0", overflow: "hidden" }}>
                <div
                  style={{
                    width: `${percent}%`,
                    height: "100%",
                    background:
                      percent >= 80
                        ? "linear-gradient(90deg, #22c55e 0%, #a3e635 100%)"
                        : percent >= 50
                        ? "linear-gradient(90deg, #f97316 0%, #fde047 100%)"
                        : "linear-gradient(90deg, #ef4444 0%, #fb7185 100%)",
                    transition: "width 0.2s ease",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const total = stats?.totalAttempts ?? 0;
  const correct = stats?.correctAttempts ?? 0;
  const accuracyPercent = stats ? Math.round((stats.accuracy || 0) * 100) : 0;

  return (
    <div
      style={{
        minHeight: "calc(100vh - 48px)",
        padding: "1.5rem 1rem 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #e0f2fe 0%, #faf5ff 50%, #fee2e2 100%)",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <div style={{ width: "100%", maxWidth: 480, backgroundColor: "white", borderRadius: 24, padding: "1.75rem 1.5rem 1.5rem", boxShadow: "0 10px 25px rgba(0,0,0,0.08)" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
          <span style={{ fontSize: "2rem" }}>📊</span>
          <div>
            <h2 style={{ margin: 0, fontSize: "1.4rem", lineHeight: 1.1 }}>Lern-Statistik</h2>
            <div style={{ fontSize: "0.9rem", color: "#6b7280" }}>Wie läuft das Training?</div>
          </div>
        </div>

        {/* Skill-Auswahl */}
        <div style={{ marginBottom: "0.8rem" }}>
          <label style={{ fontSize: "0.85rem", color: "#555", display: "block" }}>Übungsart</label>
          <select
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            style={{
              marginTop: "0.2rem",
              width: "100%",
              padding: "0.4rem 0.6rem",
              borderRadius: 999,
              border: "1px solid #ddd",
              backgroundColor: "#f9fafb",
              fontSize: "0.95rem",
            }}
          >
            {skills.map((s) => (
              <option key={s.id} value={s.code}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Refresh-Button */}
        <button
          onClick={loadStats}
          disabled={loading}
          style={{
            padding: "0.45rem 0.9rem",
            borderRadius: 999,
            border: "none",
            fontSize: "0.9rem",
            fontWeight: 600,
            cursor: loading ? "default" : "pointer",
            backgroundColor: loading ? "#cbd5f5" : "#4f46e5",
            color: "white",
            marginBottom: "1rem",
          }}
        >
          {loading ? "Aktualisiere…" : "🔄 Statistik aktualisieren"}
        </button>

        {/* Gesamtstats */}
        {stats ? (
          <>
            <div style={{ padding: "0.7rem 0.8rem", borderRadius: 16, backgroundColor: "#f9fafb", border: "1px solid #e5e7eb", marginBottom: "1rem", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem", textAlign: "center" }}>
              <div>
                <div style={{ fontSize: "0.8rem", color: "#6b7280", marginBottom: 2 }}>Versuche</div>
                <div style={{ fontSize: "1.1rem", fontWeight: 700 }}>{total}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.8rem", color: "#6b7280", marginBottom: 2 }}>Richtig</div>
                <div style={{ fontSize: "1.1rem", fontWeight: 700 }}>{correct}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.8rem", color: "#6b7280", marginBottom: 2 }}>Trefferquote</div>
                <div style={{ fontSize: "1.1rem", fontWeight: 700, color: accuracyPercent >= 80 ? "#16a34a" : accuracyPercent >= 50 ? "#f97316" : "#dc2626" }}>{accuracyPercent}%</div>
              </div>
            </div>

            {/* Hinweis für Eltern */}
            <p style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.5rem" }}>
              Jede gerechnet Aufgabe fließt hier ein. So kannst du sehen, welche Reihen gut sitzen und wo ihr noch üben könnt.
            </p>

            {/* Per-Factor-Balken */}
            <h3 style={{ fontSize: "1rem", marginTop: "0.8rem", marginBottom: "0.3rem" }}>Reihen im Vergleich</h3>
            {renderPerFactorBars()}
          </>
        ) : (
          <p style={{ fontSize: "0.9rem", color: "#6b7280" }}>
            Noch keine Daten vorhanden – mach zuerst ein paar Aufgaben im Training 😊
          </p>
        )}
      </div>
    </div>
  );
}
