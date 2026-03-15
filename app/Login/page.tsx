'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Users, GraduationCap, Shield, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
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
        .a2 { animation: fadeUp 0.55s 0.15s ease both; }
        .a3 { animation: fadeUp 0.55s 0.25s ease both; }
        .a4 { animation: fadeUp 0.55s 0.35s ease both; }
        .a5 { animation: fadeUp 0.55s 0.45s ease both; }
        .a6 { animation: fadeUp 0.55s 0.55s ease both; }

        .portal-row {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px 24px;
          background: #fff;
          border: 1px solid rgba(0,0,0,0.08);
          text-decoration: none;
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }
        .portal-row::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 3px;
          background: #c8a84b;
          transform: scaleY(0);
          transition: transform 0.2s ease;
          transform-origin: bottom;
        }
        .portal-row:hover {
          border-color: rgba(0,0,0,0.18);
          box-shadow: 0 8px 28px rgba(0,0,0,0.08);
          transform: translateX(4px);
        }
        .portal-row:hover::before {
          transform: scaleY(1);
        }
        .portal-row:hover .portal-arrow {
          opacity: 1;
          transform: translate(3px, -3px);
        }
        .portal-arrow {
          opacity: 0.2;
          transition: all 0.2s ease;
        }
      `}</style>

      {/* ── LEFT: Full bleed image (same as landing) ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <Image
          src="/sjc Alumni img.jpg"
          alt="SJC College"
          fill
          className="object-cover"
          style={{ objectPosition: 'center top' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#f5f0e8]/25" />

        {/* Gold badge — same as landing */}
        <div className="absolute top-8 left-8">
          <div className="bg-[#c8a84b] text-black text-[10px] font-sans font-black tracking-widest px-3 py-1.5 uppercase">
            SJC Network
          </div>
        </div>

        {/* Bottom content — same as landing */}
        <div className="absolute bottom-0 left-0 right-0 p-10">
          <div className="border-l-4 border-[#c8a84b] pl-5 mb-8">
            <p className="text-[#c8a84b] text-[10px] tracking-[0.35em] uppercase font-sans font-bold mb-2">
              Est. Excellence
            </p>
            <h2 className="text-white text-3xl font-bold leading-tight">
              Where Legacy<br />Meets Future
            </h2>
          </div>
          <div className="flex gap-8">
            {[['2,400+', 'Alumni'], ['48', 'Batches'], ['92%', 'Placed']].map(([val, label]) => (
              <div key={label}>
                <p className="text-white text-2xl font-bold">{val}</p>
                <p className="text-white/50 text-xs font-sans tracking-wider mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT: Editorial portal selection ── */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-20 py-12 relative">

        {/* Horizontal rule texture — same as landing */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute left-0 right-0 border-t border-black/[0.04]"
              style={{ top: `${(i + 1) * 8.33}%` }}
            />
          ))}
        </div>

        <div className="relative max-w-md">

          {/* Back link */}
          <div className="a1 mb-10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[11px] font-sans font-bold tracking-widest uppercase text-black/35 hover:text-black transition-colors duration-150"
              style={{ textDecoration: 'none' }}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Home
            </Link>
          </div>

          {/* Issue tag — same style as landing */}
          <div className="a2 flex items-center gap-3 mb-10">
            <div className="w-8 h-px bg-black" />
            <span className="text-[10px] font-sans font-black tracking-[0.4em] text-black/40 uppercase">
              Sign In · {new Date().getFullYear()}
            </span>
          </div>

          {/* Headline — same typographic scale as landing */}
          <h1
            className="a3 font-bold text-black leading-[0.88] mb-2"
            style={{ fontSize: '3.8rem', letterSpacing: '-0.03em' }}
          >
            SIGN IN<br />
            TO YOUR<br />
            <span className="text-[#c8a84b]">PORTAL.</span>
          </h1>

          <p className="a4 text-black/50 text-sm font-sans leading-relaxed mt-5 mb-10 max-w-xs">
            Select your role below to access the SJC alumni network, student resources, or admin dashboard.
          </p>

          {/* Section label */}
          <div className="a4 flex items-center gap-3 mb-2">
            <span className="text-[9px] font-sans font-black tracking-[0.45em] text-black/30 uppercase">
              Choose your portal
            </span>
            <div className="flex-1 h-px bg-black/10" />
          </div>

          {/* Portal rows — matching landing editorial style */}
          <div className="a5 flex flex-col">
            {[
              {
                href: '/login/admin',
                Icon: Shield,
                num: '01',
                label: 'Admin Portal',
                sub: 'Platform & user management',
                accent: '#1a1a2e',
              },
              {
                href: '/login/alumni',
                Icon: GraduationCap,
                num: '02',
                label: 'Alumni Portal',
                sub: 'Graduate network & careers',
                accent: '#c8a84b',
              },
              {
                href: '/login/student',
                Icon: Users,
                num: '03',
                label: 'Student Portal',
                sub: 'Resources & mentorship',
                accent: '#2d5a27',
              },
            ].map(({ href, Icon, num, label, sub, accent }) => (
              <Link key={href} href={href} className="portal-row">

                {/* Number */}
                <span
                  className="text-[11px] font-sans font-black tracking-widest"
                  style={{ color: 'rgba(0,0,0,0.18)', minWidth: '26px' }}
                >
                  {num}
                </span>

                {/* Colored icon block */}
                <div
                  className="w-9 h-9 flex items-center justify-center flex-shrink-0"
                  style={{ background: accent }}
                >
                  <Icon className="w-4 h-4 text-white" />
                </div>

                {/* Label + sub */}
                <div className="flex-1">
                  <p className="font-bold text-black text-sm" style={{ fontFamily: 'Georgia, serif' }}>
                    {label}
                  </p>
                  <p className="text-black/40 text-xs font-sans mt-0.5">{sub}</p>
                </div>

                {/* Diagonal arrow */}
                <svg
                  className="portal-arrow w-4 h-4 flex-shrink-0"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M3 13L13 3M13 3H6M13 3v7"
                    stroke="black"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            ))}
          </div>

          {/* Register nudge */}
          <div className="a6 mt-8 flex items-center gap-2">
            <div className="flex-1 h-px bg-black/08" />
            <p className="text-black/35 text-[11px] font-sans px-2">
              New here?{' '}
              <Link
                href="/register"
                className="font-bold text-black/60 hover:text-[#c8a84b] transition-colors duration-150"
                style={{ textDecoration: 'none' }}
              >
                Create an account
              </Link>
            </p>
            <div className="flex-1 h-px bg-black/08" />
          </div>

          {/* Footer */}
          <p className="a6 text-black/25 text-[10px] font-sans tracking-widest mt-8 uppercase">
            © {new Date().getFullYear()} St. Joseph's College · All Rights Reserved
          </p>
        </div>
      </div>
    </div>
  );
}