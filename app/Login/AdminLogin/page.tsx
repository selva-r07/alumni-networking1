'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import Link from 'next/link';
import { Eye, EyeOff, AlertCircle, ArrowLeft, Shield, Users, GraduationCap, Lock, LayoutDashboard, Settings } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { signInAdmin } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const validateField = (name: string, value: string) => {
    if (name === 'email') {
      if (!value.trim()) return 'Email is required';
      if (!/\S+@\S+\.\S+/.test(value)) return 'Enter a valid email address';
    }
    if (name === 'password' && !value) return 'Password is required';
    return '';
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof typeof formData]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    const { error } = await signInAdmin(formData.email, formData.password);
    if (error) {
      setErrors({ general: error.message || 'Invalid admin credentials' });
      setLoading(false);
    } else {
      router.push('/Dashboard/Admin');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched[name]) setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
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
        .a8 { animation: fadeUp 0.55s 0.60s ease both; }

        .field-wrap { position: relative; }

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
          box-sizing: border-box;
        }
        .field-input::placeholder { color: rgba(0,0,0,0.25); }
        .field-input.focused {
          border-color: #1a1a2e;
          box-shadow: 0 0 0 3px rgba(26,26,46,0.08);
        }
        .field-input.has-error {
          border-color: #dc2626;
          box-shadow: 0 0 0 3px rgba(220,38,38,0.07);
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
          border-radius: 0;
        }
        .submit-btn:hover:not(:disabled) {
          background: #c8a84b;
          color: #000;
          box-shadow: 0 8px 24px rgba(200,168,75,0.3);
          transform: translateY(-1px);
        }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

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
        .other-portal:hover {
          border-color: rgba(0,0,0,0.18);
          box-shadow: 0 4px 16px rgba(0,0,0,0.06);
          transform: translateX(3px);
        }
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
        .checkbox-box.checked { background: #1a1a2e; border-color: #1a1a2e; }

        .error-msg {
          font-family: sans-serif;
          font-size: 11px;
          color: #dc2626;
          margin-top: 5px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
      `}</style>

      {/* ══ LEFT: Dark admin info panel ══ */}
      <div
        className="hidden lg:flex lg:w-[42%] flex-col justify-between flex-shrink-0 relative overflow-hidden"
        style={{ background: '#0f0f1e', minHeight: '100vh' }}
      >
        {/* Dot texture */}
        <div className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '36px 36px' }} />
        {/* Glows */}
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full blur-[110px] pointer-events-none"
          style={{ background: 'rgba(200,168,75,0.1)' }} />
        <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full blur-[90px] pointer-events-none"
          style={{ background: 'rgba(26,26,46,0.8)' }} />
        {/* Subtle blue tint top right */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[100px] pointer-events-none"
          style={{ background: 'rgba(59,130,246,0.06)' }} />

        <div className="relative flex flex-col h-full p-12 justify-between">

          {/* Branding */}
          <div>
            <div className="inline-block bg-[#c8a84b] text-black text-[10px] font-sans font-black tracking-widest px-3 py-1.5 uppercase mb-10">
              SJC Network
            </div>
            <div className="border-l-4 border-[#c8a84b] pl-5 mb-6">
              <p className="text-[#c8a84b] text-[10px] tracking-[0.35em] uppercase font-sans font-bold mb-2">
                Admin Portal
              </p>
              <h2 className="text-white text-3xl font-bold leading-tight">
                Platform<br />Control<br />
                <span className="text-[#c8a84b]">Center.</span>
              </h2>
            </div>
            <p className="text-white/35 text-sm font-sans leading-relaxed max-w-[210px]">
              Restricted access for authorised administrators only. Manage users, content, and platform settings.
            </p>
          </div>

          {/* Admin features */}
          <div className="space-y-5">
            {[
              { Icon: Users,           title: 'User Management',    desc: 'Manage alumni & student accounts' },
              { Icon: LayoutDashboard, title: 'Platform Analytics', desc: 'View engagement & usage data'      },
              { Icon: Settings,        title: 'System Settings',    desc: 'Configure platform preferences'   },
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

          {/* Security notice */}
          <div className="p-5"
            style={{ borderLeft: '3px solid rgba(200,168,75,0.35)', background: 'rgba(200,168,75,0.05)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-3.5 h-3.5 text-[#c8a84b]" />
              <p className="text-[#c8a84b]/70 text-[10px] font-sans font-black tracking-widest uppercase">
                Restricted Access
              </p>
            </div>
            <p className="text-white/35 text-[12px] font-sans leading-relaxed">
              This portal is for authorised administrators only. Unauthorised access attempts are logged and monitored.
            </p>
          </div>
        </div>
      </div>

      {/* ══ RIGHT: Cream editorial form ══ */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-14 lg:px-16 py-12 relative">

        {/* Horizontal rule texture */}
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
              Admin Login · {new Date().getFullYear()}
            </span>
          </div>

          {/* Headline */}
          <h1 className="a3 font-bold text-black leading-[0.88] mb-2"
            style={{ fontSize: '3.2rem', letterSpacing: '-0.03em' }}>
            SIGN IN<br />
            <span className="text-[#1a1a2e]" style={{ WebkitTextStroke: '2px #1a1a2e' }}>ADMIN</span><br />
            PORTAL.
          </h1>

          <p className="a4 text-black/45 text-sm font-sans leading-relaxed mt-4 mb-10 max-w-xs">
            Authorised personnel only. Enter your admin credentials to access the control dashboard.
          </p>

          {/* General error */}
          {errors.general && (
            <div className="a4 mb-6 p-4 flex items-start gap-3 font-sans text-sm"
              style={{ background: '#fef2f2', border: '1px solid rgba(220,38,38,0.2)' }}>
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <span className="text-red-600 text-[13px]">{errors.general}</span>
            </div>
          )}

          {/* ── Form ── */}
          <form onSubmit={handleSubmit} noValidate>

            {/* Email */}
            <div className="a5 mb-5">
              <label className="block text-[10px] font-sans font-black tracking-[0.35em] uppercase text-black/35 mb-2">
                Admin Email
              </label>
              <div className="field-wrap">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onFocus={() => setFocused('email')}
                  onBlurCapture={() => setFocused(null)}
                  placeholder="admin@sjc.edu.in"
                  className={`field-input ${focused === 'email' ? 'focused' : ''} ${touched.email && errors.email ? 'has-error' : ''}`}
                />
              </div>
              {touched.email && errors.email && (
                <p className="error-msg"><AlertCircle className="w-3 h-3" />{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="a6 mb-5">
              <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] font-sans font-black tracking-[0.35em] uppercase text-black/35">
                  Password
                </label>
                <Link href="/forgot-password"
                  className="text-[11px] font-sans font-bold text-black/30 hover:text-[#1a1a2e] transition-colors"
                  style={{ textDecoration: 'none' }}>
                  Forgot password?
                </Link>
              </div>
              <div className="field-wrap">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onFocus={() => setFocused('pwd')}
                  onBlurCapture={() => setFocused(null)}
                  placeholder="Enter admin password"
                  className={`field-input ${focused === 'pwd' ? 'focused' : ''} ${touched.password && errors.password ? 'has-error' : ''}`}
                  style={{ paddingRight: '48px' }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-black/25 hover:text-black/60 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {touched.password && errors.password && (
                <p className="error-msg"><AlertCircle className="w-3 h-3" />{errors.password}</p>
              )}
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
                {loading ? (
                  <><div className="spinner" /> Signing In...</>
                ) : (
                  <><Shield className="w-4 h-4" /> Sign In to Admin Portal</>
                )}
              </button>
            </div>
          </form>

          {/* Security note */}
          <div className="a8 mt-8 flex items-start gap-3 p-4"
            style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.07)' }}>
            <Lock className="w-3.5 h-3.5 text-black/30 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] font-sans text-black/35 leading-relaxed">
              All admin sessions are encrypted and logged. Unauthorised access is strictly prohibited.
            </p>
          </div>

          {/* Other portals */}
          <div className="a8 mt-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[9px] font-sans font-black tracking-[0.45em] text-black/25 uppercase">
                Other Portals
              </span>
              <div className="flex-1 h-px bg-black/[0.07]" />
            </div>
            <div className="flex flex-col gap-2">
              {[
                { href: '/login/alumni',  Icon: GraduationCap, num: '02', label: 'Alumni Portal',  sub: 'Graduate network',    accent: '#c8a84b' },
                { href: '/login/student', Icon: Users,          num: '03', label: 'Student Portal', sub: 'Resources & mentors', accent: '#2d5a27' },
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