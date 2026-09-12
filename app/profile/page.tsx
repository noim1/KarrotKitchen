"use client";

import { useEffect, useState } from "react";
import {
  getPreferences,
  savePreferences,
  getStats,
} from "@/lib/api";
import { UserPreferences } from "@/types";

export default function ProfilePage() {
  const [diets, setDiets] = useState<string[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [maxCookingTime, setMaxCookingTime] = useState(30);

  const [skillLevel, setSkillLevel] = useState<
    "beginner" | "intermediate" | "advanced"
  >("beginner");

  const [stats, setStats] = useState<any>(null);
  const [achievements, setAchievements] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const [preferences, statsData] = await Promise.all([
          getPreferences(),
          getStats(),
        ]);

        setDiets(preferences.diets ?? []);
        setAllergies(preferences.allergies ?? []);
        setMaxCookingTime(preferences.maxCookingTime ?? 30);
        setSkillLevel(preferences.skillLevel ?? "beginner");

        setStats(statsData.stats);
        setAchievements(statsData.achievements);
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  function toggleDiet(diet: string) {
    setDiets((current) =>
      current.includes(diet)
        ? current.filter((item) => item !== diet)
        : [...current, diet]
    );
  }

  function toggleAllergy(allergy: string) {
    setAllergies((current) =>
      current.includes(allergy)
        ? current.filter((item) => item !== allergy)
        : [...current, allergy]
    );
  }

  async function handleSave() {
    try {
      setSaving(true);
      setMessage("");

      const preferences: UserPreferences = {
        diets,
        allergies,
        maxCookingTime,
        skillLevel,
      };

      await savePreferences(preferences);

      setMessage("Profile preferences saved!");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not save preferences."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main
        style={{
          maxWidth: "430px",
          margin: "0 auto",
          padding: "28px 20px",
        }}
      >
        <p>Loading profile...</p>
      </main>
    );
  }

  const pillStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 14px",
    border: "1px solid #444",
    borderRadius: "999px",
    marginRight: "8px",
    marginBottom: "8px",
    cursor: "pointer",
  };

  const cardStyle = {
    padding: "20px",
    border: "1px solid #333",
    borderRadius: "18px",
    marginBottom: "20px",
  };

  return (
    <main
      style={{
        maxWidth: "430px",
        margin: "0 auto",
        padding: "28px 20px 40px",
      }}
    >
      <h1
        style={{
          fontSize: "32px",
          marginBottom: "24px",
        }}
      >
        Profile
      </h1>

      <section style={cardStyle}>
        <h2
          style={{
            marginTop: 0,
            marginBottom: "16px",
          }}
        >
          Food Preferences
        </h2>

        <h3
          style={{
            fontSize: "16px",
            marginBottom: "10px",
          }}
        >
          Diet
        </h3>

        <div>
          <label style={pillStyle}>
            <input
              type="checkbox"
              checked={diets.includes("vegetarian")}
              onChange={() => toggleDiet("vegetarian")}
            />
            Vegetarian
          </label>

          <label style={pillStyle}>
            <input
              type="checkbox"
              checked={diets.includes("vegan")}
              onChange={() => toggleDiet("vegan")}
            />
            Vegan
          </label>
        </div>

        <h3
          style={{
            fontSize: "16px",
            marginTop: "18px",
            marginBottom: "10px",
          }}
        >
          Allergies
        </h3>

        <div>
          <label style={pillStyle}>
            <input
              type="checkbox"
              checked={allergies.includes("eggs")}
              onChange={() => toggleAllergy("eggs")}
            />
            Eggs
          </label>

          <label style={pillStyle}>
            <input
              type="checkbox"
              checked={allergies.includes("dairy")}
              onChange={() => toggleAllergy("dairy")}
            />
            Dairy
          </label>

          <label style={pillStyle}>
            <input
              type="checkbox"
              checked={allergies.includes("nuts")}
              onChange={() => toggleAllergy("nuts")}
            />
            Nuts
          </label>
        </div>
      </section>

      <section style={cardStyle}>
        <h2
          style={{
            marginTop: 0,
            marginBottom: "18px",
          }}
        >
          Cooking Preferences
        </h2>

        <div
          style={{
            marginBottom: "18px",
          }}
        >
          <label
            style={{
              display: "block",
              fontSize: "14px",
              marginBottom: "8px",
            }}
          >
            Maximum cooking time
          </label>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <input
              type="number"
              min="5"
              step="5"
              value={maxCookingTime}
              onChange={(event) =>
                setMaxCookingTime(Number(event.target.value))
              }
              style={{
                width: "90px",
                padding: "10px",
                borderRadius: "10px",
                border: "1px solid #444",
              }}
            />

            <span style={{ color: "#888" }}>minutes</span>
          </div>
        </div>

        <div>
          <label
            style={{
              display: "block",
              fontSize: "14px",
              marginBottom: "8px",
            }}
          >
            Skill level
          </label>

          <select
            value={skillLevel}
            onChange={(event) =>
              setSkillLevel(
                event.target.value as
                  | "beginner"
                  | "intermediate"
                  | "advanced"
              )
            }
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #444",
            }}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </section>

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        style={{
          width: "100%",
          padding: "14px",
          borderRadius: "14px",
          border: "none",
          fontWeight: "700",
          fontSize: "16px",
          cursor: saving ? "not-allowed" : "pointer",
          marginBottom: "10px",
        }}
      >
        {saving ? "Saving..." : "Save Preferences"}
      </button>

      {message && (
        <p
          style={{
            marginTop: "8px",
            marginBottom: "32px",
            fontSize: "14px",
          }}
        >
          {message}
        </p>
      )}

      {!message && <div style={{ marginBottom: "32px" }} />}

      <section style={{ marginBottom: "32px" }}>
        <h2
          style={{
            marginBottom: "14px",
          }}
        >
          Your Stats
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "12px",
          }}
        >
          <div
            style={{
              padding: "18px",
              border: "1px solid #333",
              borderRadius: "16px",
            }}
          >
            <div
              style={{
                fontSize: "28px",
                fontWeight: "700",
              }}
            >
              {stats?.totalItems ?? 0}
            </div>

            <div
              style={{
                fontSize: "14px",
                color: "#888",
                marginTop: "4px",
              }}
            >
              Items in Fridge
            </div>
          </div>

          <div
            style={{
              padding: "18px",
              border: "1px solid #333",
              borderRadius: "16px",
            }}
          >
            <div
              style={{
                fontSize: "28px",
                fontWeight: "700",
              }}
            >
              {stats?.itemsSaved ?? 0}
            </div>

            <div
              style={{
                fontSize: "14px",
                color: "#888",
                marginTop: "4px",
              }}
            >
              Items Saved
            </div>
          </div>

          <div
            style={{
              padding: "18px",
              border: "1px solid #333",
              borderRadius: "16px",
            }}
          >
            <div
              style={{
                fontSize: "28px",
                fontWeight: "700",
              }}
            >
              {stats?.recipesCooked ?? 0}
            </div>

            <div
              style={{
                fontSize: "14px",
                color: "#888",
                marginTop: "4px",
              }}
            >
              Recipes Cooked
            </div>
          </div>

          <div
            style={{
              padding: "18px",
              border: "1px solid #333",
              borderRadius: "16px",
            }}
          >
            <div
              style={{
                fontSize: "28px",
                fontWeight: "700",
              }}
            >
              {stats?.expiringSoon ?? 0}
            </div>

            <div
              style={{
                fontSize: "14px",
                color: "#888",
                marginTop: "4px",
              }}
            >
              Expiring Soon
            </div>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: "32px" }}>
        <h2
          style={{
            marginBottom: "14px",
          }}
        >
          Achievements
        </h2>

        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            style={{
              padding: "16px",
              border: "1px solid #333",
              borderRadius: "16px",
              marginBottom: "10px",
              opacity: achievement.unlocked ? 1 : 0.5,
              display: "flex",
              gap: "12px",
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                fontSize: "24px",
              }}
            >
              {achievement.unlocked ? "🏆" : "🔒"}
            </div>

            <div>
              <strong
                style={{
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                {achievement.name}
              </strong>

              <div
                style={{
                  fontSize: "14px",
                  color: "#888",
                }}
              >
                {achievement.description}
              </div>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}