import {
    FoodItem,
    Recipe,
    UserPreferences,
  } from "@/types";

import {
  getDaysUntilExpiration,
} from "@/lib/expiration";

export function calculateUrgency(
  food: FoodItem
): number {
  const days = getDaysUntilExpiration(
    food.estimatedExpirationDate
  );

  if (days <= 0) return 100;
  if (days === 1) return 90;
  if (days <= 3) return 70;
  if (days <= 5) return 50;
  if (days <= 7) return 30;

  return 10;
}

export function getMissingIngredients(
  recipe: Recipe,
  inventory: FoodItem[]
): string[] {
  const inventoryNames = inventory.map(
    (food) => food.normalizedName.toLowerCase()
  );

  return recipe.ingredients.filter(
    (ingredient) =>
      !inventoryNames.includes(
        ingredient.toLowerCase()
      )
  );
}

export function recipeMatchesPreferences(
    recipe: Recipe,
    preferences: UserPreferences
  ): boolean {
    const recipeTags = recipe.dietaryTags ?? [];
    const recipeAllergens = recipe.allergens ?? [];
  
    for (const diet of preferences.diets) {
      if (!recipeTags.includes(diet)) {
        return false;
      }
    }
  
    for (const allergy of preferences.allergies) {
        const allergyLower = allergy.toLowerCase();
      
        const listedAsAllergen =
          recipeAllergens
            .map((item) => item.toLowerCase())
            .includes(allergyLower);
      
        const appearsInIngredients =
          recipe.ingredients.some(
            (ingredient) =>
              ingredient.toLowerCase() === allergyLower
          );
      
        if (
          listedAsAllergen ||
          appearsInIngredients
        ) {
          return false;
        }
      }
  
    if (
      preferences.maxCookingTime &&
      recipe.prepTime > preferences.maxCookingTime
    ) {
      return false;
    }
  
    return true;
  }

export function scoreRecipe(
  recipe: Recipe,
  inventory: FoodItem[]
): number {
  let score = 0;

  for (const food of inventory) {
    const recipeUsesFood = recipe.ingredients.some(
      (ingredient) =>
        ingredient.toLowerCase() ===
        food.normalizedName.toLowerCase()
    );

    if (recipeUsesFood) {
      score += calculateUrgency(food);
    }
  }

  const missingIngredients =
    getMissingIngredients(recipe, inventory);

  score -= missingIngredients.length * 20;

  return score;
}

export function rankRecipes(
  recipes: Recipe[],
  inventory: FoodItem[]
): Recipe[] {
  return recipes
    .map((recipe) => {
      const missingIngredients =
        getMissingIngredients(
          recipe,
          inventory
        );

      return {
        ...recipe,
        missingIngredients,
        score: scoreRecipe(
          recipe,
          inventory
        ),
      };
    })
    .sort(
      (a, b) =>
        (b.score ?? 0) -
        (a.score ?? 0)
    );
}

export function getRecommendedRecipes(
    recipes: Recipe[],
    inventory: FoodItem[],
    preferences: UserPreferences
  ): Recipe[] {
    const allowedRecipes = recipes.filter((recipe) =>
      recipeMatchesPreferences(recipe, preferences)
    );
  
    return rankRecipes(
      allowedRecipes,
      inventory
    );
  }