'use client';

import Link from 'next/link';
import Image from 'next/image';
import { GraduationCap, Users, Briefcase, BookOpen, ArrowRight, Star } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f5f0e8] flex flex-col" style={{ fontFamily: "'Georgia', serif" }}>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .a1 { animation: fadeUp 0.6s 0.05s ease both; }
        .a2 { animation: fadeUp 0.6s 0.18s ease both; }
        .a3 { animation: fadeUp 0.6s 0.30s ease both; }
        .a4 { animation: fadeUp 0.6s 0.42s ease both; }
        .a5 { animation: fadeUp 0.6s 0.54s ease both; }

        .btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          background: #1a1a2e; color: #fff;
          font-family: sans-serif; font-size: 13px; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase;
          padding: 14px 28px; text-decoration: none;
          transition: all 0.2s ease;
        }
        .btn-primary:hover { background: #c8a84b; color: #000; }

        .btn-secondary {
          display: inline-flex; align-items: center; gap: 8px;
          background: transparent; color: #1a1a2e;
          font-family: sans-serif; font-size: 13px; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase;
          padding: 13px 28px; border: 1.5px solid rgba(0,0,0,0.25);
          text-decoration: none; transition: all 0.2s ease;
        }
        .btn-secondary:hover { border-color: #1a1a2e; background: #1a1a2e; color: #fff; }

        .feature-card {
          padding: 28px; background: #fff;
          border: 1px solid rgba(0,0,0,0.07);
          transition: all 0.22s ease;
        }
        .feature-card:hover {
          border-color: #c8a84b;
          box-shadow: 0 8px 32px rgba(0,0,0,0.08);
          transform: translateY(-2px);
        }

        .nav-link {
          text-decoration: none; font-family: sans-serif;
          font-size: 12px; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: rgba(0,0,0,0.45); transition: color 0.15s ease;
        }
        .nav-link:hover { color: #000; }
      `}</style>

      {/* ══════════════════ NAV ══════════════════ */}
      <nav
        className="flex items-center justify-between px-8 md:px-16 py-5 sticky top-0 z-50 bg-[#f5f0e8]"
        style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#1a1a2e] flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-[#c8a84b]" />
          </div>
          <div>
            <p className="font-bold text-black text-sm leading-tight">SJC Alumni</p>
            <p className="text-[9px] font-sans font-bold tracking-widest text-black/35 uppercase">Network</p>
          </div>
        </div>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-8">
          {[['About', '#about'], ['Features', '#features'], ['Community', '#community'], ['Contact', '#contact']].map(([label, href]) => (
            <a key={label} href={href} className="nav-link">{label}</a>
          ))}
        </div>

        {/* Auth CTAs */}
        <div className="flex items-center gap-3">
          <Link href="/login" className="btn-secondary" style={{ padding: '10px 20px', fontSize: '12px' }}>
            Sign In
          </Link>
          <Link href="/register" className="btn-primary" style={{ padding: '10px 20px', fontSize: '12px' }}>
            Register
          </Link>
        </div>
      </nav>

      {/* ══════════════════ HERO ══════════════════ */}
      <section className="flex flex-col lg:flex-row" style={{ minHeight: '88vh' }}>

        {/* Image */}
        <div className="hidden lg:block lg:w-[48%] relative overflow-hidden flex-shrink-0">
          <Image
            src="/sjc Alumni img.jpg"
            alt="SJC College"
            fill
            className="object-cover"
            style={{ objectPosition: 'center top' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#f5f0e8]/25" />

          <div className="absolute top-8 left-8">
            <div className="bg-[#c8a84b] text-black text-[10px] font-sans font-black tracking-widest px-3 py-1.5 uppercase">
              SJC Network
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-10">
            <div className="border-l-4 border-[#c8a84b] pl-5 mb-8">
              <p className="text-[#c8a84b] text-[10px] tracking-[0.35em] uppercase font-sans font-bold mb-2">Est. Excellence</p>
              <h2 className="text-white text-3xl font-bold leading-tight">Where Legacy<br />Meets Future</h2>
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

        {/* Hero text */}
        <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-20 py-16 relative">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="absolute left-0 right-0 border-t border-black/[0.04]"
                style={{ top: `${(i + 1) * 8.33}%` }} />
            ))}
          </div>

          <div className="relative max-w-md">
            <div className="a1 flex items-center gap-3 mb-10">
              <div className="w-8 h-px bg-black" />
              <span className="text-[10px] font-sans font-black tracking-[0.4em] text-black/40 uppercase">
                Alumni Network Platform
              </span>
            </div>

            <h1 className="a2 font-bold text-black leading-[0.88] mb-6"
              style={{ fontSize: '4.2rem', letterSpacing: '-0.03em' }}>
              ST.<br />
              JOSEPH'S<br />
              <span className="text-[#c8a84b]">COLLEGE.</span>
            </h1>

            <p className="a3 text-black/55 text-base font-sans leading-relaxed mb-10 max-w-sm">
              The official platform connecting SJC graduates, current students, and the college — built to strengthen bonds, share opportunities, and celebrate achievements.
            </p>

            <div className="a4 flex flex-wrap items-center gap-4 mb-12">
              <Link href="/register" className="btn-primary">
                Register Now
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/login" className="btn-secondary">
                Sign In
              </Link>
            </div>

            <div className="a5 flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#c8a84b] text-[#c8a84b]" />
                ))}
              </div>
              <p className="text-black/40 text-xs font-sans">
                Trusted by <span className="font-bold text-black/60">2,400+</span> alumni across batches
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ FEATURES ══════════════════ */}
      <section id="features" className="bg-white px-8 md:px-16 py-20"
        style={{ borderTop: '1px solid rgba(0,0,0,0.07)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-px bg-black" />
            <span className="text-[10px] font-sans font-black tracking-[0.4em] text-black/35 uppercase">Platform Features</span>
          </div>
          <h2 className="text-4xl font-bold text-black mb-12" style={{ letterSpacing: '-0.025em' }}>
            Everything you need<br />
            <span className="text-[#c8a84b]">to stay connected.</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { Icon: GraduationCap, title: 'Alumni Directory', desc: 'Find and connect with graduates from every batch across industries.', accent: '#c8a84b' },
              { Icon: Briefcase, title: 'Career Opportunities', desc: 'Exclusive job postings and internships shared by SJC alumni.', accent: '#1a1a2e' },
              { Icon: Users, title: 'Mentorship Network', desc: 'Students connect with senior alumni for guidance and growth.', accent: '#2d5a27' },
              { Icon: BookOpen, title: 'Knowledge Hub', desc: 'Resources, events, achievements and announcements in one place.', accent: '#7c3a1a' },
            ].map(({ Icon, title, desc, accent }) => (
              <div key={title} className="feature-card">
                <div className="w-10 h-10 flex items-center justify-center mb-5" style={{ background: accent }}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-black text-base mb-2">{title}</h3>
                <p className="text-black/45 text-sm font-sans leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ ABOUT DARK STRIP ══════════════════ */}
      <section id="about" className="bg-[#1a1a2e] px-8 md:px-16 py-20">
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-14">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-[#c8a84b]" />
              <span className="text-[10px] font-sans font-black tracking-[0.4em] text-[#c8a84b]/60 uppercase">About SJC</span>
            </div>
            <h2 className="text-4xl font-bold text-white leading-tight mb-6" style={{ letterSpacing: '-0.025em' }}>
              A legacy built on<br />
              <span className="text-[#c8a84b]">excellence & service.</span>
            </h2>
            <p className="text-white/50 text-sm font-sans leading-relaxed mb-5 max-w-sm">
              St. Joseph's College, Trichurapalli, has been shaping generations of leaders, professionals, and change-makers. Our alumni network is a testament to that enduring legacy.
            </p>
            <p className="text-white/30 text-sm font-sans leading-relaxed max-w-sm">
              This platform honours those bonds — giving every alumnus, student, and faculty member a space to connect, collaborate, and grow together.
            </p>
          </div>

          <div className="flex-shrink-0 grid grid-cols-2 gap-4 w-full lg:w-auto lg:min-w-[300px]">
            {[['2,400+', 'Alumni Registered'], ['48', 'Graduating Batches'], ['92%', 'Placement Rate'], ['150+', 'Industry Partners']].map(([val, label]) => (
              <div key={label} className="p-6"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <p className="text-[#c8a84b] text-3xl font-bold">{val}</p>
                <p className="text-white/40 text-xs font-sans mt-1 leading-snug">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ JOIN CTA ══════════════════ */}
      <section id="community" className="bg-[#f5f0e8] px-8 md:px-16 py-20"
        style={{ borderTop: '1px solid rgba(0,0,0,0.07)' }}>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-px bg-black" />
              <span className="text-[10px] font-sans font-black tracking-[0.4em] text-black/35 uppercase">Join Today</span>
            </div>
            <h2 className="text-4xl font-bold text-black" style={{ letterSpacing: '-0.025em' }}>
              Be part of the<br />
              <span className="text-[#c8a84b]">SJC legacy.</span>
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center">
            <p className="text-black/50 text-sm font-sans leading-relaxed max-w-xs">
              Already a member? Sign in to your account. New here? Create your alumni or student profile in minutes.
            </p>
            <div className="flex flex-col gap-3 flex-shrink-0">
              <Link href="/register" className="btn-primary">
                Register Now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/login" className="btn-secondary" style={{ justifyContent: 'center' }}>
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ FOOTER ══════════════════ */}
      <footer id="contact" className="bg-[#0f0f1a] px-8 md:px-16 py-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-[#c8a84b] flex items-center justify-center">
              <GraduationCap className="w-3.5 h-3.5 text-black" />
            </div>
            <p className="text-white/50 text-xs font-sans">
              <span className="text-white font-semibold">SJC Alumni Network</span> · St. Joseph's College, Trichurapalli
            </p>
          </div>
          <p className="text-white/25 text-[11px] font-sans tracking-widest uppercase">
            © {new Date().getFullYear()} St. Joseph's College · All Rights Reserved
          </p>
        </div>
      </footer>
    </div>
  );
}