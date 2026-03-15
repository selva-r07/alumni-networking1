import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";

export async function GET() {
  try {
    await connectDB();

    return NextResponse.json({
      success: true,
      state: mongoose.connection.readyState
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "MongoDB connection failed"
      },
      { status: 500 }
    );
  }
}
