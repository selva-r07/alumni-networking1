import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/model/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    // ✅ SUPPORT BOTH FLAT & NESTED PAYLOADS
    const payload = body.data ? { ...body.data, email: body.email, password: body.password } : body;

    const {
      full_name,
      email,
      password,
      role,
      department,
      graduation_year,
      company,
      job_title,
    } = payload;

    const gradYear = Number(graduation_year);

    // ✅ REQUIRED FIELD CHECK (NOW FIXED)
    if (
      !full_name ||
      !email ||
      !password ||
      !role ||
      !department ||
      !gradYear
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    if (role === "alumni" && (!company || !job_title)) {
      return NextResponse.json(
        { error: "Alumni must provide company and job title" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
  full_name,                             // ✅ MATCH SCHEMA
  email,
  password: hashedPassword,
  role,
  department,
  graduation_year: Number(graduation_year), // ✅ MATCH SCHEMA
  company: role === "alumni" ? company : undefined,
  job_title: role === "alumni" ? job_title : undefined,
});

    return NextResponse.json(
      { message: "Registration successful" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("❌ REGISTER API CRASHED");
    console.error(error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
