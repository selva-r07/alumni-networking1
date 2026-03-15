"use client";

import { useRouter } from "next/navigation";

interface JobProps {
  job: any;
  user: any;
  refresh: () => void;
}

export default function JobCard({ job, user, refresh }: JobProps) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Delete this job?")) return;

    await fetch(`/api/jobs/${job._id}`, {
      method: "DELETE",
    });

    refresh();
  };

  const handleRegister = async () => {
    await fetch("/api/jobs/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jobId: job._id,
        student_name: user.full_name,
        department_no: user.department,
        email: user.email,
        mobile: user.mobile || "0000000000",
      }),
    });

    alert("Registered Successfully!");
    refresh();
  };

  return (
    <div className="border p-5 rounded-lg shadow-md bg-white">
      <h2 className="text-xl font-bold">{job.role}</h2>
      <p><b>Company:</b> {job.company_name}</p>
      <p><b>Salary:</b> ₹{job.salary}</p>
      <p><b>Address:</b> {job.address}</p>
      <p><b>Posted By:</b> {job.postedBy?.full_name}</p>
      <p><b>Applicants:</b> {job.registrations?.length}</p>

      {/* Alumni Controls */}
      {user?.role === "alumni" && (
        <div className="flex gap-3 mt-3">
          <button
            onClick={() => router.push(`/jobs/edit/${job._id}`)}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            Edit
          </button>

          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Delete
          </button>
        </div>
      )}

      {/* Student Register */}
      {user?.role === "student" && (
        <button
          onClick={handleRegister}
          className="mt-3 bg-green-500 text-white px-4 py-2 rounded"
        >
          Register
        </button>
      )}
    </div>
  );
}