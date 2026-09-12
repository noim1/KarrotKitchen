"use client";

import { useEffect, useState } from "react";
import {
  getRecommendedRecipes,
  completeRecipe,
} from "@/lib/api";
import { Recipe } from "@/types";

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cookingId, setCookingId] = useState<string | null>(null);

  async function loadRecipes() {
    try {
      setError("");
      setLoading(true);

      const recommendations =
        await getRecommendedRecipes();

      setRecipes(recommendations);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Could not load recipes"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRecipes();
  }, []);

  async function handleCooked(recipe: Recipe) {
    try {
      setCookingId(recipe.id);

      await completeRecipe(recipe);

      alert("Recipe completed!");

      await loadRecipes();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Could not complete recipe"
      );
    } finally {
      setCookingId(null);
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
        <p>Finding recipes for you...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main
        style={{
          maxWidth: "430px",
          margin: "0 auto",
          padding: "28px 20px",
        }}
      >
        <h1>Recommended Recipes</h1>

        <p>{error}</p>

        <button
          type="button"
          onClick={loadRecipes}
          style={{
            padding: "12px 18px",
            borderRadius: "12px",
            border: "1px solid #444",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Try Again
        </button>
      </main>
    );
  }

  return (
    <main
      style={{
        maxWidth: "430px",
        margin: "0 auto",
        padding: "28px 20px 40px",
      }}
    >
      <div
        style={{
          marginBottom: "24px",
        }}
      >
        <h1
          style={{
            fontSize: "32px",
            marginBottom: "6px",
          }}
        >
          Recommended Recipes
        </h1>

        <p
          style={{
            color: "#888",
            marginTop: 0,
          }}
        >
          Recipes based on what you already have.
        </p>
      </div>

      {recipes.length === 0 ? (
        <div
          style={{
            padding: "28px 20px",
            border: "1px solid #333",
            borderRadius: "18px",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              marginTop: 0,
            }}
          >
            No recipes found
          </h2>

          <p
            style={{
              color: "#888",
            }}
          >
            Add more groceries or update your food preferences
            to get new recommendations.
          </p>

          <button
            type="button"
            onClick={loadRecipes}
            style={{
              padding: "12px 18px",
              borderRadius: "12px",
              border: "1px solid #444",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Refresh Recipes
          </button>
        </div>
      ) : (
        recipes.map((recipe) => {
          const missingIngredients =
            recipe.missingIngredients ?? [];

          return (
            <article
              key={recipe.id}
              style={{
                padding: "20px",
                marginBottom: "18px",
                border: "1px solid #333",
                borderRadius: "18px",
              }}
            >
              <h2
                style={{
                  fontSize: "22px",
                  marginTop: 0,
                  marginBottom: "12px",
                }}
              >
                {recipe.name}
              </h2>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  marginBottom: "18px",
                }}
              >
                <span
                  style={{
                    fontSize: "13px",
                    border: "1px solid #444",
                    borderRadius: "999px",
                    padding: "6px 10px",
                  }}
                >
                  ⏱ {recipe.prepTime} min
                </span>

                <span
                  style={{
                    fontSize: "13px",
                    border: "1px solid #444",
                    borderRadius: "999px",
                    padding: "6px 10px",
                    textTransform: "capitalize",
                  }}
                >
                  {recipe.difficulty}
                </span>

                {missingIngredients.length === 0 && (
                  <span
                    style={{
                      fontSize: "13px",
                      border: "1px solid #444",
                      borderRadius: "999px",
                      padding: "6px 10px",
                    }}
                  >
                    ✓ You have everything
                  </span>
                )}
              </div>

              <section
                style={{
                  marginBottom: "18px",
                }}
              >
                <h3
                  style={{
                    fontSize: "16px",
                    marginBottom: "10px",
                  }}
                >
                  Ingredients
                </h3>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  {recipe.ingredients.map((ingredient, index) => {
                    const isMissing =
                      missingIngredients.some(
                        (missing) =>
                          missing.toLowerCase() ===
                          ingredient.toLowerCase()
                      );

                    return (
                      <div
                        key={`${ingredient}-${index}`}
                        style={{
                          padding: "10px 12px",
                          border: "1px solid #333",
                          borderRadius: "10px",
                          fontSize: "14px",
                          display: "flex",
                          justifyContent: "space-between",
                          gap: "12px",
                        }}
                      >
                        <span>{ingredient}</span>

                        <span
                          style={{
                            color: isMissing
                              ? "#c77474"
                              : "#74a57f",
                            fontWeight: "600",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {isMissing ? "Missing" : "Have"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </section>

              {missingIngredients.length > 0 && (
                <section
                  style={{
                    marginBottom: "18px",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "16px",
                      marginBottom: "8px",
                    }}
                  >
                    Missing Ingredients
                  </h3>

                  <p
                    style={{
                      color: "#888",
                      margin: 0,
                      lineHeight: 1.5,
                    }}
                  >
                    {missingIngredients.join(", ")}
                  </p>
                </section>
              )}

              <section
                style={{
                  marginBottom: "20px",
                }}
              >
                <h3
                  style={{
                    fontSize: "16px",
                    marginBottom: "10px",
                  }}
                >
                  Instructions
                </h3>

                <ol
                  style={{
                    paddingLeft: "22px",
                    marginBottom: 0,
                  }}
                >
                  {recipe.instructions.map((instruction, index) => (
                    <li
                      key={index}
                      style={{
                        marginBottom: "10px",
                        lineHeight: 1.5,
                      }}
                    >
                      {instruction}
                    </li>
                  ))}
                </ol>
              </section>

              <button
                type="button"
                onClick={() => handleCooked(recipe)}
                disabled={cookingId === recipe.id}
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: "12px",
                  border: "none",
                  fontSize: "16px",
                  fontWeight: "700",
                  cursor:
                    cookingId === recipe.id
                      ? "not-allowed"
                      : "pointer",
                  opacity:
                    cookingId === recipe.id ? 0.6 : 1,
                }}
              >
                {cookingId === recipe.id
                  ? "Updating..."
                  : "I Cooked This"}
              </button>
            </article>
          );
        })
      )}
    </main>
  );
}