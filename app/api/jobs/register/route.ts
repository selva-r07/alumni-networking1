import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Job from "@/model/Job";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const {
      jobId,
      student_name,
      department_no,
      email,
      mobile
    } = body;

    const job = await Job.findById(jobId);

    if (!job)
      return NextResponse.json({ message: "Job not found" }, { status: 404 });

    const alreadyRegistered = job.registrations.some(
      (reg: any) => reg.email === email
    );

    if (alreadyRegistered)
      return NextResponse.json(
        { message: "Already registered" },
        { status: 400 }
      );

    job.registrations.push({
      student_name,
      department_no,
      email,
      mobile
    });

    await job.save();

    return NextResponse.json(
      { message: "Registered successfully" },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { message: "Registration failed" },
      { status: 500 }
    );
  }
}