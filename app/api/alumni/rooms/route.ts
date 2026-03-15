import connectDB from '@/lib/mongodb';
import Room from '@/model/Room';

export async function GET() {
  try {
    await connectDB();
    const rooms = await Room.find();
    return Response.json(rooms);
  } catch (error) {
    console.error('❌ ROOM GET ERROR:', error);
    return Response.json([], { status: 500 });
  }
}
