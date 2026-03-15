'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Users, ArrowLeft, BookOpen, GraduationCap, Wifi } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

export default function StudentLoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [registerNumber, setRegisterNumber] = useState('');
  const [password, setPassword] = useState('');
  const [focused, setFocused] = useState<string | null>(null);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await signIn(registerNumber, password);
    setLoading(false);
    if (result.error) {
      setError(result.error.message);
    } else {
      router.push('/Dashboard/Students');
    }
  };

  return (
    <div
      className="min-h-screen bg-[#f5f0e8] flex"
      style={{ fontFamily: "'Georgia', serif" }}
    >
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .a1 { animation: fadeUp 0.55s 0.05s ease both; }
        .a2 { animation: fadeUp 0.55s 0.12s ease both; }
        .a3 { animation: fadeUp 0.55s 0.20s ease both; }
        .a4 { animation: fadeUp 0.55s 0.28s ease both; }
        .a5 { animation: fadeUp 0.55s 0.36s ease both; }
        .a6 { animation: fadeUp 0.55s 0.44s ease both; }
        .a7 { animation: fadeUp 0.55s 0.52s ease both; }

        .field-input {
          width: 100%;
          padding: 13px 16px;
          background: #fff;
          border: 1px solid rgba(0,0,0,0.12);
          font-family: sans-serif;
          font-size: 13px;
          color: #1a1a2e;
          outline: none;
          transition: border-color 0.18s ease, box-shadow 0.18s ease;
          -webkit-appearance: none;
          border-radius: 0;
        }
        .field-input::placeholder { color: rgba(0,0,0,0.25); }
        .field-input:focus {
          border-color: #2d5a27;
          box-shadow: 0 0 0 3px rgba(45,90,39,0.08);
        }

        .submit-btn {
          width: 100%;
          padding: 15px;
          background: #1a1a2e;
          color: #fff;
          font-family: sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .submit-btn:hover {
          background: #2d5a27;
          box-shadow: 0 8px 24px rgba(45,90,39,0.25);
          transform: translateY(-1px);
        }

        .other-portal {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 18px;
          background: #fff;
          border: 1px solid rgba(0,0,0,0.08);
          text-decoration: none;
          transition: all 0.18s ease;
          position: relative;
          overflow: hidden;
        }
        .other-portal::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 3px;
          background: #c8a84b;
          transform: scaleY(0);
          transition: transform 0.18s ease;
          transform-origin: bottom;
        }
        .other-portal:hover { border-color: rgba(0,0,0,0.18); box-shadow: 0 4px 16px rgba(0,0,0,0.06); transform: translateX(3px); }
        .other-portal:hover::before { transform: scaleY(1); }

        .checkbox-box {
          width: 16px; height: 16px;
          border: 1.5px solid rgba(0,0,0,0.2);
          background: #fff;
          cursor: pointer;
          flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.15s ease;
        }
        .checkbox-box.checked { background: #2d5a27; border-color: #2d5a27; }
      `}</style>

      {/* ══ LEFT: Dark info panel (contrasts cream right) ══ */}
      <div
        className="hidden lg:flex lg:w-[42%] flex-col justify-between flex-shrink-0 relative overflow-hidden"
        style={{ background: '#1a1a2e', minHeight: '100vh' }}
      >
        {/* Dot texture */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '36px 36px' }} />
        {/* Glows */}
        <div className="absolute top-0 left-0 w-80 h-80 rounded-full blur-[100px] pointer-events-none"
          style={{ background: 'rgba(200,168,75,0.1)' }} />
        <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full blur-[80px] pointer-events-none"
          style={{ background: 'rgba(45,90,39,0.18)' }} />

        <div className="relative flex flex-col h-full p-12 justify-between">

          {/* Branding */}
          <div>
            <div className="inline-block bg-[#c8a84b] text-black text-[10px] font-sans font-black tracking-widest px-3 py-1.5 uppercase mb-10">
              SJC Network
            </div>
            <div className="border-l-4 border-[#c8a84b] pl-5 mb-6">
              <p className="text-[#c8a84b] text-[10px] tracking-[0.35em] uppercase font-sans font-bold mb-2">
                Student Portal
              </p>
              <h2 className="text-white text-3xl font-bold leading-tight">
                Welcome<br />Back,<br />
                <span className="text-[#c8a84b]">Student.</span>
              </h2>
            </div>
            <p className="text-white/35 text-sm font-sans leading-relaxed max-w-[210px]">
              Sign in to access your academic resources, mentorship network, and campus community.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-5">
            {[
              { Icon: BookOpen,      title: 'Academic Resources', desc: 'Notes, timetables & results'   },
              { Icon: GraduationCap, title: 'Alumni Mentorship',  desc: 'Connect with SJC graduates'    },
              { Icon: Wifi,          title: 'Campus Network',     desc: 'Events, clubs & announcements' },
            ].map(({ Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="w-9 h-9 flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: 'rgba(200,168,75,0.1)', border: '1px solid rgba(200,168,75,0.2)' }}>
                  <Icon className="w-4 h-4 text-[#c8a84b]" />
                </div>
                <div>
                  <p className="text-white/80 text-sm font-semibold" style={{ fontFamily: 'Georgia, serif' }}>{title}</p>
                  <p className="text-white/30 text-[11px] font-sans mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quote */}
          <div className="p-5" style={{ borderLeft: '3px solid rgba(200,168,75,0.35)', background: 'rgba(200,168,75,0.05)' }}>
            <p className="text-white/40 text-[12px] font-sans italic leading-relaxed">
              "Education is the most powerful weapon which you can use to change the world."
            </p>
            <p className="text-[#c8a84b]/55 text-[10px] font-sans font-bold tracking-wider mt-3 uppercase">
              — Nelson Mandela
            </p>
          </div>
        </div>
      </div>

      {/* ══ RIGHT: Cream editorial form panel ══ */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-14 lg:px-16 py-12 relative">

        {/* Horizontal rule texture — same as landing */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="absolute left-0 right-0 border-t border-black/[0.04]"
              style={{ top: `${(i + 1) * 8.33}%` }} />
          ))}
        </div>

        <div className="relative max-w-md w-full mx-auto">

          {/* Back */}
          <div className="a1 mb-10">
            <Link href="/login"
              className="inline-flex items-center gap-2 text-[11px] font-sans font-bold tracking-widest uppercase text-black/30 hover:text-black transition-colors duration-150"
              style={{ textDecoration: 'none' }}>
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Portals
            </Link>
          </div>

          {/* Issue tag */}
          <div className="a2 flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-black" />
            <span className="text-[10px] font-sans font-black tracking-[0.4em] text-black/40 uppercase">
              Student Login · {new Date().getFullYear()}
            </span>
          </div>

          {/* Headline — same scale as landing */}
          <h1 className="a3 font-bold text-black leading-[0.88] mb-2"
            style={{ fontSize: '3.2rem', letterSpacing: '-0.03em' }}>
            SIGN IN<br />
            <span className="text-[#2d5a27]">STUDENT</span><br />
            PORTAL.
          </h1>

          <p className="a4 text-black/45 text-sm font-sans leading-relaxed mt-4 mb-10 max-w-xs">
            Enter your register number and password to access your dashboard.
          </p>

          {/* ── Form ── */}
          <form onSubmit={handleSubmit}>

            {error && (
              <div className="a5 mb-5 p-4 bg-red-50 border border-red-200">
                <p className="text-red-600 text-sm font-sans">{error}</p>
              </div>
            )}

            {/* Register Number */}
            <div className="a5 mb-5">
              <label className="block text-[10px] font-sans font-black tracking-[0.35em] uppercase text-black/35 mb-2">
                Register Number
              </label>
              <input
                type="text"
                value={registerNumber}
                onChange={e => setRegisterNumber(e.target.value)}
                onFocus={() => setFocused('reg')}
                onBlur={() => setFocused(null)}
                placeholder="e.g. 21CS001"
                className="field-input"
              />
            </div>

            {/* Password */}
            <div className="a6 mb-5">
              <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] font-sans font-black tracking-[0.35em] uppercase text-black/35">
                  Password
                </label>
                <Link href="/forgot-password"
                  className="text-[11px] font-sans font-bold text-black/30 hover:text-[#2d5a27] transition-colors"
                  style={{ textDecoration: 'none' }}>
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocused('pwd')}
                  onBlur={() => setFocused(null)}
                  placeholder="Enter your password"
                  className="field-input"
                  style={{ paddingRight: '48px' }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-black/25 hover:text-black/60 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember */}
            <div className="a6 flex items-center gap-3 mb-8">
              <div className={`checkbox-box ${remember ? 'checked' : ''}`} onClick={() => setRemember(!remember)}>
                {remember && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <span className="text-[12px] font-sans text-black/40 cursor-pointer select-none"
                onClick={() => setRemember(!remember)}>
                Keep me signed in on this device
              </span>
            </div>

            {/* Submit */}
            <div className="a7">
              <button type="submit" className="submit-btn" disabled={loading}>
                <Users className="w-4 h-4" />
                {loading ? 'Signing In...' : 'Sign In to Student Portal'}
              </button>
            </div>
          </form>

          {/* Other portals */}
          <div className="a7 mt-10">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[9px] font-sans font-black tracking-[0.45em] text-black/25 uppercase">
                Other Portals
              </span>
              <div className="flex-1 h-px bg-black/[0.07]" />
            </div>
            <div className="flex flex-col gap-2">
              {[
                { href: '/login/AdminLogin',  Icon: Users,         num: '01', label: 'Admin Portal',  sub: 'Platform management', accent: '#1a1a2e' },
                { href: '/login/AlumniLogin', Icon: GraduationCap, num: '02', label: 'Alumni Portal', sub: 'Graduate network',     accent: '#c8a84b' },
              ].map(({ href, Icon, num, label, sub, accent }) => (
                <Link key={href} href={href} className="other-portal">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-sans font-black text-black/18 w-6">{num}</span>
                    <div className="w-7 h-7 flex items-center justify-center flex-shrink-0" style={{ background: accent }}>
                      <Icon className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div>
                      <p className="text-black font-bold text-xs" style={{ fontFamily: 'Georgia, serif' }}>{label}</p>
                      <p className="text-black/35 text-[10px] font-sans">{sub}</p>
                    </div>
                  </div>
                  <svg className="w-3.5 h-3.5 text-black/20" viewBox="0 0 16 16" fill="none">
                    <path d="M3 13L13 3M13 3H6M13 3v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              ))}
            </div>
          </div>

          {/* Footer */}
          <p className="text-black/22 text-[10px] font-sans tracking-widest mt-10 uppercase">
            © {new Date().getFullYear()} St. Joseph's College · All Rights Reserved
          </p>
        </div>
      </div>
    </div>
  );
}