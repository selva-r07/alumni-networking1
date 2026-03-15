'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Users, Eye, EyeOff, AlertCircle, ArrowLeft,
  GraduationCap, Shield, Briefcase, Building, ArrowRight
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: '', password: '', confirmPassword: '',
    full_name: '', role: 'student',
    graduation_year: '', department: '',
    company: '', job_title: '',
  });

  const [errors, setErrors]                   = useState<Record<string, string>>({});
  const [touched, setTouched]                 = useState<Record<string, boolean>>({});
  const [loading, setLoading]                 = useState(false);
  const [showPassword, setShowPassword]       = useState(false);
  const [showConfirm, setShowConfirm]         = useState(false);
  const [focused, setFocused]                 = useState<string | null>(null);
  const [step, setStep]                       = useState<1 | 2>(1);

  /* ── Validation ── */
  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'full_name':       if (!value.trim()) return 'Full name is required'; break;
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!/\S+@\S+\.\S+/.test(value)) return 'Enter a valid email address';
        break;
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Minimum 8 characters required';
        break;
      case 'confirmPassword':
        if (!value) return 'Please confirm your password';
        if (value !== formData.password) return 'Passwords do not match';
        break;
      case 'graduation_year': if (!value) return 'Graduation year is required'; break;
      case 'department':      if (!value.trim()) return 'Department is required'; break;
      case 'company':         if (formData.role === 'alumni' && !value.trim()) return 'Company is required'; break;
      case 'job_title':       if (formData.role === 'alumni' && !value.trim()) return 'Job title is required'; break;
    }
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

  /* ── Submit ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setErrors({});

    const payload = {
      full_name:       formData.full_name,
      email:           formData.email,
      password:        formData.password,
      role:            formData.role,
      department:      formData.department,
      graduation_year: Number(formData.graduation_year),
      ...(formData.role === 'alumni' && {
        company:   formData.company,
        job_title: formData.job_title,
      }),
    };

    try {
      const response = await fetch('/api/auth/register', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Registration failed');
      router.push('/login?status=success');
    } catch (err: any) {
      setErrors({ general: err.message });
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched[name]) setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    setFocused(null);
  };

  const isAlumni = formData.role === 'alumni';

  return (
    <div className="min-h-screen bg-[#f5f0e8] flex" style={{ fontFamily: "'Georgia', serif" }}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .a1 { animation: fadeUp 0.5s 0.05s ease both; }
        .a2 { animation: fadeUp 0.5s 0.12s ease both; }
        .a3 { animation: fadeUp 0.5s 0.20s ease both; }
        .a4 { animation: fadeUp 0.5s 0.28s ease both; }
        .a5 { animation: fadeUp 0.5s 0.36s ease both; }

        .field-input {
          width: 100%; padding: 12px 14px;
          background: #fff; border: 1px solid rgba(0,0,0,0.12);
          font-family: sans-serif; font-size: 13px; color: #1a1a2e;
          outline: none; border-radius: 0; box-sizing: border-box;
          transition: border-color 0.18s ease, box-shadow 0.18s ease;
          -webkit-appearance: none;
        }
        .field-input::placeholder { color: rgba(0,0,0,0.25); }
        .field-input:focus { border-color: #c8a84b; box-shadow: 0 0 0 3px rgba(200,168,75,0.1); }
        .field-input.has-error { border-color: #dc2626; box-shadow: 0 0 0 3px rgba(220,38,38,0.07); }

        .field-select {
          width: 100%; padding: 12px 14px;
          background: #fff; border: 1px solid rgba(0,0,0,0.12);
          font-family: sans-serif; font-size: 13px; color: #1a1a2e;
          outline: none; border-radius: 0;
          transition: border-color 0.18s, box-shadow 0.18s;
          -webkit-appearance: none; cursor: pointer;
        }
        .field-select:focus { border-color: #c8a84b; box-shadow: 0 0 0 3px rgba(200,168,75,0.1); }

        .submit-btn {
          width: 100%; padding: 15px;
          background: #1a1a2e; color: #fff;
          font-family: sans-serif; font-size: 13px; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          border: none; cursor: pointer; border-radius: 0;
          transition: all 0.2s ease;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .submit-btn:hover:not(:disabled) {
          background: #c8a84b; color: #000;
          box-shadow: 0 8px 24px rgba(200,168,75,0.3);
          transform: translateY(-1px);
        }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .role-card {
          flex: 1; padding: 16px;
          background: #fff; border: 1.5px solid rgba(0,0,0,0.1);
          cursor: pointer; transition: all 0.18s ease;
          display: flex; flex-direction: column; align-items: center; gap: 8px;
          text-align: center;
        }
        .role-card:hover { border-color: rgba(200,168,75,0.5); }
        .role-card.selected { border-color: #c8a84b; background: rgba(200,168,75,0.05); }

        .section-divider {
          display: flex; align-items: center; gap: 12px;
          margin: 24px 0 20px;
        }
        .section-divider::before, .section-divider::after {
          content: ''; flex: 1; height: 1px; background: rgba(0,0,0,0.08);
        }

        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff; border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .slide-in { animation: slideIn 0.3s ease both; }

        .error-msg {
          font-family: sans-serif; font-size: 11px; color: #dc2626;
          margin-top: 4px; display: flex; align-items: center; gap: 3px;
        }
      `}</style>

      {/* ══ LEFT: Dark info panel ══ */}
      <div
        className="hidden lg:flex lg:w-[40%] flex-col justify-between flex-shrink-0 relative overflow-hidden"
        style={{ background: '#1a1a2e', minHeight: '100vh' }}
      >
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '36px 36px' }} />
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full blur-[110px] pointer-events-none"
          style={{ background: 'rgba(200,168,75,0.1)' }} />
        <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full blur-[80px] pointer-events-none"
          style={{ background: 'rgba(200,168,75,0.06)' }} />

        <div className="relative flex flex-col h-full p-12 justify-between">

          {/* Brand */}
          <div>
            <div className="inline-block bg-[#c8a84b] text-black text-[10px] font-sans font-black tracking-widest px-3 py-1.5 uppercase mb-10">
              SJC Network
            </div>
            <div className="border-l-4 border-[#c8a84b] pl-5 mb-6">
              <p className="text-[#c8a84b] text-[10px] tracking-[0.35em] uppercase font-sans font-bold mb-2">
                Join the Network
              </p>
              <h2 className="text-white text-3xl font-bold leading-tight">
                Create Your<br />
                <span className="text-[#c8a84b]">SJC Profile.</span>
              </h2>
            </div>
            <p className="text-white/35 text-sm font-sans leading-relaxed max-w-[210px]">
              Register as a student or alumni to connect with the SJC community, explore opportunities, and build your network.
            </p>
          </div>

          {/* Feature list */}
          <div className="space-y-5">
            {[
              { Icon: GraduationCap, title: 'Alumni Directory',     desc: 'Connect with SJC graduates'       },
              { Icon: Briefcase,     title: 'Job Opportunities',    desc: 'Exclusive alumni-posted roles'    },
              { Icon: Users,         title: 'Mentorship Network',   desc: 'Get guidance from seniors'        },
              { Icon: Building,      title: 'Campus Community',     desc: 'Events, clubs & announcements'   },
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

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[['2,400+', 'Alumni'], ['48', 'Batches'], ['92%', 'Placed']].map(([val, label]) => (
              <div key={label} className="p-4 text-center"
                style={{ background: 'rgba(200,168,75,0.07)', border: '1px solid rgba(200,168,75,0.15)' }}>
                <p className="text-[#c8a84b] text-xl font-bold">{val}</p>
                <p className="text-white/30 text-[10px] font-sans mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ RIGHT: Cream editorial form ══ */}
      <div className="flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-14 py-10 relative overflow-y-auto">

        {/* Horizontal rule texture */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="absolute left-0 right-0 border-t border-black/[0.04]"
              style={{ top: `${(i + 1) * 8.33}%` }} />
          ))}
        </div>

        <div className="relative max-w-lg w-full mx-auto">

          {/* Back */}
          <div className="a1 mb-8">
            <Link href="/login"
              className="inline-flex items-center gap-2 text-[11px] font-sans font-bold tracking-widest uppercase text-black/30 hover:text-black transition-colors"
              style={{ textDecoration: 'none' }}>
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Sign In
            </Link>
          </div>

          {/* Issue tag */}
          <div className="a2 flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-black" />
            <span className="text-[10px] font-sans font-black tracking-[0.4em] text-black/40 uppercase">
              Registration · {new Date().getFullYear()}
            </span>
          </div>

          {/* Headline */}
          <h1 className="a3 font-bold text-black leading-[0.88] mb-2"
            style={{ fontSize: '2.8rem', letterSpacing: '-0.03em' }}>
            CREATE<br />
            YOUR<br />
            <span className="text-[#c8a84b]">ACCOUNT.</span>
          </h1>

          <p className="a4 text-black/45 text-sm font-sans leading-relaxed mt-4 mb-8 max-w-xs">
            Join the SJC alumni network as a student or graduate. It only takes a minute.
          </p>

          {/* General error */}
          {errors.general && (
            <div className="a4 mb-6 p-4 flex items-start gap-3"
              style={{ background: '#fef2f2', border: '1px solid rgba(220,38,38,0.2)', borderLeft: '3px solid #dc2626' }}>
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[12px] font-sans font-bold text-red-600 mb-0.5">Registration failed</p>
                <p className="text-[11px] font-sans text-red-500">{errors.general}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>

            {/* ── ROLE SELECTOR ── */}
            <div className="a4 mb-6">
              <label className="block text-[10px] font-sans font-black tracking-[0.35em] uppercase text-black/35 mb-3">
                I am registering as
              </label>
              <div className="flex gap-3">
                {[
                  { val: 'student', Icon: GraduationCap, label: 'Student',  sub: 'Currently enrolled' },
                  { val: 'alumni',  Icon: Briefcase,     label: 'Alumni',   sub: 'SJC graduate'       },
                ].map(({ val, Icon, label, sub }) => (
                  <div
                    key={val}
                    className={`role-card ${formData.role === val ? 'selected' : ''}`}
                    onClick={() => setFormData(p => ({ ...p, role: val }))}
                  >
                    <div className="w-9 h-9 flex items-center justify-center"
                      style={{
                        background: formData.role === val ? 'rgba(200,168,75,0.12)' : 'rgba(0,0,0,0.04)',
                        border: `1px solid ${formData.role === val ? 'rgba(200,168,75,0.35)' : 'rgba(0,0,0,0.1)'}`,
                      }}>
                      <Icon className="w-4 h-4" style={{ color: formData.role === val ? '#c8a84b' : 'rgba(0,0,0,0.35)' }} />
                    </div>
                    <p className="font-bold text-black text-sm" style={{ fontFamily: 'Georgia, serif' }}>{label}</p>
                    <p className="text-black/35 text-[10px] font-sans">{sub}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── SECTION 1: Basic Details ── */}
            <div className="section-divider">
              <span className="text-[9px] font-sans font-black tracking-[0.45em] text-black/30 uppercase">
                Basic Details
              </span>
            </div>

            <div className="a5 grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Full Name */}
              <div>
                <label className="block text-[10px] font-sans font-black tracking-[0.35em] uppercase text-black/35 mb-1.5">
                  Full Name
                </label>
                <input name="full_name" type="text"
                  value={formData.full_name} onChange={handleChange}
                  onBlur={handleBlur} onFocus={() => setFocused('full_name')}
                  placeholder="Your full name"
                  className={`field-input ${errors.full_name && touched.full_name ? 'has-error' : ''}`}
                />
                {errors.full_name && touched.full_name && (
                  <p className="error-msg"><AlertCircle className="w-3 h-3" />{errors.full_name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-[10px] font-sans font-black tracking-[0.35em] uppercase text-black/35 mb-1.5">
                  Email Address
                </label>
                <input name="email" type="email"
                  value={formData.email} onChange={handleChange}
                  onBlur={handleBlur} onFocus={() => setFocused('email')}
                  placeholder="you@domain.com"
                  className={`field-input ${errors.email && touched.email ? 'has-error' : ''}`}
                />
                {errors.email && touched.email && (
                  <p className="error-msg"><AlertCircle className="w-3 h-3" />{errors.email}</p>
                )}
              </div>
            </div>

            {/* ── SECTION 2: Academic ── */}
            <div className="section-divider">
              <span className="text-[9px] font-sans font-black tracking-[0.45em] text-black/30 uppercase">
                Academic Background
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Department */}
              <div>
                <label className="block text-[10px] font-sans font-black tracking-[0.35em] uppercase text-black/35 mb-1.5">
                  Department
                </label>
                <input name="department" type="text"
                  value={formData.department} onChange={handleChange}
                  onBlur={handleBlur} onFocus={() => setFocused('department')}
                  placeholder="e.g. Computer Science"
                  className={`field-input ${errors.department && touched.department ? 'has-error' : ''}`}
                />
                {errors.department && touched.department && (
                  <p className="error-msg"><AlertCircle className="w-3 h-3" />{errors.department}</p>
                )}
              </div>

              {/* Graduation Year */}
              <div>
                <label className="block text-[10px] font-sans font-black tracking-[0.35em] uppercase text-black/35 mb-1.5">
                  Graduation Year
                </label>
                <input name="graduation_year" type="number"
                  value={formData.graduation_year} onChange={handleChange}
                  onBlur={handleBlur} onFocus={() => setFocused('graduation_year')}
                  placeholder="e.g. 2024"
                  className={`field-input ${errors.graduation_year && touched.graduation_year ? 'has-error' : ''}`}
                />
                {errors.graduation_year && touched.graduation_year && (
                  <p className="error-msg"><AlertCircle className="w-3 h-3" />{errors.graduation_year}</p>
                )}
              </div>
            </div>

            {/* ── SECTION 3: Professional (Alumni only) ── */}
            {isAlumni && (
              <div className="slide-in">
                <div className="section-divider">
                  <span className="text-[9px] font-sans font-black tracking-[0.45em] text-black/30 uppercase">
                    Professional Info
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-[10px] font-sans font-black tracking-[0.35em] uppercase text-black/35 mb-1.5">
                      Company
                    </label>
                    <input name="company" type="text"
                      value={formData.company} onChange={handleChange}
                      onBlur={handleBlur} onFocus={() => setFocused('company')}
                      placeholder="e.g. Google India"
                      className={`field-input ${errors.company && touched.company ? 'has-error' : ''}`}
                    />
                    {errors.company && touched.company && (
                      <p className="error-msg"><AlertCircle className="w-3 h-3" />{errors.company}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[10px] font-sans font-black tracking-[0.35em] uppercase text-black/35 mb-1.5">
                      Job Title
                    </label>
                    <input name="job_title" type="text"
                      value={formData.job_title} onChange={handleChange}
                      onBlur={handleBlur} onFocus={() => setFocused('job_title')}
                      placeholder="e.g. Software Engineer"
                      className={`field-input ${errors.job_title && touched.job_title ? 'has-error' : ''}`}
                    />
                    {errors.job_title && touched.job_title && (
                      <p className="error-msg"><AlertCircle className="w-3 h-3" />{errors.job_title}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ── SECTION 4: Security ── */}
            <div className="section-divider">
              <span className="text-[9px] font-sans font-black tracking-[0.45em] text-black/30 uppercase">
                Security
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {/* Password */}
              <div>
                <label className="block text-[10px] font-sans font-black tracking-[0.35em] uppercase text-black/35 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input name="password" type={showPassword ? 'text' : 'password'}
                    value={formData.password} onChange={handleChange}
                    onBlur={handleBlur} onFocus={() => setFocused('password')}
                    placeholder="Min. 8 characters"
                    className={`field-input ${errors.password && touched.password ? 'has-error' : ''}`}
                    style={{ paddingRight: '44px' }}
                  />
                  {/* <button type="button" onClick={() => setShowPassword(p => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-black/25 hover:text-black/60 transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button> */}
                </div>
                {errors.password && touched.password && (
                  <p className="error-msg"><AlertCircle className="w-3 h-3" />{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-[10px] font-sans font-black tracking-[0.35em] uppercase text-black/35 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <input name="confirmPassword" type={showConfirm ? 'text' : 'password'}
                    value={formData.confirmPassword} onChange={handleChange}
                    onBlur={handleBlur} onFocus={() => setFocused('confirmPassword')}
                    placeholder="Repeat password"
                    className={`field-input ${errors.confirmPassword && touched.confirmPassword ? 'has-error' : ''}`}
                    style={{ paddingRight: '44px' }}
                  />
                  {/* <button type="button" onClick={() => setShowConfirm(p => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-black/25 hover:text-black/60 transition-colors">
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button> */}
                </div>
                {errors.confirmPassword && touched.confirmPassword && (
                  <p className="error-msg"><AlertCircle className="w-3 h-3" />{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* ── Submit ── */}
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading
                ? <><div className="spinner" /> Creating Account...</>
                : <><Users className="w-4 h-4" /> Create Account <ArrowRight className="w-4 h-4" /></>
              }
            </button>
          </form>

          {/* Sign in nudge */}
          <div className="mt-8 flex items-center gap-3">
            <div className="flex-1 h-px bg-black/[0.07]" />
            <p className="text-black/35 text-[12px] font-sans">
              Already have an account?{' '}
              <Link href="/login"
                className="font-bold text-black/60 hover:text-[#c8a84b] transition-colors"
                style={{ textDecoration: 'none' }}>
                Sign In
              </Link>
            </p>
            <div className="flex-1 h-px bg-black/[0.07]" />
          </div>

          {/* Footer */}
          <p className="text-black/22 text-[10px] font-sans tracking-widest mt-8 uppercase">
            © {new Date().getFullYear()} St. Joseph's College · All Rights Reserved
          </p>
        </div>
      </div>
    </div>
  );
}