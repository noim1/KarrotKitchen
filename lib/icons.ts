import type { FoodCategory } from "@/types";

export const navIcons = {
  home: {
    src: undefined,
    fallback: "⌂",
  },

  fridge: {
    src: "/images/categories/Inventory.png",
    fallback: "▣",
  },

  add: {
    src: undefined,
    fallback: "+",
  },

  recipes: {
    src: "/images/categories/Recipes.png",
    fallback: "♨",
  },

  profile: {
    src: "/images/categories/Profile.png",
    fallback: "♙",
  },
} as const;

export const categoryMeta: Record<
  FoodCategory,
  {
    label: string;
    src: string;
    fallback: string;
  }
> = {
  meat: {
    label: "Meat",
    src: "/images/categories/Meat.png",
    fallback: "🥩",
  },

  dairy: {
    label: "Dairy",
    src: "/images/categories/Dairy.png",
    fallback: "🥛",
  },

  fruit: {
    label: "Fruit",
    src: "/images/categories/Fruit.png",
    fallback: "🍎",
  },

  vegetables: {
    label: "Vegetables",
    src: "/images/categories/Vegetable.png",
    fallback: "🥦",
  },

  condiments: {
    label: "Condiments",
    src: "/images/categories/Condiments.png",
    fallback: "🫙",
  },

  staple: {
    label: "Staple Foods",
    src: "/images/categories/Staple Foods.png",
    fallback: "🌾",
  },

  other: {
    label: "Other",
    src: "/images/categories/Other.png",
    fallback: "🧺",
  },
};

export const foodCategories =
  Object.keys(categoryMeta) as FoodCategory[];