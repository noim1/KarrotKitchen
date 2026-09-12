export type FoodCategory =
  | "produce"
  | "dairy"
  | "meat"
  | "pantry"
  | "frozen"
  | "other";

export type ReceiptItem = {
  name: string;
  quantity: number;
  unit?: string;
  category: FoodCategory;
};

export type FoodItem = {
  id: string;

  name: string;
  normalizedName: string;

  category: FoodCategory;

  quantity: number;
  unit?: string;

  purchaseDate: string;

  estimatedExpirationDate: string;
  estimatedShelfLifeDays: number;

  source: "receipt" | "camera" | "manual";
};

export type Recipe = {
    id: string;
    name: string;
  
    ingredients: string[];
    instructions: string[];
  
    prepTime: number;
  
    difficulty: "easy" | "medium" | "hard";
  
    dietaryTags?: string[];
    allergens?: string[];
  
    missingIngredients?: string[];
    score?: number;
  };

export type UserPreferences = {
    diets: string[];
  
    allergies: string[];
  
    maxCookingTime?: number;
  
    skillLevel?:
      | "beginner"
      | "intermediate"
      | "advanced";
  };