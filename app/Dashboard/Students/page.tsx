'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search, Briefcase, Building, GraduationCap,
  Mail, MapPin, IndianRupee, Users, Bell,
  LogOut, ChevronRight, BookOpen, Wifi,
  X, CheckCheck, Clock, UserCheck
} from 'lucide-react';

/* ─── Static notifications (replace with API later) ─── */
const STATIC_NOTIFICATIONS = [
  {
    id: 1,
    title: 'New Job Posted',
    message: 'Google is hiring Software Engineers — posted by Arun Kumar.',
    time: '2 mins ago',
    read: false,
    Icon: Briefcase,
    accent: '#1a1a2e',
  },
  {
    id: 2,
    title: 'Alumni Connected',
    message: 'Priya Sharma (2018, CSE) joined the network.',
    time: '1 hour ago',
    read: false,
    Icon: UserCheck,
    accent: '#c8a84b',
  },
  {
    id: 3,
    title: 'Upcoming Event',
    message: 'Alumni Meet 2024 — Register before Dec 20.',
    time: '3 hours ago',
    read: true,
    Icon: Clock,
    accent: '#2d5a27',
  },
  {
    id: 4,
    title: 'Application Update',
    message: 'Your application to TCS has been viewed by the recruiter.',
    time: 'Yesterday',
    read: true,
    Icon: CheckCheck,
    accent: '#7c3a1a',
  },
];



/* ─── Dept color map ─── */
const deptColor: Record<string, string> = {
  'Computer Science': '#1a1a2e',
  'Electronics':      '#2d5a27',
  'Mechanical':       '#7c3a1a',
  'Civil':            '#1a3a5f',
};
const getDeptColor = (dept: string) => deptColor[dept] ?? '#c8a84b';

export default function StudentDashboard() {
  const router = useRouter();
  const [search, setSearch]         = useState('');
  const [jobs, setJobs]             = useState<any[]>([]);
  const [alumni, setAlumni]         = useState<any[]>([]);
  const [loading, setLoading]       = useState(false);
  const [loadingAlumni, setLoadingAlumni] = useState(false);
  const [activeTab, setActiveTab]   = useState<'alumni' | 'jobs'>('alumni');
  const [notifOpen, setNotifOpen]   = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [notifications, setNotifications] = useState(STATIC_NOTIFICATIONS);
  const [user, setUser] = useState<any>({});
  const notifRef  = useRef<HTMLDivElement>(null);
  const logoutRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUser(JSON.parse(localStorage.getItem('user') || '{}'));
    }
  }, []);

  /* ── Close dropdowns on outside click ── */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current  && !notifRef.current.contains(e.target as Node))  setNotifOpen(false);
      if (logoutRef.current && !logoutRef.current.contains(e.target as Node)) setShowLogout(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* ── Mark all read ── */
  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  /* ── Mark single read ── */
  const markRead = (id: number) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  /* ── Logout ── */
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    sessionStorage.clear();
    router.push('/login');
  };

  /* ── Fetch Jobs ── */
  const fetchJobs = async () => {
    setLoading(true);
    const res  = await fetch('/api/jobs');
    const data = await res.json();
    setJobs(data);
    setLoading(false);
  };

  /* ── Fetch Alumni ── */
  const fetchAlumni = async () => {
    setLoadingAlumni(true);
    try {
      const res = await fetch('/api/alumni');
      if (res.ok) {
        const data = await res.json();
        console.log('Alumni data:', data);
        setAlumni(data);
      } else {
        console.error('Failed to fetch alumni:', res.status);
        setAlumni([]);
      }
    } catch (error) {
      console.error('Error fetching alumni:', error);
      setAlumni([]);
    }
    setLoadingAlumni(false);
  };

  useEffect(() => { fetchJobs(); fetchAlumni(); }, []);

  /* ── Register ── */
  const handleRegister = async (jobId: string) => {
    const res = await fetch('/api/jobs/register', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jobId,
        student_name:  user.full_name,
        department_no: user.department,
        email:         user.email,
        mobile:        user.mobile || '0000000000',
      }),
    });
    const data = await res.json();
    alert(data.message);
    fetchJobs();
  };

  /* ── Alumni Filter ── */
  const filteredAlumni = alumni.filter(a =>
    a.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    a.department?.toLowerCase().includes(search.toLowerCase()) ||
    a.company?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f5f0e8]" style={{ fontFamily: "'Georgia', serif" }}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade { animation: fadeUp 0.5s ease both; }
        .fade-1 { animation: fadeUp 0.5s 0.05s ease both; }
        .fade-2 { animation: fadeUp 0.5s 0.12s ease both; }
        .fade-3 { animation: fadeUp 0.5s 0.20s ease both; }
        .fade-4 { animation: fadeUp 0.5s 0.28s ease both; }

        /* Horizontal rule texture */
        .texture::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: repeating-linear-gradient(
            to bottom,
            transparent,
            transparent calc(8.33% - 1px),
            rgba(0,0,0,0.03) calc(8.33% - 1px),
            rgba(0,0,0,0.03) 8.33%
          );
          pointer-events: none;
        }

        .alumni-card {
          background: #fff;
          border: 1px solid rgba(0,0,0,0.08);
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }
        .alumni-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: #c8a84b;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.25s ease;
        }
        .alumni-card:hover { border-color: rgba(0,0,0,0.18); box-shadow: 0 8px 32px rgba(0,0,0,0.08); transform: translateY(-2px); }
        .alumni-card:hover::before { transform: scaleX(1); }

        .job-card {
          background: #fff;
          border: 1px solid rgba(0,0,0,0.08);
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }
        .job-card::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 3px;
          background: #1a1a2e;
          transform: scaleY(0);
          transform-origin: bottom;
          transition: transform 0.25s ease;
        }
        .job-card:hover { border-color: rgba(0,0,0,0.18); box-shadow: 0 8px 32px rgba(0,0,0,0.08); transform: translateX(3px); }
        .job-card:hover::before { transform: scaleY(1); }

        .apply-btn {
          width: 100%;
          padding: 12px;
          background: #1a1a2e;
          color: #fff;
          font-family: sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          border-radius: 0;
        }
        .apply-btn:hover {
          background: #c8a84b;
          color: #000;
          box-shadow: 0 6px 20px rgba(200,168,75,0.3);
        }

        .tab-btn {
          padding: 10px 24px;
          font-family: sans-serif;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          border: none;
          cursor: pointer;
          transition: all 0.18s ease;
          background: transparent;
          border-bottom: 2px solid transparent;
          color: rgba(0,0,0,0.35);
        }
        .tab-btn.active {
          color: #1a1a2e;
          border-bottom-color: #c8a84b;
        }
        .tab-btn:hover:not(.active) { color: rgba(0,0,0,0.65); }

        .search-input {
          width: 100%;
          padding: 12px 16px 12px 44px;
          background: #fff;
          border: 1px solid rgba(0,0,0,0.12);
          font-family: sans-serif;
          font-size: 13px;
          color: #1a1a2e;
          outline: none;
          border-radius: 0;
          transition: border-color 0.18s, box-shadow 0.18s;
        }
        .search-input::placeholder { color: rgba(0,0,0,0.3); }
        .search-input:focus { border-color: #1a1a2e; box-shadow: 0 0 0 3px rgba(26,26,46,0.07); }

        .stat-card {
          background: #fff;
          border: 1px solid rgba(0,0,0,0.08);
          padding: 20px 24px;
          transition: all 0.2s ease;
        }
        .stat-card:hover { border-color: #c8a84b; box-shadow: 0 4px 16px rgba(0,0,0,0.06); }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          font-family: sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
          text-decoration: none;
          transition: color 0.15s;
          border-radius: 0;
        }
        .nav-link:hover { color: rgba(255,255,255,0.9); }
        .nav-link.active { color: #c8a84b; }
      `}</style>

      {/* ════════════════════════════════
          TOP NAV
      ════════════════════════════════ */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-4"
        style={{ background: '#1a1a2e', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>

        {/* Left: Brand */}
        <div className="flex items-center gap-3">
          <div className="bg-[#c8a84b] text-black text-[10px] font-sans font-black tracking-widest px-2.5 py-1 uppercase">
            SJC
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">Alumni Network</p>
            <p className="text-white/30 text-[9px] font-sans tracking-widest uppercase">Student Portal</p>
          </div>
        </div>

        {/* Center: Nav links */}
        <div className="hidden md:flex items-center">
          <button className="nav-link active" onClick={() => setActiveTab('alumni')}>
            <Users className="w-3.5 h-3.5" /> Alumni
          </button>
          <button className="nav-link" onClick={() => setActiveTab('jobs')}>
            <Briefcase className="w-3.5 h-3.5" /> Jobs
          </button>
        </div>

        {/* Right: Notification + User + Logout */}
        <div className="flex items-center gap-2">

          {/* ── Notification Bell ── */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => { setNotifOpen(p => !p); setShowLogout(false); }}
              className="relative w-9 h-9 flex items-center justify-center transition-colors duration-150"
              style={{ color: notifOpen ? '#c8a84b' : 'rgba(255,255,255,0.45)' }}
              onMouseEnter={e => { if (!notifOpen) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.85)'; }}
              onMouseLeave={e => { if (!notifOpen) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.45)'; }}
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#c8a84b] flex items-center justify-center">
                  <span className="text-black text-[9px] font-black font-sans leading-none">{unreadCount}</span>
                </div>
              )}
            </button>

            {/* Notification Dropdown */}
            {notifOpen && (
              <div
                className="absolute right-0 top-12 w-80 shadow-2xl z-50"
                style={{
                  background: '#fff',
                  border: '1px solid rgba(0,0,0,0.1)',
                  animation: 'fadeUp 0.2s ease both',
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4"
                  style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
                  <div>
                    <p className="font-bold text-black text-sm">Notifications</p>
                    {unreadCount > 0 && (
                      <p className="text-[10px] font-sans text-black/40 mt-0.5">{unreadCount} unread</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-[10px] font-sans font-bold text-[#c8a84b] hover:text-black transition-colors uppercase tracking-wider"
                      >
                        Mark all read
                      </button>
                    )}
                    <button
                      onClick={() => setNotifOpen(false)}
                      className="text-black/25 hover:text-black transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Notification items */}
                <div className="max-h-72 overflow-y-auto">
                  {notifications.length === 0 && (
                    <div className="py-10 text-center">
                      <Bell className="w-6 h-6 text-black/15 mx-auto mb-2" />
                      <p className="text-black/30 text-xs font-sans">No notifications yet</p>
                    </div>
                  )}
                  {notifications.map((n, i) => (
                    <button
                      key={n.id}
                      onClick={() => markRead(n.id)}
                      className="w-full flex items-start gap-3 px-5 py-4 text-left transition-colors duration-150"
                      style={{
                        background: n.read ? '#fff' : 'rgba(200,168,75,0.05)',
                        borderBottom: i < notifications.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none',
                      }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.02)'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = n.read ? '#fff' : 'rgba(200,168,75,0.05)'}
                    >
                      <div className="w-7 h-7 flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: `${n.accent}15`, border: `1px solid ${n.accent}25` }}>
                        <n.Icon className="w-3.5 h-3.5" style={{ color: n.accent }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <p className="font-bold text-black text-xs" style={{ fontFamily: 'Georgia, serif' }}>
                            {n.title}
                          </p>
                          {!n.read && (
                            <div className="w-1.5 h-1.5 rounded-full bg-[#c8a84b] flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-black/50 text-[11px] font-sans leading-relaxed">{n.message}</p>
                        <p className="text-black/25 text-[10px] font-sans mt-1 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          {n.time}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Footer */}
                <div className="px-5 py-3" style={{ borderTop: '1px solid rgba(0,0,0,0.07)' }}>
                  <p className="text-[10px] font-sans text-black/25 text-center uppercase tracking-wider">
                    SJC Alumni Network · Notifications
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── User + Logout Dropdown ── */}
          <div ref={logoutRef} className="relative">
            <button
              onClick={() => { setShowLogout(p => !p); setNotifOpen(false); }}
              className="flex items-center gap-2 px-3 py-2 transition-colors duration-150"
              style={{
                background: showLogout ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={e => { if (!showLogout) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; }}
            >
              <div className="w-6 h-6 bg-[#c8a84b]/20 flex items-center justify-center flex-shrink-0"
                style={{ border: '1px solid rgba(200,168,75,0.3)' }}>
                <GraduationCap className="w-3 h-3 text-[#c8a84b]" />
              </div>
              <span className="text-white/65 text-[11px] font-sans hidden md:block max-w-[100px] truncate">
                {user.full_name || 'Student'}
              </span>
              <ChevronRight
                className="w-3 h-3 text-white/25 transition-transform duration-150 hidden md:block"
                style={{ transform: showLogout ? 'rotate(90deg)' : 'rotate(0deg)' }}
              />
            </button>

            {/* Logout Dropdown */}
            {showLogout && (
              <div
                className="absolute right-0 top-12 w-52 shadow-2xl z-50"
                style={{
                  background: '#fff',
                  border: '1px solid rgba(0,0,0,0.1)',
                  animation: 'fadeUp 0.2s ease both',
                }}
              >
                {/* User info */}
                <div className="px-4 py-4" style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
                  <div className="w-9 h-9 bg-[#1a1a2e] flex items-center justify-center mb-3">
                    <GraduationCap className="w-4 h-4 text-[#c8a84b]" />
                  </div>
                  <p className="font-bold text-black text-sm leading-tight">{user.full_name || 'Student'}</p>
                  <p className="text-black/40 text-[11px] font-sans mt-0.5 truncate">{user.email || 'student@sjc.edu.in'}</p>
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5"
                    style={{ background: 'rgba(45,90,39,0.08)', border: '1px solid rgba(45,90,39,0.2)' }}>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#2d5a27]" />
                    <p className="text-[9px] font-sans font-bold text-[#2d5a27] uppercase tracking-wider">Student</p>
                  </div>
                </div>

                {/* Logout button */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3.5 transition-all duration-150 group"
                  style={{ background: '#fff' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#fef2f2'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#fff'}
                >
                  <div className="w-7 h-7 flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.15)' }}>
                    <LogOut className="w-3.5 h-3.5 text-red-500" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-red-600 text-xs font-sans">Sign Out</p>
                    <p className="text-black/30 text-[10px] font-sans">Clear session & return to login</p>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ════════════════════════════════
          MAIN CONTENT
      ════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-10 relative texture">

        {/* ── Page Header ── */}
        <div className="fade-1 mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-black" />
            <span className="text-[10px] font-sans font-black tracking-[0.4em] text-black/40 uppercase">
              Student Dashboard · {new Date().getFullYear()}
            </span>
          </div>
          <h1 className="font-bold text-black leading-[0.9] mb-3"
            style={{ fontSize: '3rem', letterSpacing: '-0.03em' }}>
            EXPLORE &<br />
            <span className="text-[#c8a84b]">CONNECT.</span>
          </h1>
          <p className="text-black/45 text-sm font-sans max-w-md leading-relaxed">
            Browse the SJC alumni network, discover mentors in your field, and apply for exclusive opportunities.
          </p>
        </div>

        {/* ── Stats Row ── */}
        <div className="fade-2 grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {[
            { Icon: Users,         val: alumni.length.toString(), label: 'Alumni Listed'    },
            { Icon: Briefcase,     val: jobs.length.toString(),        label: 'Open Positions'  },
            { Icon: BookOpen,      val: '12',                          label: 'Departments'     },
            { Icon: Wifi,          val: '3',                           label: 'Events This Month'},
          ].map(({ Icon, val, label }) => (
            <div key={label} className="stat-card">
              <div className="flex items-start justify-between mb-3">
                <div className="w-8 h-8 flex items-center justify-center"
                  style={{ background: 'rgba(200,168,75,0.1)', border: '1px solid rgba(200,168,75,0.2)' }}>
                  <Icon className="w-4 h-4 text-[#c8a84b]" />
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-black/20" />
              </div>
              <p className="font-bold text-black text-2xl leading-none mb-1">{val}</p>
              <p className="text-black/40 text-[11px] font-sans tracking-wider uppercase">{label}</p>
            </div>
          ))}
        </div>

        {/* ── Tabs ── */}
        <div className="fade-3 mb-8"
          style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
          <div className="flex gap-0">
            <button
              className={`tab-btn ${activeTab === 'alumni' ? 'active' : ''}`}
              onClick={() => setActiveTab('alumni')}
            >
              Alumni Network
            </button>
            <button
              className={`tab-btn ${activeTab === 'jobs' ? 'active' : ''}`}
              onClick={() => setActiveTab('jobs')}
            >
              Available Jobs {jobs.length > 0 && `(${jobs.length})`}
            </button>
          </div>
        </div>

        {/* ════════════════════════════════
            ALUMNI TAB
        ════════════════════════════════ */}
        {activeTab === 'alumni' && (
          <div className="fade-4">

            {/* Search */}
            <div className="relative max-w-md mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30" />
              <input
                type="text"
                placeholder="Search by name, department, or company..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="search-input"
              />
            </div>

            {loadingAlumni && (
              <div className="flex items-center gap-3 py-20 justify-center">
                <div className="w-5 h-5 border-2 border-black/20 border-t-[#c8a84b] rounded-full animate-spin" />
                <p className="text-black/40 text-sm font-sans">Loading alumni...</p>
              </div>
            )}

            {!loadingAlumni && filteredAlumni.length === 0 && (
              <div className="text-center py-20">
                <p className="text-black/30 text-sm font-sans">No alumni match your search.</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAlumni.map(alum => (
                <div key={alum._id} className="alumni-card p-6">

                  {/* Header */}
                  <div className="mb-5 pb-5"
                    style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                    <h3 className="font-bold text-black text-base leading-tight">{alum.full_name}</h3>
                    <p className="text-black/45 text-xs font-sans mt-0.5">{alum.department}</p>
                  </div>

                  {/* Details */}
                  <div className="space-y-3">
                    {[
                      { Icon: GraduationCap, text: `Class of ${alum.graduation_year}`, color: '#c8a84b'  },
                      { Icon: Building,      text: alum.company,                      color: '#1a1a2e'  },
                      { Icon: Briefcase,     text: alum.job_title,                     color: '#2d5a27'  },
                      { Icon: Mail,          text: alum.email,                        color: '#7c3a1a'  },
                    ].map(({ Icon, text, color }) => (
                      <div key={text} className="flex items-center gap-3">
                        <div className="w-6 h-6 flex items-center justify-center flex-shrink-0"
                          style={{ background: `${color}15` }}>
                          <Icon className="w-3 h-3" style={{ color }} />
                        </div>
                        <p className="text-black/65 text-[12px] font-sans truncate">{text}</p>
                      </div>
                    ))}
                  </div>

                  {/* Connect */}
                  <a
                    href={`mailto:${alum.email}`}
                    className="mt-5 flex items-center justify-between px-4 py-3 text-[11px] font-sans font-bold tracking-widest uppercase transition-all duration-200"
                    style={{
                      background: 'rgba(200,168,75,0.08)',
                      border: '1px solid rgba(200,168,75,0.25)',
                      color: '#1a1a2e',
                      textDecoration: 'none',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.background = '#c8a84b';
                      (e.currentTarget as HTMLElement).style.color = '#000';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(200,168,75,0.08)';
                      (e.currentTarget as HTMLElement).style.color = '#1a1a2e';
                    }}
                  >
                    Connect
                    <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════════════════════════════════
            JOBS TAB
        ════════════════════════════════ */}
        {activeTab === 'jobs' && (
          <div className="fade-4">

            {loading && (
              <div className="flex items-center gap-3 py-20 justify-center">
                <div className="w-5 h-5 border-2 border-black/20 border-t-[#c8a84b] rounded-full animate-spin" />
                <p className="text-black/40 text-sm font-sans">Loading opportunities...</p>
              </div>
            )}

            {!loading && jobs.length === 0 && (
              <div className="text-center py-20">
                <Briefcase className="w-8 h-8 text-black/20 mx-auto mb-3" />
                <p className="text-black/35 text-sm font-sans">No positions available right now.</p>
                <p className="text-black/20 text-xs font-sans mt-1">Check back soon for new opportunities.</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobs.map(job => (
                <div key={job._id} className="job-card p-6">

                  {/* Job title + company */}
                  <div className="mb-5 pb-4" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                    <h3 className="font-bold text-black text-xl leading-tight mb-1">{job.role}</h3>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-[#1a1a2e] flex items-center justify-center flex-shrink-0">
                        <Building className="w-2.5 h-2.5 text-white" />
                      </div>
                      <p className="text-black/55 text-sm font-sans">{job.company_name}</p>
                    </div>
                  </div>

                  {/* Job details */}
                  <div className="space-y-3 mb-5">
                    {[
                      { Icon: IndianRupee, text: `₹${job.salary}`,   color: '#2d5a27' },
                      { Icon: MapPin,      text: job.address,         color: '#7c3a1a' },
                    ].map(({ Icon, text, color }) => (
                      <div key={text} className="flex items-center gap-3">
                        <div className="w-6 h-6 flex items-center justify-center flex-shrink-0"
                          style={{ background: `${color}15` }}>
                          <Icon className="w-3 h-3" style={{ color }} />
                        </div>
                        <p className="text-black/60 text-[12px] font-sans">{text}</p>
                      </div>
                    ))}
                  </div>

                  {/* Description */}
                  {job.description && (
                    <p className="text-black/45 text-[12px] font-sans leading-relaxed mb-5 line-clamp-2">
                      {job.description}
                    </p>
                  )}

                  {/* Meta row */}
                  <div className="flex items-center justify-between mb-5 pb-4"
                    style={{ borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '12px' }}>
                    <p className="text-[10px] font-sans text-black/35">
                      Posted by <span className="font-bold text-black/55">{job.postedBy?.full_name}</span>
                    </p>
                    <div className="flex items-center gap-1.5 px-2.5 py-1"
                      style={{ background: 'rgba(45,90,39,0.08)', border: '1px solid rgba(45,90,39,0.2)' }}>
                      <Users className="w-3 h-3 text-[#2d5a27]" />
                      <p className="text-[10px] font-sans font-bold text-[#2d5a27]">
                        {job.registrations?.length ?? 0} Applied
                      </p>
                    </div>
                  </div>

                  {/* Apply button */}
                  <button className="apply-btn" onClick={() => handleRegister(job._id)}>
                    <Briefcase className="w-3.5 h-3.5" />
                    Apply Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 pt-6 flex items-center justify-between"
          style={{ borderTop: '1px solid rgba(0,0,0,0.07)' }}>
          <p className="text-black/25 text-[10px] font-sans tracking-widest uppercase">
            © {new Date().getFullYear()} St. Joseph's College · Alumni Network
          </p>
          <p className="text-black/20 text-[10px] font-sans">
            Student Portal
          </p>
        </div>
      </div>
    </div>
  );
}