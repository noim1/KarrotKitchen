import { NextResponse } from "next/server";

import {
  consumeInventoryItems,
  recordCookingEvent,
} from "@/lib/database";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const recipeId = body.recipeId;
    const recipeName = body.recipeName;
    const ingredients = body.ingredients;

    if (
      !recipeId ||
      !recipeName ||
      !Array.isArray(ingredients)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing recipe information",
        },
        { status: 400 }
      );
    }

    await consumeInventoryItems(ingredients);

    await recordCookingEvent(
      recipeId,
      recipeName,
      ingredients.length
    );

    return NextResponse.json({
      success: true,
      recipe: recipeName,
    });
  } catch (error) {
    console.error("Recipe completion failed:", error);

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