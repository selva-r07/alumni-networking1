// app/api/alumni/[id]/profile-view/route.ts
//
// POST  — called when a student visits an alumni profile page
//         Body: { studentId: string }
//         Deduplicates: one view per student per calendar day
//
// GET   — returns total view count for this alumni
//         Used by alumni dashboard to show real "Profile Views" stat

import { NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/model/User";

/* ── POST: record a profile view ── */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const { studentId } = await req.json();
    if (!studentId) {
      return Response.json({ error: "studentId is required" }, { status: 400 });
    }

    const alumni = await User.findOne({ _id: id, role: "alumni" });
    if (!alumni) {
      return Response.json({ error: "Alumni not found" }, { status: 404 });
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const alreadyViewedToday = alumni.profileViews.some((v: any) => {
      return (
        v.viewedBy.toString() === studentId &&
        new Date(v.viewedAt) >= todayStart
      );
    });

    if (!alreadyViewedToday) {
      alumni.profileViews.push({ viewedBy: studentId, viewedAt: new Date() });
      await alumni.save();
    }

    return Response.json({ totalViews: alumni.profileViews.length }, { status: 200 });
  } catch (error: any) {
    console.error("❌ POST profile-view error:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const alumni = await User.findOne({ _id: id, role: "alumni" }).select("profileViews");
    if (!alumni) {
      return Response.json({ error: "Alumni not found" }, { status: 404 });
    }

    return Response.json({ totalViews: alumni.profileViews.length }, { status: 200 });
  } catch (error: any) {
    console.error("❌ GET profile-view error:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}