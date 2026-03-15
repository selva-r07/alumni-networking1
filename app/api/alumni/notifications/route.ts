// app/api/alumni/notifications/route.ts
import Connection from '@/model/ConnectionRequest';
import dbConnect from '@/lib/mongodb';

export async function GET(req: Request) {
  await dbConnect();
  const alumniId = req.headers.get('alumni-id');

  const requests = await Connection.find({
    alumni: alumniId,
    status: 'pending'
  }).populate('student');

  return Response.json(requests);
}
