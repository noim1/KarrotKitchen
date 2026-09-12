import { FoodItem, Recipe } from "@/types";

import {
  getDaysUntilExpiration,
} from "@/lib/expiration";

export function calculateUrgency(
  food: FoodItem
): number {
  const days =
    getDaysUntilExpiration(
      food.estimatedExpirationDate
    );

  if (days <= 0) return 100;

  if (days === 1) return 90;

  if (days <= 3) return 70;

  if (days <= 5) return 50;

  if (days <= 7) return 30;

  return 10;
}

export function scoreRecipe(
    recipe: Recipe,
    inventory: FoodItem[]
  ): number {
    let score = 0;
  
    for (const food of inventory) {
      const recipeUsesFood =
        recipe.ingredients.some(
          (ingredient) =>
            ingredient.toLowerCase() ===
            food.normalizedName.toLowerCase()
        );
  
      if (recipeUsesFood) {
        score += calculateUrgency(food);
      }
    }
  
    const missingCount =
      recipe.missingIngredients?.length ?? 0;
  
    score -= missingCount * 20;
  
    return score;
  }

  export function rankRecipes(
    recipes: Recipe[],
    inventory: FoodItem[]
  ): Recipe[] {
    return recipes
      .map((recipe) => ({
        ...recipe,
  
        score: scoreRecipe(
          recipe,
          inventory
        ),
      }))
  
      .sort(
        (a, b) =>
          (b.score ?? 0) -
          (a.score ?? 0)
      );
  }