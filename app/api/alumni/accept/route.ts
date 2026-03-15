// app/api/alumni/accept/route.ts
import Connection from '@/model/ConnectionRequest';
import dbConnect from '@/lib/mongodb';

export async function POST(req: Request) {
  await dbConnect();
  const { requestId } = await req.json();

  await Connection.findByIdAndUpdate(requestId, { status: 'accepted' });
  return Response.json({ success: true });
}
