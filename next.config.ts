import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/login/admin',   destination: '/login/AdminLogin',   permanent: true },
      { source: '/login/alumni',  destination: '/login/AlumniLogin',  permanent: true },
      { source: '/login/student', destination: '/login/StudentLogin', permanent: true },
      { source: '/dashboard/admin',   destination: '/Dashboard/Admin',   permanent: true },
      { source: '/dashboard/alumni',  destination: '/Dashboard/Alumni',  permanent: true },
      { source: '/dashboard/students',destination: '/Dashboard/Students',permanent: true },
    ];
  },
};

export default nextConfig;
