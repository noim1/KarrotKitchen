import { supabase } from "@/lib/supabase";
import { FoodItem } from "@/types";

export async function addInventoryItems(items: FoodItem[]) {
  const rows = items.map((item) => ({
    id: item.id,
    name: item.name,
    normalized_name: item.normalizedName,
    category: item.category,
    quantity: item.quantity,
    unit: item.unit ?? null,
    purchase_date: item.purchaseDate,
    estimated_expiration_date: item.estimatedExpirationDate,
    estimated_shelf_life_days: item.estimatedShelfLifeDays,
    source: item.source,
  }));

  const { data, error } = await supabase
    .from("inventory_items")
    .insert(rows)
    .select();

  if (error) {
    console.error("Supabase insert error:", error);
    throw error;
  }

  return data;
}

export async function getInventory(): Promise<FoodItem[]> {
    const { data, error } = await supabase
      .from("inventory_items")
      .select("*")
      .order("estimated_expiration_date", {
        ascending: true,
      });
  
    if (error) {
      console.error("Supabase fetch error:", error);
      throw error;
    }
  
    return data.map((row) => ({
      id: row.id,
  
      name: row.name,
      normalizedName: row.normalized_name,
  
      category: row.category,
  
      quantity: row.quantity,
      unit: row.unit ?? undefined,
  
      purchaseDate: row.purchase_date,
  
      estimatedExpirationDate:
        row.estimated_expiration_date,
  
      estimatedShelfLifeDays:
        row.estimated_shelf_life_days,
  
      source: row.source,
    }));
  }