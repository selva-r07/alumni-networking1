import connectDB from '@/lib/mongodb';
import Job from '@/model/Job';
import { NextRequest } from 'next/server';

export async function GET() {
  try {
    await connectDB();
    const jobs = await Job.find()
      .populate('postedBy', 'full_name email department')
      .sort({ createdAt: -1 });
    return Response.json(jobs, { status: 200 });
  } catch (error) {
    console.error('❌ GET /api/jobs error:', error);
    return Response.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const { role, company_name, salary, description, address, postedBy } = body;

    // Validate all required fields explicitly
    const missing: string[] = [];
    if (!role?.trim())        missing.push('role');
    if (!company_name?.trim()) missing.push('company_name');
    if (!salary?.trim())      missing.push('salary');
    if (!description?.trim()) missing.push('description');
    if (!address?.trim())     missing.push('address');
    if (!postedBy)            missing.push('postedBy');

    if (missing.length > 0) {
      return Response.json(
        { error: `Missing required fields: ${missing.join(', ')}` },
        { status: 400 }
      );
    }

    const job = await Job.create({ role, company_name, salary, description, address, postedBy });
    return Response.json(job, { status: 201 });

  } catch (error: any) {
    console.error('❌ POST /api/jobs error:', error);
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors)
        .map((e: any) => e.message)
        .join(', ');
      return Response.json({ error: message }, { status: 400 });
    }
    if (error.name === 'CastError') {
      return Response.json({ error: 'Invalid user ID format' }, { status: 400 });
    }
    return Response.json({ error: 'Failed to create job' }, { status: 500 });
  }
}