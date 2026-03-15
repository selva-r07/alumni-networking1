import connectDB from '@/lib/mongodb';
import User from '@/model/User';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    if (!email || !password) {
      return Response.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Find alumni user by email
    const user = await User.findOne({ email: email.toLowerCase().trim(), role: 'alumni' });

    if (!user) {
      return Response.json({ error: 'No alumni account found with this email' }, { status: 401 });
    }

    // bcrypt compare — handles hashed passwords stored during registration
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return Response.json({ error: 'Incorrect password' }, { status: 401 });
    }

    // ✅ Return user with _id explicitly — this is what AuthContext saves to localStorage
    const userObj = {
      _id:             user._id.toString(),   // ← this is what AuthContext does: localStorage.setItem("userId", data.user._id)
      full_name:       user.full_name,
      email:           user.email,
      role:            user.role,
      department:      user.department,
      graduation_year: user.graduation_year,
      company:         user.company,
      job_title:       user.job_title,
    };

    console.log('✅ Alumni login success, returning user._id:', userObj._id);

    return Response.json({ user: userObj }, { status: 200 });

  } catch (error: any) {
    console.error('❌ Alumni login error:', error);
    return Response.json({ error: 'Server error. Please try again.' }, { status: 500 });
  }
}