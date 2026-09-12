import { ReceiptItem, Recipe } from "@/types";

export async function importReceiptItems(
  items: ReceiptItem[],
  purchaseDate?: string
) {
  const response = await fetch("/api/receipts/import", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items,
      purchaseDate,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error ?? "Failed to import receipt"
    );
  }

  return data;
}

export async function addManualInventoryItem(
  item: ReceiptItem
) {
  const response = await fetch("/api/inventory", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error ?? "Failed to add inventory item"
    );
  }

  return data;
}

export async function getInventory() {
  const response = await fetch("/api/inventory");

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error ?? "Failed to load inventory"
    );
  }

  return data.inventory;
}

export async function getPreferences() {
  const response = await fetch("/api/preferences");
  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error ?? "Failed to load preferences"
    );
  }

  return data.preferences;
}

export async function savePreferences(preferences: {
  diets: string[];
  allergies: string[];
  maxCookingTime?: number;
  skillLevel?: "beginner" | "intermediate" | "advanced";
}) {
  const response = await fetch("/api/preferences", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(preferences),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error ?? "Failed to save preferences"
    );
  }

  return data.preferences;
}

export async function getRecommendedRecipes() {
  const response = await fetch(
    "/api/recipes/recommended"
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error ?? "Failed to load recommendations"
    );
  }

  return data.recommendations;
}

export async function completeRecipe(recipe: Recipe) {
  const response = await fetch("/api/recipes/complete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      recipeId: recipe.id,
      recipeName: recipe.name,
      ingredients: recipe.ingredients,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error ?? "Failed to complete recipe"
    );
  }

  return data;
}

export async function getStats() {
  const response = await fetch("/api/stats");
  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error ?? "Failed to load stats"
    );
  }

  return data;
}

export async function analyzeGroceryImage(
  image: File,
  mode: "receipt" | "items"
) {
  const formData = new FormData();

  formData.append("image", image);
  formData.append("mode", mode);

  const response = await fetch(
    "/api/analyze-image",
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error ?? "Failed to analyze image"
    );
  }

  return data.items;
}