import { supabase } from "@/lib/supabase";
import {
    FoodItem,
    UserPreferences,
  } from "@/types";


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

export async function saveUserPreferences(
  preferences: UserPreferences
) {
  const { data: existing, error: fetchError } =
    await supabase
      .from("user_preferences")
      .select("*")
      .limit(1)
      .maybeSingle();

  if (fetchError) {
    throw fetchError;
  }

  if (existing) {
    const { data, error } = await supabase
      .from("user_preferences")
      .update({
        diets: preferences.diets,
        allergies: preferences.allergies,
        max_cooking_time:
          preferences.maxCookingTime ?? null,
        skill_level:
          preferences.skillLevel ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  const { data, error } = await supabase
    .from("user_preferences")
    .insert({
      diets: preferences.diets,
      allergies: preferences.allergies,
      max_cooking_time:
        preferences.maxCookingTime ?? null,
      skill_level:
        preferences.skillLevel ?? null,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function getUserPreferences():
  Promise<UserPreferences> {
  const { data, error } = await supabase
    .from("user_preferences")
    .select("*")
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return {
      diets: [],
      allergies: [],
    };
  }

  return {
    diets: data.diets ?? [],
    allergies: data.allergies ?? [],
    maxCookingTime:
      data.max_cooking_time ?? undefined,
    skillLevel:
      data.skill_level ?? undefined,
  };
}

export async function updateInventoryItem(
    id: string,
    updates: {
      quantity?: number;
      unit?: string;
      estimatedExpirationDate?: string;
    }
  ) {
    const databaseUpdates: Record<string, unknown> = {};
  
    if (updates.quantity !== undefined) {
      databaseUpdates.quantity = updates.quantity;
    }
  
    if (updates.unit !== undefined) {
      databaseUpdates.unit = updates.unit;
    }
  
    if (updates.estimatedExpirationDate !== undefined) {
      databaseUpdates.estimated_expiration_date =
        updates.estimatedExpirationDate;
    }
  
    const { data, error } = await supabase
      .from("inventory_items")
      .update(databaseUpdates)
      .eq("id", id)
      .select()
      .single();
  
    if (error) {
      throw error;
    }
  
    return data;
  }
  
  export async function deleteInventoryItem(
    id: string
  ) {
    const { error } = await supabase
      .from("inventory_items")
      .delete()
      .eq("id", id);
  
    if (error) {
      throw error;
    }
  }

  export async function consumeInventoryItems(
    ingredientNames: string[]
  ) {
    const inventory = await getInventory();
  
    for (const ingredientName of ingredientNames) {
      const match = inventory.find(
        (item) =>
          item.normalizedName.toLowerCase() ===
          ingredientName.toLowerCase()
      );
  
      if (!match) {
        continue;
      }
  
      const newQuantity = match.quantity - 1;
  
      if (newQuantity <= 0) {
        await deleteInventoryItem(match.id);
      } else {
        await updateInventoryItem(match.id, {
          quantity: newQuantity,
        });
      }
    }
  }