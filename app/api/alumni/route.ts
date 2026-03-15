import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/model/User";

export async function GET() {
  try {
    await connectDB();
    const alumni = await User.find({ role: 'alumni' }).select('full_name email department graduation_year company job_title');
    return NextResponse.json(alumni);
  } catch (error) {
    console.error("GET ALUMNI ERROR:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
