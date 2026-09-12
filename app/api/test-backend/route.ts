import { NextResponse } from "next/server";

import { demoReceiptItems } from "@/data/demoReceipt";
import { demoRecipes } from "@/data/demoRecipes";

import {
  receiptItemToFoodItem,
} from "@/lib/inventory";

import {
  rankRecipes,
} from "@/lib/recipes";

export async function GET() {
  const today =
    new Date().toISOString().split("T")[0];

  const inventory =
    demoReceiptItems.map((item) =>
      receiptItemToFoodItem(
        item,
        today
      )
    );

  const recipes =
    rankRecipes(
      demoRecipes,
      inventory
    );

  return NextResponse.json({
    inventory,
    recipes,
  });
}