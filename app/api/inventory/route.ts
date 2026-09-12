import { NextResponse } from "next/server";

import { getInventory } from "@/lib/database";
import { receiptItemToFoodItem } from "@/lib/inventory";
import { addInventoryItems } from "@/lib/database";
import { ReceiptItem } from "@/types";

export async function GET() {
  try {
    const inventory = await getInventory();

    return NextResponse.json({
      success: true,
      inventory,
    });
  } catch (error) {
    console.error("Failed to fetch inventory:", error);

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

export async function POST(request: Request) {
    try {
      const body = await request.json();
  
      const item = body as ReceiptItem;
  
      if (!item.name || item.quantity === undefined || !item.category) {
        return NextResponse.json(
          {
            success: false,
            error: "Missing required fields",
          },
          { status: 400 }
        );
      }
  
      if (item.quantity <= 0) {
        return NextResponse.json(
          {
            success: false,
            error: "Quantity must be greater than 0",
          },
          { status: 400 }
        );
      }
  
      const purchaseDate =
        new Date().toISOString().split("T")[0];
  
      const foodItem = receiptItemToFoodItem(
        item,
        purchaseDate
      );
  
      const savedItems = await addInventoryItems([
        foodItem,
      ]);
  
      return NextResponse.json({
        success: true,
        item: savedItems[0],
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