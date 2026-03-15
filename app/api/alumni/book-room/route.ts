import connectDB from '@/lib/mongodb';
import Room from '@/model/Room';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { roomId } = await req.json();

    await Room.findByIdAndUpdate(roomId, { isBooked: true });

    return Response.json({ success: true });
  } catch (error) {
    console.error('❌ ROOM BOOK ERROR:', error);
    return Response.json(
      { error: 'Room booking failed' },
      { status: 500 }
    );
  }
}
