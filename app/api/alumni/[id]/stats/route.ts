import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Job from "@/model/Job";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    const jobsPosted = await Job.find({ postedBy: id });
    
    const totalApplications = jobsPosted.reduce(
      (sum, job) => sum + (job.registrations?.length || 0),
      0
    );

    return NextResponse.json({
      totalApplications,
      totalProfileViews: 0,
    });
  } catch (error) {
    console.error("GET ALUMNI STATS ERROR:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
