import { NextResponse } from "next/server";

import { ReceiptItem } from "@/types";

import { receiptItemToFoodItem } from "@/lib/inventory";

import { addInventoryItems } from "@/lib/database";

const validCategories = [
  "produce",
  "dairy",
  "meat",
  "pantry",
  "frozen",
  "other",
];

function isValidReceiptItem(
  item: unknown
): item is ReceiptItem {
  if (
    typeof item !== "object" ||
    item === null
  ) {
    return false;
  }

  const candidate =
    item as Record<string, unknown>;

  if (
    typeof candidate.name !== "string" ||
    candidate.name.trim() === ""
  ) {
    return false;
  }

  if (
    typeof candidate.quantity !== "number" ||
    candidate.quantity <= 0
  ) {
    return false;
  }

  if (
    typeof candidate.category !== "string" ||
    !validCategories.includes(
      candidate.category
    )
  ) {
    return false;
  }

  if (
    candidate.unit !== undefined &&
    typeof candidate.unit !== "string"
  ) {
    return false;
  }

  return true;
}

export async function POST(
  request: Request
) {
  try {
    const body = await request.json();

    const items = body.items;

    if (
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "No receipt items provided",
        },
        { status: 400 }
      );
    }

    const invalidItems =
      items.filter(
        (item) =>
          !isValidReceiptItem(item)
      );

    if (invalidItems.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error:
            "One or more receipt items are invalid",
          invalidItems,
        },
        { status: 400 }
      );
    }

    const purchaseDate =
      body.purchaseDate ??
      new Date()
        .toISOString()
        .split("T")[0];

    const foodItems =
      items.map((item) =>
        receiptItemToFoodItem(
          item,
          purchaseDate
        )
      );

    const savedItems =
      await addInventoryItems(
        foodItems
      );

    return NextResponse.json({
      success: true,
      count: savedItems.length,
      items: savedItems,
    });
  } catch (error) {
    console.error(
      "Receipt import failed:",
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
      { status: 500 }
    );
  }
}