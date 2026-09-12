import {
    shelfLifeDays,
    DEFAULT_SHELF_LIFE,
  } from "@/data/shelfLife";
  
  export function getShelfLife(foodName: string): number {
    return shelfLifeDays[foodName] ?? DEFAULT_SHELF_LIFE;
  }
  
  export function calculateExpirationDate(
    purchaseDate: string,
    shelfLifeDays: number
  ): string {
    const date = new Date(purchaseDate);
  
    date.setDate(date.getDate() + shelfLifeDays);
  
    return date.toISOString().split("T")[0];
  }
  
  export function getDaysUntilExpiration(
    expirationDate: string
  ): number {
    const today = new Date();
    const expiration = new Date(expirationDate);
  
    const difference =
      expiration.getTime() - today.getTime();
  
    return Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    );
  }
  
  export function getExpirationStatus(
    expirationDate: string
  ): "urgent" | "soon" | "fresh" {
    const days =
      getDaysUntilExpiration(expirationDate);
  
    if (days <= 1) {
      return "urgent";
    }
  
    if (days <= 3) {
      return "soon";
    }
  
    return "fresh";
  }