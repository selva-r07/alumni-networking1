"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function JobForm({ job }: any) {
  const router = useRouter();

  const [form, setForm] = useState({
    role: job?.role || "",
    company_name: job?.company_name || "",
    salary: job?.salary || "",
    description: job?.description || "",
    address: job?.address || "",
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (job) {
      await fetch(`/api/jobs/${job._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, postedBy: user._id }),
      });
    }

    router.push("/jobs");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <input
        type="text"
        placeholder="Role"
        className="border p-2 w-full"
        value={form.role}
        onChange={(e) => setForm({ ...form, role: e.target.value })}
        required
      />

      <input
        type="text"
        placeholder="Company Name"
        className="border p-2 w-full"
        value={form.company_name}
        onChange={(e) => setForm({ ...form, company_name: e.target.value })}
        required
      />

      <input
        type="number"
        placeholder="Salary"
        className="border p-2 w-full"
        value={form.salary}
        onChange={(e) => setForm({ ...form, salary: e.target.value })}
        required
      />

      <textarea
        placeholder="Description"
        className="border p-2 w-full"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        required
      />

      <input
        type="text"
        placeholder="Address"
        className="border p-2 w-full"
        value={form.address}
        onChange={(e) => setForm({ ...form, address: e.target.value })}
        required
      />

      <button className="bg-black text-white px-4 py-2 rounded">
        {job ? "Update Job" : "Create Job"}
      </button>
    </form>
  );
}