import { NextResponse } from "next/server";

import { demoReceiptItems } from "@/data/demoReceipt";
import { receiptItemToFoodItem } from "@/lib/inventory";
import { addInventoryItems } from "@/lib/database";

export async function POST() {
  try {
    const today = new Date().toISOString().split("T")[0];

    const inventory = demoReceiptItems.map((item) =>
      receiptItemToFoodItem(item, today)
    );

    const savedItems = await addInventoryItems(inventory);

    return NextResponse.json({
      success: true,
      count: savedItems.length,
      items: savedItems,
    });
} catch (error) {
    console.error("Database test failed:", error);
  
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