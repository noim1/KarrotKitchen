import { Recipe } from "@/types";

export const demoRecipes: Recipe[] = [
  {
    id: "recipe-1",

    name: "Spinach Avocado Breakfast Tacos",

    ingredients: [
      "spinach",
      "avocado",
      "eggs",
      "tortillas",
    ],

    instructions: [
      "Scramble the eggs.",
      "Cook the spinach with the eggs.",
      "Warm the tortillas.",
      "Add avocado.",
      "Serve.",
    ],

    prepTime: 15,

    difficulty: "easy",

    missingIngredients: [],
  },

  {
    id: "recipe-2",

    name: "Greek Yogurt Bowl",

    ingredients: [
      "yogurt",
      "strawberries",
    ],

    instructions: [
      "Add yogurt to a bowl.",
      "Top with strawberries.",
    ],

    prepTime: 5,

    difficulty: "easy",

    missingIngredients: [
      "strawberries",
    ],
  },
];