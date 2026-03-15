'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Briefcase, PlusCircle, MapPin, IndianRupee, Bell,
  GraduationCap, Users, Pencil, Trash2, X, Clock,
  LogOut, ChevronDown, AlertCircle, Loader2, FileText,
  TrendingUp, Globe,
} from 'lucide-react';

/* ══════════════════════════════════════════
   TYPES
══════════════════════════════════════════ */
type Job = {
  _id: string;
  role: string;
  company_name: string;
  salary: string;
  description: string;
  address: string;
  createdAt?: string;
  postedBy?: string | { _id: string; full_name?: string };
};

type FormFields = {
  role: string;
  company_name: string;
  salary: string;
  description: string;
  address: string;
};

const EMPTY: FormFields = { role: '', company_name: '', salary: '', description: '', address: '' };

const NOTIFS = [
  { id: 1, title: 'New Application',    msg: 'A student applied to your latest role.',       time: '5m ago',  read: false, color: '#1a1a2e' },
  { id: 2, title: 'Profile Viewed',     msg: '3 students viewed your alumni profile today.',  time: '2h ago',  read: false, color: '#c8a84b' },
  { id: 3, title: 'Mentorship Request', msg: 'Rahul Sharma (2023, CSE) sent a request.',     time: '1d ago',  read: true,  color: '#2d5a27' },
  { id: 4, title: 'Job Approved',       msg: 'Your posting is now live on the network.',     time: '2d ago',  read: true,  color: '#7c3a1a' },
];

/* ══════════════════════════════════════════
   GET USER ID
   AuthContext saves: localStorage.setItem("userId", data.user._id)
   So we read exactly that key. Simple and direct.
══════════════════════════════════════════ */
function getUserId(): string | null {
  if (typeof window === 'undefined') return null;
  const id = localStorage.getItem('userId');
  if (id && id !== 'null' && id !== 'undefined' && id.trim() !== '') return id.trim();
  return null;
}


/* ══════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════ */
export default function AlumniDashboard() {
  const router = useRouter();

  // User ID comes from localStorage key "userId" set by signInAlumni in AuthContext

  // ── State ──
  const [jobs, setJobs]               = useState<Job[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [resolvedUserId, setResolvedUserId] = useState<string | null>(null);

  // ── Live stats from DB ──
  const [totalApplications, setTotalApplications] = useState<number | null>(null);
  const [totalProfileViews, setTotalProfileViews] = useState<number | null>(null);

  const [showModal, setShowModal]     = useState(false);
  const [editingJob, setEditingJob]   = useState<Job | null>(null);
  const [form, setForm]               = useState<FormFields>(EMPTY);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting]   = useState(false);
  const [submitErr, setSubmitErr]     = useState('');

  const [deleteId, setDeleteId]       = useState<string | null>(null);
  const [deleteErr, setDeleteErr]     = useState('');
  const [deleting, setDeleting]       = useState(false);

  const [notifOpen, setNotifOpen]     = useState(false);
  const [menuOpen, setMenuOpen]       = useState(false);
  const [notifs, setNotifs]           = useState(NOTIFS);

  const notifRef  = useRef<HTMLDivElement>(null);
  const menuRef   = useRef<HTMLDivElement>(null);
  const unread    = notifs.filter(n => !n.read).length;

  // ── Resolve userId on mount ──
  // AuthContext saves exactly: localStorage.setItem("userId", data.user._id)
  useEffect(() => {
    setResolvedUserId(getUserId());
  }, []);

  // ── Fetch real stats once userId is known ──
  useEffect(() => {
    if (!resolvedUserId) return;
    fetch(`/api/alumni/${resolvedUserId}/stats`)
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d) {
          setTotalApplications(d.totalApplications);
          setTotalProfileViews(d.totalProfileViews);
        }
      })
      .catch(() => {});
  }, [resolvedUserId]);

  // ── Outside click ──
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (notifRef.current  && !notifRef.current.contains(e.target as Node))  setNotifOpen(false);
      if (menuRef.current   && !menuRef.current.contains(e.target as Node))   setMenuOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  // ── Load jobs ──
  const loadJobs = useCallback(async () => {
    setLoadingJobs(true);
    try {
      const res = await fetch('/api/jobs', { cache: 'no-store' });
      if (!res.ok) throw new Error();
      setJobs(await res.json());
    } catch { setJobs([]); }
    finally { setLoadingJobs(false); }
  }, []);

  useEffect(() => { loadJobs(); }, [loadJobs]);

  // ── Refresh live stats ──
  const refreshStats = useCallback(() => {
    const uid = resolvedUserId || getUserId();
    if (!uid) return;
    fetch(`/api/alumni/${uid}/stats`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) { setTotalApplications(d.totalApplications); setTotalProfileViews(d.totalProfileViews); } })
      .catch(() => {});
  }, [resolvedUserId]);

  // ── Modal helpers ──
  const openCreate = () => { setEditingJob(null); setForm(EMPTY); setFieldErrors({}); setSubmitErr(''); setShowModal(true); };
  const openEdit   = (j: Job) => { setEditingJob(j); setForm({ role: j.role, company_name: j.company_name, salary: j.salary, description: j.description, address: j.address }); setFieldErrors({}); setSubmitErr(''); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditingJob(null); setForm(EMPTY); setFieldErrors({}); setSubmitErr(''); };

  // ── Validate ──
  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.role.trim())         e.role         = 'Job title is required';
    if (!form.company_name.trim()) e.company_name = 'Company name is required';
    if (!form.salary.trim())       e.salary       = 'Salary is required';
    if (!form.description.trim())  e.description  = 'Description is required';
    if (!form.address.trim())      e.address      = 'Location is required';
    setFieldErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Submit ──
  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitErr(''); setSubmitting(true);

    try {
      // Read directly from localStorage using the exact key AuthContext saves
      const uid = resolvedUserId || getUserId();

      if (!uid && !editingJob) {
        setSubmitErr('Session expired — please sign out and sign in again.');
        return;
      }

      const payload: Record<string, string> = { ...form };
      if (!editingJob && uid) payload.postedBy = uid;

      const res = await fetch(
        editingJob ? `/api/jobs/${editingJob._id}` : '/api/jobs',
        { method: editingJob ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }
      );

      let data: any = {};
      try { data = await res.json(); } catch {}

      if (!res.ok) {
        setSubmitErr(data?.error || data?.message || `Server error ${res.status}`);
        return;
      }

      await loadJobs();
      refreshStats();
      closeModal();
    } catch (err: any) {
      setSubmitErr(err?.message || 'Network error.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Delete ──
  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true); setDeleteErr('');
    try {
      const res = await fetch(`/api/jobs/${deleteId}`, { method: 'DELETE' });
      let data: any = {};
      try { data = await res.json(); } catch {}
      if (!res.ok) { setDeleteErr(data?.error || 'Delete failed.'); return; }
      await loadJobs();
      refreshStats();
      setDeleteId(null);
    } catch (err: any) {
      setDeleteErr(err?.message || 'Network error.');
    } finally { setDeleting(false); }
  };

  const handleLogout = () => {
    localStorage.clear(); sessionStorage.clear(); router.push('/login');
  };

  // ── Display info — read from localStorage user object saved by signInAlumni ──
  const storedUser  = typeof window !== 'undefined' ? (() => { try { return JSON.parse(localStorage.getItem('user') || '{}'); } catch { return {}; } })() : {};
  const displayName = storedUser?.full_name || storedUser?.name || storedUser?.email || 'Alumni';
  const initial     = displayName[0]?.toUpperCase() ?? 'A';

  /* ════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════ */
  return (
    <div style={{ minHeight: '100vh', background: '#f5f0e8', fontFamily: "'Georgia', serif" }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes spin   { to{transform:rotate(360deg)} }
        .a1{animation:fadeUp .45s .05s ease both}
        .a2{animation:fadeUp .45s .13s ease both}
        .a3{animation:fadeUp .45s .20s ease both}
        .a4{animation:fadeUp .45s .27s ease both}
        .spin{animation:spin .7s linear infinite}

        /* Horizontal rule texture */
        .pg{background-image:repeating-linear-gradient(180deg,transparent,transparent calc(8.33% - 1px),rgba(0,0,0,.032) calc(8.33% - 1px),rgba(0,0,0,.032) 8.33%)}

        /* Job card gold left-bar reveal */
        .jc{background:#fff;border:1px solid rgba(0,0,0,.08);position:relative;overflow:hidden;transition:box-shadow .2s,transform .2s}
        .jc::before{content:'';position:absolute;top:0;left:0;width:3px;height:0;background:#c8a84b;transition:height .25s}
        .jc:hover{box-shadow:0 10px 36px rgba(0,0,0,.11);transform:translateY(-2px)}
        .jc:hover::before{height:100%}

        /* Buttons */
        .bp{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:11px 22px;background:#1a1a2e;color:#fff;border:none;cursor:pointer;font-family:sans-serif;font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;transition:all .2s}
        .bp:hover:not(:disabled){background:#c8a84b;color:#000;box-shadow:0 6px 20px rgba(200,168,75,.3);transform:translateY(-1px)}
        .bp:disabled{opacity:.6;cursor:not-allowed}
        .bg{display:inline-flex;align-items:center;justify-content:center;gap:5px;padding:8px 14px;background:transparent;border:1px solid rgba(0,0,0,.12);color:rgba(0,0,0,.45);cursor:pointer;font-family:sans-serif;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;transition:all .18s}
        .bg:hover{border-color:rgba(0,0,0,.3);color:#000}

        /* Form fields */
        .ff{width:100%;padding:11px 13px;background:#fff;border:1px solid rgba(0,0,0,.12);font-family:sans-serif;font-size:13px;color:#1a1a2e;outline:none;box-sizing:border-box;resize:vertical;transition:border-color .18s,box-shadow .18s}
        .ff::placeholder{color:rgba(0,0,0,.25)}
        .ff:focus{border-color:#c8a84b;box-shadow:0 0 0 3px rgba(200,168,75,.1)}
        .ff.fe{border-color:#dc2626;box-shadow:0 0 0 3px rgba(220,38,38,.07)}

        /* Dropdown */
        .dd{position:absolute;top:calc(100% + 8px);right:0;background:#fff;border:1px solid rgba(0,0,0,.1);box-shadow:0 16px 48px rgba(0,0,0,.14);z-index:50;animation:fadeIn .15s ease both}
        .nb{position:absolute;top:-3px;right:-3px;width:16px;height:16px;border-radius:50%;background:#dc2626;border:2px solid #f5f0e8;font-family:sans-serif;font-size:9px;font-weight:800;color:#fff;display:flex;align-items:center;justify-content:center}

        /* Banners */
        .eb{display:flex;align-items:flex-start;gap:10px;padding:14px;background:#fef2f2;border:1px solid rgba(220,38,38,.2);border-left:3px solid #dc2626}
        .wb{display:flex;align-items:flex-start;gap:10px;padding:14px;background:#fef9ec;border:1px solid rgba(200,168,75,.3);border-left:3px solid #c8a84b}
      `}</style>

      {/* ═══ STICKY NAV ═══ */}
      <nav style={{ background: '#1a1a2e', borderBottom: '1px solid rgba(255,255,255,.06)', height: 60, position: 'sticky', top: 0, zIndex: 40, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px' }}>

        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 28, height: 28, background: '#c8a84b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <GraduationCap style={{ width: 15, height: 15, color: '#000' }} />
          </div>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>SJC Alumni</span>
          <span style={{ color: 'rgba(255,255,255,.12)', margin: '0 6px' }}>|</span>
          <span style={{ color: 'rgba(255,255,255,.28)', fontFamily: 'sans-serif', fontSize: 10, fontWeight: 700, letterSpacing: '.35em', textTransform: 'uppercase' }}>Dashboard</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

          {/* Bell */}
          <div style={{ position: 'relative' }} ref={notifRef}>
            <button onClick={() => setNotifOpen(p => !p)}
              style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', background: notifOpen ? 'rgba(200,168,75,.15)' : 'rgba(255,255,255,.07)', border: 'none', cursor: 'pointer', position: 'relative' }}>
              <Bell style={{ width: 15, height: 15, color: 'rgba(255,255,255,.55)' }} />
              {unread > 0 && <span className="nb">{unread}</span>}
            </button>
            {notifOpen && (
              <div className="dd" style={{ width: 310 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid rgba(0,0,0,.07)' }}>
                  <span style={{ fontFamily: 'sans-serif', fontSize: 10, fontWeight: 900, letterSpacing: '.4em', textTransform: 'uppercase', color: 'rgba(0,0,0,.32)' }}>Notifications</span>
                  <button onClick={() => setNotifs(p => p.map(n => ({ ...n, read: true })))}
                    style={{ fontFamily: 'sans-serif', fontSize: 10, fontWeight: 700, color: '#c8a84b', background: 'none', border: 'none', cursor: 'pointer' }}>Mark all read</button>
                </div>
                {notifs.map(n => (
                  <div key={n.id} onClick={() => setNotifs(p => p.map(x => x.id === n.id ? { ...x, read: true } : x))}
                    style={{ display: 'flex', gap: 12, padding: '12px 16px', borderBottom: '1px solid rgba(0,0,0,.05)', cursor: 'pointer' }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', marginTop: 5, flexShrink: 0, background: n.read ? 'transparent' : n.color, border: n.read ? '1px solid rgba(0,0,0,.15)' : 'none', display: 'inline-block' }} />
                    <div>
                      <p style={{ fontFamily: 'Georgia,serif', fontSize: 12, fontWeight: 600, color: 'rgba(0,0,0,.75)', margin: '0 0 3px' }}>{n.title}</p>
                      <p style={{ fontFamily: 'sans-serif', fontSize: 11, color: 'rgba(0,0,0,.4)', lineHeight: 1.5, margin: 0 }}>{n.msg}</p>
                      <p style={{ fontFamily: 'sans-serif', fontSize: 10, color: 'rgba(0,0,0,.25)', margin: '4px 0 0' }}>{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User menu */}
          <div style={{ position: 'relative' }} ref={menuRef}>
            <button onClick={() => setMenuOpen(p => !p)}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', height: 36, background: menuOpen ? 'rgba(200,168,75,.15)' : 'rgba(255,255,255,.07)', border: 'none', cursor: 'pointer' }}>
              <div style={{ width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(200,168,75,.25)', border: '1px solid rgba(200,168,75,.4)' }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: '#c8a84b', fontFamily: 'sans-serif' }}>{initial}</span>
              </div>
              <span style={{ fontFamily: 'sans-serif', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.65)', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayName}</span>
              <ChevronDown style={{ width: 12, height: 12, color: 'rgba(255,255,255,.35)' }} />
            </button>
            {menuOpen && (
              <div className="dd" style={{ minWidth: 220 }}>
                <div style={{ padding: 16, borderBottom: '1px solid rgba(0,0,0,.07)' }}>
                  <div style={{ display: 'inline-block', padding: '2px 8px', background: 'rgba(200,168,75,.12)', border: '1px solid rgba(200,168,75,.25)', fontFamily: 'sans-serif', fontSize: 9, fontWeight: 900, letterSpacing: '.4em', textTransform: 'uppercase', color: '#c8a84b', marginBottom: 8 }}>Alumni</div>
                  <p style={{ fontFamily: 'Georgia,serif', fontSize: 13, fontWeight: 700, color: '#000', margin: 0 }}>{displayName}</p>
                  {resolvedUserId && <p style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(0,0,0,.25)', margin: '6px 0 0', wordBreak: 'break-all' }}>ID: {resolvedUserId}</p>}
                </div>
                <button onClick={handleLogout}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#fef2f2'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'none'}>
                  <LogOut style={{ width: 14, height: 14, color: 'rgba(0,0,0,.3)' }} />
                  <span style={{ fontFamily: 'sans-serif', fontSize: 12, fontWeight: 700, color: 'rgba(0,0,0,.5)' }}>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ═══ MAIN ═══ */}
      <div className="pg" style={{ minHeight: 'calc(100vh - 60px)' }}>
        <div style={{ maxWidth: 1152, margin: '0 auto', padding: '40px 24px' }}>

          {/* Header */}
          <div className="a1" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, marginBottom: 40 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{ width: 32, height: 1, background: '#000' }} />
                <span style={{ fontFamily: 'sans-serif', fontSize: 10, fontWeight: 900, letterSpacing: '.4em', textTransform: 'uppercase', color: 'rgba(0,0,0,.28)' }}>
                  Job Management · {new Date().getFullYear()}
                </span>
              </div>
              <h1 style={{ fontWeight: 700, color: '#000', lineHeight: .88, letterSpacing: '-.03em', fontSize: 'clamp(2rem,4vw,3rem)', margin: 0 }}>
                MANAGE<br />
                <span style={{ color: '#c8a84b' }}>JOB POSTINGS.</span>
              </h1>
              <p style={{ fontFamily: 'sans-serif', fontSize: 13, color: 'rgba(0,0,0,.38)', marginTop: 12, maxWidth: 300, lineHeight: 1.65 }}>
                Post opportunities for SJC students and track your active listings.
              </p>
            </div>
            <button className="bp" onClick={openCreate}>
              <PlusCircle style={{ width: 16, height: 16 }} /> Post New Job
            </button>
          </div>

          {/* Stats */}
          <div className="a2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 12, marginBottom: 40 }}>
            {([
              { label: 'Jobs Posted',   val: jobs.length,                                    Icon: Briefcase  },
              { label: 'Applicants',    val: totalApplications === null ? '…' : totalApplications, Icon: Users      },
              { label: 'Profile Views', val: totalProfileViews  === null ? '…' : totalProfileViews, Icon: TrendingUp },
              { label: 'Active Listings', val: jobs.length,                                  Icon: Globe      },
            ] as const).map(({ label, val, Icon }) => (
              <div key={label} style={{ padding: 20, background: '#fff', border: '1px solid rgba(0,0,0,.08)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                  <Icon style={{ width: 14, height: 14, color: 'rgba(0,0,0,.2)' }} />
                  <div style={{ width: 6, height: 6, background: '#c8a84b' }} />
                </div>
                <p style={{ fontFamily: 'Georgia,serif', fontSize: 24, fontWeight: 700, color: '#000', margin: 0 }}>{val}</p>
                <p style={{ fontFamily: 'sans-serif', fontSize: 10, fontWeight: 700, letterSpacing: '.35em', textTransform: 'uppercase', color: 'rgba(0,0,0,.28)', marginTop: 4 }}>{label}</p>
              </div>
            ))}
          </div>

          {/* Section label */}
          <div className="a3" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <span style={{ fontFamily: 'sans-serif', fontSize: 10, fontWeight: 900, letterSpacing: '.4em', textTransform: 'uppercase', color: 'rgba(0,0,0,.26)' }}>Your Listings</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,.07)' }} />
            <span style={{ fontFamily: 'sans-serif', fontSize: 10, color: 'rgba(0,0,0,.24)' }}>{jobs.length} total</span>
          </div>

          {/* Jobs grid */}
          <div className="a4">
            {loadingJobs ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '96px 0' }}>
                <Loader2 style={{ width: 24, height: 24, color: 'rgba(0,0,0,.2)' }} className="spin" />
              </div>
            ) : jobs.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', textAlign: 'center' }}>
                <div style={{ width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,.04)', border: '1px solid rgba(0,0,0,.08)', marginBottom: 20 }}>
                  <FileText style={{ width: 24, height: 24, color: 'rgba(0,0,0,.2)' }} />
                </div>
                <p style={{ fontFamily: 'Georgia,serif', fontSize: 18, fontWeight: 700, color: 'rgba(0,0,0,.32)', marginBottom: 8 }}>No job postings yet</p>
                <p style={{ fontFamily: 'sans-serif', fontSize: 13, color: 'rgba(0,0,0,.26)', maxWidth: 280, lineHeight: 1.6, margin: 0 }}>
                  Use the <strong>Post New Job</strong> button above to create your first listing.
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 16 }}>
                {jobs.map(job => (
                  <div key={job._id} className="jc" style={{ padding: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontFamily: 'sans-serif', fontSize: 10, fontWeight: 900, letterSpacing: '.35em', textTransform: 'uppercase', color: 'rgba(0,0,0,.26)', marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{job.company_name}</p>
                        <h3 style={{ fontFamily: 'Georgia,serif', fontSize: 15, fontWeight: 700, color: '#000', lineHeight: 1.25, margin: 0 }}>{job.role}</h3>
                      </div>
                      <div style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(200,168,75,.1)', border: '1px solid rgba(200,168,75,.2)', flexShrink: 0 }}>
                        <Briefcase style={{ width: 15, height: 15, color: '#c8a84b' }} />
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 14 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <IndianRupee style={{ width: 11, height: 11, color: 'rgba(0,0,0,.22)', flexShrink: 0 }} />
                        <span style={{ fontFamily: 'sans-serif', fontSize: 12, color: 'rgba(0,0,0,.52)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{job.salary}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <MapPin style={{ width: 11, height: 11, color: 'rgba(0,0,0,.22)', flexShrink: 0 }} />
                        <span style={{ fontFamily: 'sans-serif', fontSize: 12, color: 'rgba(0,0,0,.52)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{job.address}</span>
                      </div>
                      {job.createdAt && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                          <Clock style={{ width: 11, height: 11, color: 'rgba(0,0,0,.22)', flexShrink: 0 }} />
                          <span style={{ fontFamily: 'sans-serif', fontSize: 11, color: 'rgba(0,0,0,.3)' }}>
                            {new Date(job.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                      )}
                    </div>

                    <p style={{ fontFamily: 'sans-serif', fontSize: 12, color: 'rgba(0,0,0,.38)', lineHeight: 1.6, marginBottom: 18, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {job.description}
                    </p>

                    <div style={{ height: 1, background: 'rgba(0,0,0,.07)', marginBottom: 16 }} />

                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="bg" onClick={() => openEdit(job)} style={{ flex: 1 }}>
                        <Pencil style={{ width: 11, height: 11 }} /> Edit
                      </button>
                      <button className="bg" onClick={() => { setDeleteId(job._id); setDeleteErr(''); }}
                        style={{ flex: 1, borderColor: 'rgba(220,38,38,.2)', color: 'rgba(220,38,38,.55)' }}
                        onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = '#fef2f2'; el.style.color = '#dc2626'; el.style.borderColor = 'rgba(220,38,38,.4)'; }}
                        onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'transparent'; el.style.color = 'rgba(220,38,38,.55)'; el.style.borderColor = 'rgba(220,38,38,.2)'; }}>
                        <Trash2 style={{ width: 11, height: 11 }} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ═══ POST / EDIT MODAL ═══ */}
      {showModal && (
        <div onClick={e => { if (e.target === e.currentTarget) closeModal(); }}
          style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(0,0,0,.55)', animation: 'fadeIn .18s ease both' }}>

          <div style={{ width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto', background: '#f5f0e8', animation: 'fadeUp .22s ease both', boxShadow: '0 32px 80px rgba(0,0,0,.35)' }}>

            {/* Modal header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 28px', background: '#1a1a2e', borderBottom: '1px solid rgba(255,255,255,.08)' }}>
              <div>
                <p style={{ fontFamily: 'sans-serif', fontSize: 9, fontWeight: 900, letterSpacing: '.4em', textTransform: 'uppercase', color: 'rgba(255,255,255,.28)', margin: '0 0 4px' }}>
                  {editingJob ? 'Edit Listing' : 'New Listing'}
                </p>
                <h3 style={{ fontFamily: 'Georgia,serif', fontSize: 17, fontWeight: 700, color: '#fff', margin: 0 }}>
                  {editingJob ? 'Update Job Posting' : 'Create Job Posting'}
                </h3>
              </div>
              <button onClick={closeModal} style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,.3)' }}>
                <X style={{ width: 16, height: 16 }} />
              </button>
            </div>

            {/* Modal body */}
            <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 18 }}>

              {/* Submit error */}
              {submitErr && (
                <div className="eb">
                  <AlertCircle style={{ width: 14, height: 14, color: '#dc2626', flexShrink: 0, marginTop: 1 }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: 'sans-serif', fontSize: 12, fontWeight: 700, color: '#dc2626', margin: '0 0 3px' }}>Unable to save</p>
                    <p style={{ fontFamily: 'sans-serif', fontSize: 11, color: '#ef4444', margin: 0 }}>{submitErr}</p>
                  </div>
                  <button onClick={() => setSubmitErr('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(220,38,38,.4)' }}><X style={{ width: 13, height: 13 }} /></button>
                </div>
              )}

              {/* Fields */}
              {([
                { key: 'role'         as const, label: 'Job Title',    ph: 'e.g. Software Engineer',          ta: false },
                { key: 'company_name' as const, label: 'Company Name', ph: 'e.g. Google India',               ta: false },
                { key: 'salary'       as const, label: 'Salary / CTC', ph: 'e.g. ₹8–12 LPA',                 ta: false },
                { key: 'address'      as const, label: 'Location',     ph: 'e.g. Bangalore, Karnataka',       ta: false },
                { key: 'description'  as const, label: 'Description',  ph: 'Describe the role, requirements, benefits...', ta: true  },
              ]).map(({ key, label, ph, ta }) => (
                <div key={key}>
                  <label style={{ display: 'block', fontFamily: 'sans-serif', fontSize: 10, fontWeight: 900, letterSpacing: '.35em', textTransform: 'uppercase', color: 'rgba(0,0,0,.3)', marginBottom: 7 }}>
                    {label}
                  </label>
                  {ta ? (
                    <textarea rows={4} value={form[key]} placeholder={ph}
                      className={`ff${fieldErrors[key] ? ' fe' : ''}`}
                      onChange={e => { setForm(p => ({ ...p, [key]: e.target.value })); if (fieldErrors[key]) setFieldErrors(p => ({ ...p, [key]: '' })); }} />
                  ) : (
                    <input type="text" value={form[key]} placeholder={ph}
                      className={`ff${fieldErrors[key] ? ' fe' : ''}`}
                      onChange={e => { setForm(p => ({ ...p, [key]: e.target.value })); if (fieldErrors[key]) setFieldErrors(p => ({ ...p, [key]: '' })); }} />
                  )}
                  {fieldErrors[key] && (
                    <p style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'sans-serif', fontSize: 11, color: '#dc2626', margin: '5px 0 0' }}>
                      <AlertCircle style={{ width: 11, height: 11 }} /> {fieldErrors[key]}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Modal footer */}
            <div style={{ display: 'flex', gap: 10, padding: '0 28px 28px' }}>
              <button className="bg" onClick={closeModal} style={{ flex: 1 }}>Cancel</button>
              <button className="bp" onClick={handleSubmit} disabled={submitting} style={{ flex: 2 }}>
                {submitting
                  ? <><Loader2 style={{ width: 13, height: 13 }} className="spin" /> Saving...</>
                  : editingJob ? 'Update Listing' : 'Post Job'
                }
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ DELETE MODAL ═══ */}
      {deleteId && (
        <div onClick={e => { if (e.target === e.currentTarget) { setDeleteId(null); setDeleteErr(''); } }}
          style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(0,0,0,.55)', animation: 'fadeIn .18s ease both' }}>

          <div style={{ width: '100%', maxWidth: 360, background: '#f5f0e8', animation: 'fadeUp .2s ease both', boxShadow: '0 32px 80px rgba(0,0,0,.35)' }}>
            <div style={{ padding: '24px 28px', borderBottom: '1px solid rgba(0,0,0,.08)' }}>
              <div style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(220,38,38,.08)', border: '1px solid rgba(220,38,38,.2)', marginBottom: 16 }}>
                <Trash2 style={{ width: 18, height: 18, color: '#dc2626' }} />
              </div>
              <h3 style={{ fontFamily: 'Georgia,serif', fontSize: 17, fontWeight: 700, color: '#000', margin: '0 0 8px' }}>Delete Job Posting?</h3>
              <p style={{ fontFamily: 'sans-serif', fontSize: 13, color: 'rgba(0,0,0,.42)', lineHeight: 1.6, margin: 0 }}>
                This will permanently remove the listing. This action cannot be undone.
              </p>
              {deleteErr && (
                <div className="eb" style={{ marginTop: 14 }}>
                  <AlertCircle style={{ width: 13, height: 13, color: '#dc2626', flexShrink: 0 }} />
                  <p style={{ fontFamily: 'sans-serif', fontSize: 11, color: '#dc2626', margin: 0 }}>{deleteErr}</p>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: 10, padding: '20px 28px' }}>
              <button className="bg" onClick={() => { setDeleteId(null); setDeleteErr(''); }} style={{ flex: 1 }}>Cancel</button>
              <button onClick={handleDelete} disabled={deleting}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: 10, background: '#dc2626', color: '#fff', border: 'none', cursor: deleting ? 'not-allowed' : 'pointer', fontFamily: 'sans-serif', fontSize: 12, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', opacity: deleting ? .65 : 1, transition: 'background .18s' }}
                onMouseEnter={e => !deleting && ((e.currentTarget as HTMLElement).style.background = '#b91c1c')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#dc2626')}>
                {deleting ? <><Loader2 style={{ width: 13, height: 13 }} className="spin" /> Deleting...</> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}