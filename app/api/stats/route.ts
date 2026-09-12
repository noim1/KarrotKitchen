import { NextResponse } from "next/server";
import {
    getInventoryStats,
    getAchievements,
  } from "@/lib/database";

export async function GET() {
  try {
    const stats =
      await getInventoryStats();

    const achievements =
    await getAchievements();
  
    return NextResponse.json({
        success: true,
        stats,
        achievements,
      });
    
  } catch (error) {
    console.error(
      "Failed to fetch stats:",
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