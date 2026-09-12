import { FoodItem, ReceiptItem } from "@/types";

import {
  getShelfLife,
  calculateExpirationDate,
} from "@/lib/expiration";

export function normalizeFoodName(
  name: string
): string {
  const value = name.toLowerCase().trim();

  if (
    value.includes("spinach") ||
    value.includes("spnch")
  ) {
    return "spinach";
  }

  if (value.includes("avocado")) {
    return "avocado";
  }

  if (value.includes("strawber")) {
    return "strawberries";
  }

  if (value.includes("blueber")) {
    return "blueberries";
  }

  if (value.includes("mushroom")) {
    return "mushrooms";
  }

  if (value.includes("egg")) {
    return "eggs";
  }

  if (
    value.includes("yogurt") ||
    value.includes("ygrt")
  ) {
    return "yogurt";
  }

  if (value.includes("tortilla")) {
    return "tortillas";
  }

  if (value.includes("chicken")) {
    return "chicken";
  }

  if (value.includes("milk")) {
    return "milk";
  }

  return value;
}

export function receiptItemToFoodItem(
    item: ReceiptItem,
    purchaseDate: string
  ): FoodItem {
    const normalizedName =
      normalizeFoodName(item.name);
  
    const shelfLife =
      getShelfLife(normalizedName);
  
    return {
      id: crypto.randomUUID(),
  
      name: item.name,
  
      normalizedName,
  
      category: item.category,
  
      quantity: item.quantity,
  
      unit: item.unit,
  
      purchaseDate,
  
      estimatedShelfLifeDays: shelfLife,
  
      estimatedExpirationDate:
        calculateExpirationDate(
          purchaseDate,
          shelfLife
        ),
  
      source: "receipt",
    };
  }