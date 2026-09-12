import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const image = formData.get("image");
    const mode = formData.get("mode");

    if (!(image instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          error: "No image provided",
        },
        { status: 400 }
      );
    }

    if (mode !== "receipt" && mode !== "items") {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid analysis mode",
        },
        { status: 400 }
      );
    }

    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const base64 = buffer.toString("base64");

    const imageUrl =
      `data:${image.type};base64,${base64}`;

    const prompt =
      mode === "receipt"
        ? `
Analyze this grocery receipt.

Extract only grocery/food items.

Return ONLY valid JSON in this exact format:

{
  "items": [
    {
      "name": "Milk",
      "quantity": 1,
      "unit": "gallon",
      "category": "dairy"
    }
  ]
}

Allowed categories:
meat
dairy
fruit
vegetables
condiments
staple
other

Rules:
- Ignore taxes, totals, discounts, store names, and non-food items.
- Convert abbreviated receipt names into understandable grocery names when possible.
- quantity must be a positive number.
- category must be exactly one of: meat, dairy, fruit, vegetables, condiments, staple, other.
- Use "other" if the category is uncertain.
- Do not include markdown.
- Do not include explanations.
`
        : `
Analyze this image of groceries.

Identify the visible grocery/food items.

Return ONLY valid JSON in this exact format:

{
  "items": [
    {
      "name": "Bananas",
      "quantity": 3,
      "unit": "pieces",
      "category": "fruit"
    }
  ]
}

Allowed categories:
meat
dairy
fruit
vegetables
condiments
staple
other

Rules:
- Only include grocery or food items you can reasonably identify.
- Estimate quantities from visible items when possible.
- Use quantity 1 when quantity cannot reasonably be determined.
- category must be exactly one of: meat, dairy, fruit, vegetables, condiments, staple, other.
- Use "other" if the category is uncertain.
- Do not include markdown.
- Do not include explanations.
`;

    const response = await openai.responses.create({
      model: "gpt-5.6-luna",

      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: prompt,
            },
            {
              type: "input_image",
              image_url: imageUrl,
              detail: mode === "receipt" ? "high" : "low",
            },
          ],
        },
      ],
    });

    const text = response.output_text;

    const parsed = JSON.parse(text);

    if (!Array.isArray(parsed.items)) {
      throw new Error(
        "AI did not return an items array"
      );
    }

    return NextResponse.json({
      success: true,
      items: parsed.items,
    });
  } catch (error) {
    console.error(
      "Image analysis failed:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Image analysis failed",
      },
      { status: 500 }
    );
  }
}