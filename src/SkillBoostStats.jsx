// During migration this file proxies the TypeScript implementation to avoid JSX-in-.js errors
// During migration this file proxies the TypeScript implementation to avoid JSX-in-.js errors
export { default } from "./SkillBoostStats.tsx";
import React, { useEffect, useState } from "react";

const API_BASE = "https://skillboost.foreach.at/api/public";

export default function SkillBoostStats() {
  const [childId] = useState(1); // später auswählbar
  const [skill, setSkill] = useState("MUL_TABLE");
  const [skills, setSkills] = useState([]);
  const [stats, setStats] = useState(null);
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
        `${API_BASE}/stats?childId=${childId}&skill=${encodeURIComponent(
          skill
        )}`
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
    // During migration this file proxies the TypeScript implementation to avoid JSX-in-.js errors
    export { default } from "./SkillBoostStats.tsx";
                </div>
                <div
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    color:
                      accuracyPercent >= 80
                        ? "#16a34a"
                        : accuracyPercent >= 50
                        ? "#f97316"
                        : "#dc2626",
                  }}
                >
                  {accuracyPercent}%
                </div>
              </div>
            </div>

            {/* Hinweis für Eltern */}
            <p
              style={{
                fontSize: "0.85rem",
                color: "#6b7280",
                marginBottom: "0.5rem",
              }}
            >
              Jede gerechnet Aufgabe fließt hier ein. So kannst du sehen, welche
              Reihen gut sitzen und wo ihr noch üben könnt.
            </p>

            {/* Per-Factor-Balken */}
            <h3
              style={{
                fontSize: "1rem",
                marginTop: "0.8rem",
                marginBottom: "0.3rem",
              }}
            >
              Reihen im Vergleich
            </h3>
            {renderPerFactorBars()}
          </>
        ) : (
          <p style={{ fontSize: "0.9rem", color: "#6b7280" }}>
            Noch keine Daten vorhanden – mach zuerst ein paar Aufgaben im
            Training 😊
          </p>
        )}
      </div>
    </div>
  );
}
