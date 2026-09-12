"use client";

import { useEffect, useState } from "react";
import { getStats } from "@/lib/api";

type StatsData = {
  totalItems: number;
  expiringSoon: number;
  recipesCooked: number;
  itemsSaved: number;
};

type Achievement = {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
};

export default function StatsPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        setError("");

        const data = await getStats();

        setStats(data.stats);
        setAchievements(data.achievements);
      } catch (error) {
        console.error("Failed to load stats:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Could not load stats."
        );
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  if (loading) {
    return (
      <main
        style={{
          maxWidth: "900px",
          margin: "30px auto",
          padding: "24px",
        }}
      >
        <p>Loading stats...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main
        style={{
          maxWidth: "900px",
          margin: "30px auto",
          padding: "24px",
        }}
      >
        <p style={{ color: "red" }}>{error}</p>
      </main>
    );
  }

  return (
    <main
      style={{
        maxWidth: "900px",
        margin: "30px auto",
        padding: "24px",
      }}
    >
      <h1>Your Stats</h1>

      <p style={{ color: "#666" }}>
        See how much food you&apos;ve saved and how much you&apos;ve been cooking.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "16px",
          marginTop: "24px",
        }}
      >
        <div
          style={{
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "16px",
          }}
        >
          <h2 style={{ margin: 0 }}>
            {stats?.totalItems ?? 0}
          </h2>

          <p style={{ marginBottom: 0 }}>
            Items in Fridge
          </p>
        </div>

        <div
          style={{
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "16px",
          }}
        >
          <h2 style={{ margin: 0 }}>
            {stats?.expiringSoon ?? 0}
          </h2>

          <p style={{ marginBottom: 0 }}>
            Expiring Soon
          </p>
        </div>

        <div
          style={{
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "16px",
          }}
        >
          <h2 style={{ margin: 0 }}>
            {stats?.recipesCooked ?? 0}
          </h2>

          <p style={{ marginBottom: 0 }}>
            Recipes Cooked
          </p>
        </div>

        <div
          style={{
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "16px",
          }}
        >
          <h2 style={{ margin: 0 }}>
            {stats?.itemsSaved ?? 0}
          </h2>

          <p style={{ marginBottom: 0 }}>
            Items Saved
          </p>
        </div>
      </div>

      <section style={{ marginTop: "40px" }}>
        <h2>Achievements</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
            marginTop: "16px",
          }}
        >
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              style={{
                padding: "20px",
                border: "1px solid #ddd",
                borderRadius: "16px",
                opacity: achievement.unlocked ? 1 : 0.5,
              }}
            >
              <h3 style={{ marginTop: 0 }}>
                {achievement.unlocked ? "🏆 " : "🔒 "}
                {achievement.name}
              </h3>

              <p style={{ color: "#666" }}>
                {achievement.description}
              </p>

              <strong>
                {achievement.unlocked
                  ? "Unlocked"
                  : "Locked"}
              </strong>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}