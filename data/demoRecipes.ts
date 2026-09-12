import { Recipe } from "@/types";

export const demoRecipes: Recipe[] = [
  {
    id: "spinach-eggs",

    name: "Spinach Scrambled Eggs",

    ingredients: [
      "spinach",
      "eggs",
    ],

    instructions: [
      "Wash the spinach.",
      "Whisk the eggs.",
      "Cook the spinach in a pan for 1-2 minutes.",
      "Add the eggs and scramble until cooked.",
    ],

    prepTime: 10,

    difficulty: "easy",
  },

  {
    id: "avocado-toast",

    name: "Avocado Toast",

    ingredients: [
      "avocado",
      "bread",
    ],

    instructions: [
      "Toast the bread.",
      "Mash the avocado.",
      "Spread avocado over the toast.",
      "Season and serve.",
    ],

    prepTime: 5,

    difficulty: "easy",
  },

  {
    id: "breakfast-tacos",

    name: "Breakfast Tacos",

    ingredients: [
      "eggs",
      "avocado",
      "tortillas",
    ],

    instructions: [
      "Scramble the eggs.",
      "Warm the tortillas.",
      "Add the eggs.",
      "Top with avocado.",
      "Fold and serve.",
    ],

    prepTime: 15,

    difficulty: "easy",
  },

  {
    id: "spinach-quesadilla",

    name: "Spinach Quesadilla",

    ingredients: [
      "spinach",
      "tortillas",
      "cheese",
    ],

    instructions: [
      "Cook the spinach briefly.",
      "Place cheese and spinach on a tortilla.",
      "Fold the tortilla.",
      "Cook both sides until crispy.",
    ],

    prepTime: 12,

    difficulty: "easy",
  },

  {
    id: "yogurt-bowl",

    name: "Greek Yogurt Bowl",

    ingredients: [
      "yogurt",
      "strawberries",
    ],

    instructions: [
      "Add yogurt to a bowl.",
      "Slice the strawberries.",
      "Add strawberries on top.",
    ],

    prepTime: 5,

    difficulty: "easy",
  },
];