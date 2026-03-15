import connectDB from '@/lib/mongodb';
import Reunion from '@/model/Reunion';

export async function GET() {
  try {
    await connectDB();
    const reunions = await Reunion.find();
    return Response.json(reunions);
  } catch (error) {
    console.error('❌ REUNION GET ERROR:', error);
    return Response.json([], { status: 500 });
  }
}
