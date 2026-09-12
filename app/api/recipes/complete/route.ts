import { NextResponse } from "next/server";

import { demoRecipes } from "@/data/demoRecipes";
import { consumeInventoryItems } from "@/lib/database";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const recipeId = body.recipeId;

    const recipe = demoRecipes.find(
      (recipe) => recipe.id === recipeId
    );

    if (!recipe) {
      return NextResponse.json(
        {
          success: false,
          error: "Recipe not found",
        },
        { status: 404 }
      );
    }

    await consumeInventoryItems(
      recipe.ingredients
    );

    return NextResponse.json({
      success: true,
      recipe: recipe.name,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : JSON.stringify(error),
      },
      { status: 500 }
    );
  }
}