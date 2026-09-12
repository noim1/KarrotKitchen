import { NextResponse } from "next/server";

import { getInventory } from "@/lib/database";

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