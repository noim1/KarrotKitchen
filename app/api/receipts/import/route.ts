import { NextResponse } from "next/server";

import { ReceiptItem } from "@/types";
import { receiptItemToFoodItem } from "@/lib/inventory";
import { addInventoryItems } from "@/lib/database";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const items = body.items as ReceiptItem[];

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No receipt items provided",
        },
        { status: 400 }
      );
    }

    const purchaseDate =
      body.purchaseDate ??
      new Date().toISOString().split("T")[0];

    const foodItems = items.map((item) =>
      receiptItemToFoodItem(item, purchaseDate)
    );

    const savedItems = await addInventoryItems(foodItems);

    return NextResponse.json({
      success: true,
      count: savedItems.length,
      items: savedItems,
    });
  } catch (error) {
    console.error("Receipt import failed:", error);

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