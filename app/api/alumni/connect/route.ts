// app/api/student/connect/route.ts
import Connection from '@/model/ConnectionRequest';
import dbConnect from '@/lib/mongodb';

export async function POST(req: Request) {
  await dbConnect();
  const { studentId, alumniId } = await req.json();

  await Connection.create({ student: studentId, alumni: alumniId });
  return Response.json({ success: true });
}
