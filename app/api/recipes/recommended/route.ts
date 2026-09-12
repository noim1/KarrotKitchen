import { NextResponse } from "next/server";
import OpenAI from "openai";

import {
  getInventory,
  getUserPreferences,
} from "@/lib/database";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET() {
  try {
    const inventory = await getInventory();
    const preferences = await getUserPreferences();

    const inventorySummary = inventory.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      expirationDate: item.estimatedExpirationDate,
    }));

    const prompt = `
You are a recipe recommendation assistant for college students.

Generate exactly 5 simple recipes using the user's current food inventory.

Prioritize:
1. Ingredients that expire soon
2. Ingredients already in the user's fridge
3. Cheap and simple meals
4. Recipes appropriate for the user's cooking skill
5. Recipes that respect dietary restrictions and allergies

Current inventory:
${JSON.stringify(inventorySummary, null, 2)}

User preferences:
${JSON.stringify(preferences, null, 2)}

Return ONLY valid JSON in this exact format:

{
  "recipes": [
    {
      "id": "unique-recipe-id",
      "name": "Recipe name",
      "ingredients": ["ingredient 1", "ingredient 2"],
      "instructions": [
        "Step 1",
        "Step 2"
      ],
      "prepTime": 15,
      "difficulty": "easy",
      "dietaryTags": ["vegetarian"],
      "allergens": [],
      "missingIngredients": []
    }
  ]
}

Rules:
- Return exactly 5 recipes.
- Prefer recipes where most ingredients are already available.
- missingIngredients must contain ingredients the user does not currently have.
- Never recommend ingredients that violate the user's allergies.
- Respect the user's diet preferences.
- Respect the user's maximum cooking time when possible.
- Keep recipes realistic and simple for a college student.
- prepTime must be a number in minutes.
- difficulty must be exactly "easy", "medium", or "hard".
- ingredients must contain simple ingredient names.
- instructions must contain clear cooking steps.
- Do not include markdown.
- Do not include explanations outside the JSON.
`;

    const response = await openai.responses.create({
      model: "gpt-5.6-luna",
      input: prompt,
    });

    const text = response.output_text;

    const parsed = JSON.parse(text);

    if (!Array.isArray(parsed.recipes)) {
      throw new Error("AI did not return a recipes array.");
    }

    return NextResponse.json({
      success: true,
      preferences,
      recommendations: parsed.recipes,
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
            : "Recipe generation failed",
      },
      {
        status: 500,
      }
    );
  }
}