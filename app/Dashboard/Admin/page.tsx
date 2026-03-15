"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Users, GraduationCap, FileText, LogOut,
  Shield, TrendingUp, Bell, ChevronRight,
  Activity, Clock, Menu, X
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin/students", label: "Manage Students", Icon: Users,        desc: "View, edit and manage all registered students", tag: "Students",  color: "#2d5a27" },
  { href: "/admin/alumni",   label: "Manage Alumni",   Icon: GraduationCap, desc: "Oversee alumni profiles and job postings",     tag: "Alumni",    color: "#c8a84b" },
  { href: "/admin/requests", label: "View Requests",   Icon: FileText,      desc: "Review pending approvals and access requests", tag: "Requests",  color: "#1a1a2e" },
];

const ACTIVITY = [
  { label: "New student registered",          time: "2 min ago",  dot: "#2d5a27"  },
  { label: "Alumni job posting submitted",    time: "18 min ago", dot: "#c8a84b"  },
  { label: "Access request from CSE batch",   time: "1 hr ago",   dot: "#1a1a2e"  },
  { label: "Profile update: John Mathew",     time: "3 hr ago",   dot: "rgba(0,0,0,.2)" },
];

export default function AdminPanel() {
  const [mounted, setMounted]   = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [stats, setStats] = useState({ students: 0, alumni: 0, jobs: 0, pending: 0 });
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  useEffect(() => { 
    setMounted(true);
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [alumniRes, jobsRes] = await Promise.all([
        fetch('/api/alumni'),
        fetch('/api/jobs')
      ]);
      const alumni = await alumniRes.json();
      const jobs = await jobsRes.json();
      
      const students = alumni.filter((u: any) => u.role === 'student');
      const alumniOnly = alumni.filter((u: any) => u.role === 'alumni');
      
      setStats({
        students: students.length || 0,
        alumni: alumniOnly.length || 0,
        jobs: jobs.length || 0,
        pending: 0
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f0e8", fontFamily: "'Georgia', serif" }}>
      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        .a1{animation:fadeUp .5s .04s ease both}
        .a2{animation:fadeUp .5s .10s ease both}
        .a3{animation:fadeUp .5s .16s ease both}
        .a4{animation:fadeUp .5s .22s ease both}
        .a5{animation:fadeUp .5s .28s ease both}

        /* Subtle horizontal line texture */
        .pg{background-image:repeating-linear-gradient(180deg,transparent,transparent calc(8.33% - 1px),rgba(0,0,0,.028) calc(8.33% - 1px),rgba(0,0,0,.028) 8.33%)}

        /* Nav card hover */
        .nc{
          display:block;text-decoration:none;
          background:#fff;border:1px solid rgba(0,0,0,.08);
          position:relative;overflow:hidden;
          transition:box-shadow .22s, transform .22s;
        }
        .nc::before{
          content:'';position:absolute;top:0;left:0;
          width:3px;height:0;
          transition:height .25s;
        }
        .nc:hover{box-shadow:0 12px 40px rgba(0,0,0,.11);transform:translateY(-2px)}
        .nc:hover::before{height:100%}
        .nc-green::before{background:#2d5a27}
        .nc-gold::before{background:#c8a84b}
        .nc-navy::before{background:#1a1a2e}

        /* Activity row */
        .ar{display:flex;align-items:center;gap:14px;padding:12px 0;border-bottom:1px solid rgba(0,0,0,.06);transition:background .15s}
        .ar:last-child{border-bottom:none}
        .ar:hover{background:rgba(0,0,0,.015)}

        /* Logout */
        .lo{
          display:flex;align-items:center;justify-content:center;gap:8px;
          width:100%;padding:13px;
          background:#1a1a2e;color:#fff;border:none;cursor:pointer;
          font-family:sans-serif;font-size:11px;font-weight:800;
          letter-spacing:.18em;text-transform:uppercase;text-decoration:none;
          transition:all .2s;
        }
        .lo:hover{background:#c8a84b;color:#000;box-shadow:0 6px 20px rgba(200,168,75,.3);transform:translateY(-1px)}

        /* Stat card */
        .sc{background:#fff;border:1px solid rgba(0,0,0,.08);padding:20px;position:relative;overflow:hidden}
        .sc::after{content:'';position:absolute;bottom:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,rgba(200,168,75,.4),transparent)}
      `}</style>

      {/* ════════ NAV ════════ */}
      <nav style={{ background: "#1a1a2e", height: 60, position: "sticky", top: 0, zIndex: 40, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px", borderBottom: "1px solid rgba(255,255,255,.06)" }}>

        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 28, height: 28, background: "#c8a84b", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Shield style={{ width: 14, height: 14, color: "#000" }} />
          </div>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>SJC Alumni</span>
          <span style={{ color: "rgba(255,255,255,.12)", margin: "0 6px" }}>|</span>
          <span style={{ color: "rgba(255,255,255,.28)", fontFamily: "sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: ".35em", textTransform: "uppercase" }}>Admin Portal</span>
        </div>

        {/* Right — bell + badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ position: "relative" }}>
            <div 
              onClick={() => setNotifOpen(!notifOpen)}
              style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", background: notifOpen ? "rgba(200,168,75,.15)" : "rgba(255,255,255,.07)", cursor: "pointer" }}>
              <Bell style={{ width: 15, height: 15, color: "rgba(255,255,255,.5)" }} />
            </div>
            <span style={{ position: "absolute", top: -2, right: -2, width: 15, height: 15, borderRadius: "50%", background: "#dc2626", border: "2px solid #1a1a2e", fontFamily: "sans-serif", fontSize: 8, fontWeight: 800, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>3</span>
            
            {notifOpen && (
              <div style={{ position: "absolute", right: 0, top: 44, width: 320, background: "#fff", border: "1px solid rgba(0,0,0,.1)", boxShadow: "0 16px 48px rgba(0,0,0,.14)", zIndex: 50 }}>
                <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(0,0,0,.07)" }}>
                  <p style={{ fontFamily: "sans-serif", fontSize: 11, fontWeight: 800, color: "#000", margin: 0 }}>Notifications</p>
                </div>
                {ACTIVITY.map((a, i) => (
                  <div key={i} style={{ padding: "12px 18px", borderBottom: i < ACTIVITY.length - 1 ? "1px solid rgba(0,0,0,.05)" : "none", display: "flex", gap: 12, alignItems: "start" }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: a.dot, flexShrink: 0, marginTop: 4 }} />
                    <div>
                      <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "rgba(0,0,0,.7)", margin: 0, lineHeight: 1.4 }}>{a.label}</p>
                      <p style={{ fontFamily: "sans-serif", fontSize: 10, color: "rgba(0,0,0,.35)", margin: "4px 0 0" }}>{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{ padding: "0 12px", height: 36, display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,.07)" }}>
            <div style={{ width: 22, height: 22, background: "rgba(200,168,75,.25)", border: "1px solid rgba(200,168,75,.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 10, fontWeight: 800, color: "#c8a84b", fontFamily: "sans-serif" }}>A</span>
            </div>
            <span style={{ fontFamily: "sans-serif", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,.6)" }}>Admin</span>
          </div>
        </div>
      </nav>

      {/* ════════ MAIN ════════ */}
      <div className="pg" style={{ minHeight: "calc(100vh - 60px)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "44px 24px" }}>

          {/* ── Header ── */}
          <div className="a1" style={{ marginBottom: 44 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <div style={{ width: 32, height: 1, background: "#000" }} />
              <span style={{ fontFamily: "sans-serif", fontSize: 10, fontWeight: 900, letterSpacing: ".4em", textTransform: "uppercase", color: "rgba(0,0,0,.28)" }}>
                Control Panel · {now.getFullYear()}
              </span>
            </div>
            <h1 style={{ fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 700, letterSpacing: "-.03em", lineHeight: .9, color: "#000", margin: 0 }}>
              {greeting},<br />
              <span style={{ color: "#c8a84b" }}>ADMINISTRATOR.</span>
            </h1>
            <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "rgba(0,0,0,.38)", marginTop: 14, lineHeight: 1.65, maxWidth: 380 }}>
              Manage the SJC Alumni Network — students, alumni, and pending requests from one place.
            </p>
          </div>

          {/* ── Stats row ── */}
          <div className="a2" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 12, marginBottom: 40 }}>
            {([
              { label: "Total Students", val: stats.students, Icon: Users,        accent: "#2d5a27" },
              { label: "Alumni Members", val: stats.alumni, Icon: GraduationCap, accent: "#c8a84b" },
              { label: "Job Postings",   val: stats.jobs, Icon: Activity,     accent: "#1a1a2e" },
              { label: "Pending",        val: stats.pending, Icon: Clock,        accent: "#dc2626" },
            ]).map(({ label, val, Icon, accent }) => (
              <div key={label} className="sc">
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
                  <div style={{ width: 30, height: 30, background: `${accent}14`, border: `1px solid ${accent}28`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon style={{ width: 13, height: 13, color: accent }} />
                  </div>
                  <div style={{ width: 5, height: 5, background: accent, borderRadius: 0 }} />
                </div>
                <p style={{ fontFamily: "Georgia,serif", fontSize: 26, fontWeight: 700, color: "#000", margin: 0 }}>{val}</p>
                <p style={{ fontFamily: "sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: ".35em", textTransform: "uppercase", color: "rgba(0,0,0,.28)", marginTop: 5 }}>{label}</p>
              </div>
            ))}
          </div>

          {/* ── Two column: Nav cards + Activity ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, alignItems: "start" }}>

            {/* Left — nav cards */}
            <div>
              {/* Section label */}
              <div className="a3" style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <span style={{ fontFamily: "sans-serif", fontSize: 10, fontWeight: 900, letterSpacing: ".4em", textTransform: "uppercase", color: "rgba(0,0,0,.26)" }}>Quick Access</span>
                <div style={{ flex: 1, height: 1, background: "rgba(0,0,0,.07)" }} />
              </div>

              <div className="a3" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {NAV_ITEMS.map(({ href, label, Icon, desc, tag, color }) => {
                  const cls = color === "#2d5a27" ? "nc nc-green" : color === "#c8a84b" ? "nc nc-gold" : "nc nc-navy";
                  return (
                    <Link key={href} href={href} className={cls}>
                      <div style={{ padding: "22px 26px", display: "flex", alignItems: "center", gap: 20 }}>
                        {/* Icon box */}
                        <div style={{ width: 46, height: 46, background: `${color}10`, border: `1px solid ${color}22`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Icon style={{ width: 20, height: 20, color }} />
                        </div>

                        {/* Text */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5 }}>
                            <span style={{ fontFamily: "Georgia,serif", fontSize: 15, fontWeight: 700, color: "#000" }}>{label}</span>
                            <span style={{ fontFamily: "sans-serif", fontSize: 8, fontWeight: 900, letterSpacing: ".35em", textTransform: "uppercase", padding: "2px 7px", background: `${color}12`, border: `1px solid ${color}20`, color }}>{tag}</span>
                          </div>
                          <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "rgba(0,0,0,.38)", margin: 0, lineHeight: 1.5 }}>{desc}</p>
                        </div>

                        {/* Arrow */}
                        <ChevronRight style={{ width: 16, height: 16, color: "rgba(0,0,0,.2)", flexShrink: 0 }} />
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Logout */}
              <div className="a4" style={{ marginTop: 20 }}>
                <Link href="/login" className="lo">
                  <LogOut style={{ width: 14, height: 14 }} /> Sign Out of Admin Portal
                </Link>
              </div>
            </div>

            {/* Right — recent activity */}
            <div className="a5">
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <span style={{ fontFamily: "sans-serif", fontSize: 10, fontWeight: 900, letterSpacing: ".4em", textTransform: "uppercase", color: "rgba(0,0,0,.26)" }}>Recent Activity</span>
                <div style={{ flex: 1, height: 1, background: "rgba(0,0,0,.07)" }} />
              </div>

              <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,.08)", padding: "6px 20px" }}>
                {ACTIVITY.map((a, i) => (
                  <div key={i} className="ar">
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: a.dot, flexShrink: 0, display: "inline-block" }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "rgba(0,0,0,.65)", margin: 0, lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.label}</p>
                      <p style={{ fontFamily: "sans-serif", fontSize: 10, color: "rgba(0,0,0,.28)", margin: "3px 0 0" }}>{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* System status */}
              <div style={{ marginTop: 16, background: "#fff", border: "1px solid rgba(0,0,0,.08)", padding: "16px 20px" }}>
                <p style={{ fontFamily: "sans-serif", fontSize: 10, fontWeight: 900, letterSpacing: ".4em", textTransform: "uppercase", color: "rgba(0,0,0,.26)", marginBottom: 14 }}>System Status</p>
                {([
                  { label: "Database",    ok: true  },
                  { label: "Auth Server", ok: true  },
                  { label: "Job API",     ok: true  },
                  { label: "Email Queue", ok: false },
                ]).map(({ label, ok }) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                    <span style={{ fontFamily: "sans-serif", fontSize: 12, color: "rgba(0,0,0,.5)" }}>{label}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: ok ? "#22c55e" : "#f59e0b", display: "inline-block" }} />
                      <span style={{ fontFamily: "sans-serif", fontSize: 10, fontWeight: 700, color: ok ? "#16a34a" : "#d97706" }}>{ok ? "Online" : "Degraded"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Footer strip ── */}
          <div style={{ marginTop: 48, paddingTop: 20, borderTop: "1px solid rgba(0,0,0,.07)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <span style={{ fontFamily: "sans-serif", fontSize: 10, color: "rgba(0,0,0,.22)", letterSpacing: ".1em" }}>
              ST. JOSEPH'S COLLEGE · ALUMNI NETWORK · ADMIN CONSOLE
            </span>
            <span style={{ fontFamily: "sans-serif", fontSize: 10, color: "rgba(0,0,0,.22)" }}>
              {mounted ? now.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) : ""}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}