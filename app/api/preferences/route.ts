import { NextResponse } from "next/server";

import {
  getUserPreferences,
  saveUserPreferences,
} from "@/lib/database";

export async function GET() {
  try {
    const preferences = await getUserPreferences();

    return NextResponse.json({
      success: true,
      preferences,
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

export async function POST(request: Request) {
  try {
    const preferences = await request.json();

    const saved = await saveUserPreferences(
      preferences
    );

    return NextResponse.json({
      success: true,
      preferences: saved,
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