import React from "react";
import api from "../api/axios";
import { useState } from "react";
export default function AddApplication(){
    const [company, setCompany] = useState("");
    const [role, setRole] = useState("");
    const [status, setStatus] = useState("Applied");
    const [dateApplied, setDateApplied] = useState("");
    const [notes, setNotes] = useState("");
    const [error, setError] = useState("");

    const fetchApplications = async (pageNumber = 1) => {
        try {
          const res = await api.get(
            `/applications?page=${pageNumber}&limit=${limit}&status=${statusFilter}&search=${search}`
          );
    
          setApplications(res.data.application || []);
          setTotalPages(res.data.totalPages || 1);
          setPage(pageNumber);
        } catch (error) {
          console.error("Error fetching applications:", error);
          setApplications([]);
        } finally {
          setLoading(false);
        }
      };
      
    const handleAddApplication = async (e) => {
        e.preventDefault();
        setError("");
    
        try {
          await api.post("/applications", {
            company,
            role,
            status,
            dateApplied,
            notes,
          });
    
          setCompany("");
          setRole("");
          setStatus("Applied");
          setDateApplied("");
          setNotes("");
    
          fetchApplications(); // refresh list
        } catch (err) {
          setError(err.response?.data?.message || "Failed to add application");
        }
      };
    return(
        <div className="bg-white p-4 rounded-lg shadow border mb-6">
          <h3 className=" text-lg font-semibold mb-4">Add Application</h3>

          {error && (
            <p className="mb-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <form
            onSubmit={handleAddApplication}
            className="grid md:grid-cols-2 gap-4"
          >
            <input
              type="text"
              placeholder="Company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
              className="border rounded-lg px-3 py-2"
            />

            <input
              type="text"
              placeholder="Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="border rounded-lg px-3 py-2"
            />

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border rounded-lg px-3 py-2"
            >
              <option>Applied</option>
              <option>Interview</option>
              <option>Offer</option>
              <option>Rejected</option>
            </select>

            <input
              type="date"
              value={dateApplied}
              onChange={(e) => setDateApplied(e.target.value)}
              required
              className="border rounded-lg px-3 py-2"
            />

            <textarea
              placeholder="Notes (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="border rounded-lg px-3 py-2 md:col-span-2"
            />

            <button
              type="submit"
              className="bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition md:col-span-2"
            >
              Add Application
            </button>
          </form>
        </div>
    );
}