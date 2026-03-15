import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Job from "@/model/Job";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const { role, company_name, salary, description, address, postedBy } = body;

    const newJob = await Job.create({
      role,
      company_name,
      salary,
      description,
      address,
      postedBy,
    });

    return NextResponse.json(newJob, { status: 201 });

  } catch (error) {
    console.error("POST JOB ERROR:", error);
    return NextResponse.json(
      { message: "Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();

    const jobs = await Job.find()
      .populate("postedBy", "full_name email role department graduation_year company job_title")
      .sort({ createdAt: -1 });

    return NextResponse.json(jobs);
  } catch (error) {
    console.error("GET JOB ERROR:", error);
    return NextResponse.json(
      { message: "Server Error" },
      { status: 500 }
    );
  }
}