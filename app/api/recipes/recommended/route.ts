import { NextResponse } from "next/server";

import { getInventory } from "@/lib/database";
import { rankRecipes } from "@/lib/recipes";
import { demoRecipes } from "@/data/demoRecipes";

export async function GET() {
  try {
    const inventory =
      await getInventory();

    const recommendations =
      rankRecipes(
        demoRecipes,
        inventory
      );

    return NextResponse.json({
      success: true,
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