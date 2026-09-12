import { NextResponse } from "next/server";

import { getInventory } from "@/lib/database";
import {
  getRecommendedRecipes,
} from "@/lib/recipes";

import { demoRecipes } from "@/data/demoRecipes";

export async function GET() {
  try {
    const inventory = await getInventory();

    const preferences = {
      diets: ["vegetarian"],
      allergies: ["gluten"],
      maxCookingTime: 20,
      skillLevel: "beginner" as const,
    };

    const recommendations =
      getRecommendedRecipes(
        demoRecipes,
        inventory,
        preferences
      );

    return NextResponse.json({
      success: true,
      preferences,
      recommendations,
    });
  } catch (error) {
    console.error(
      "Recipe recommendation failed:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : JSON.stringify(error),
      },
      {
        status: 500,
      }
    );
  }
}