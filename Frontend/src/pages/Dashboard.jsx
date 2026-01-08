import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import EditForm from "./EditForm"

export default function Dashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("Applied");
  const [dateApplied, setDateApplied] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [editingId, setEditingId] = useState(null);
  const statusColors = {
    Applied: "bg-blue-100 text-blue-700",
    Interview: "bg-yellow-100 text-yellow-700",
    Offer: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-700",
  };

  const [stats, setStats] = useState({
    total: 0,
    applied: 0,
    interview: 0,
    offer: 0,
    rejected: 0,
  });

  const fetchApplications = async (pageNumber = 1) => {
    try {
      const res = await api.get(
        `/applications?page=${pageNumber}&limit=${limit}&status=${statusFilter}&search=${search}`
      );

      setApplications(res.data.application || []);
      // for stats start
      // const apps = res.data.application || [];
      // setApplications(apps);

      // const calculatedStats = {
      //   total: apps.length,
      //   applied: apps.filter((a) => a.status === "Applied").length,
      //   interview: apps.filter((a) => a.status === "Interview").length,
      //   offer: apps.filter((a) => a.status === "Offer").length,
      //   rejected: apps.filter((a) => a.status === "Rejected").length,
      // };

      // setStats(calculatedStats);

      // for stats end

      setTotalPages(res.data.totalPages || 1);
      setPage(pageNumber);
    } catch (error) {
      console.error("Error fetching applications:", error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats=async()=>{
    try{
      const res= await api.get("/applications/stats");
      setStats(res.data);

    }catch(err){
      console.log("error in stats :" , err);
    }
  }

  useEffect(() => {
    fetchApplications(page);
    fetchStats();
  }, []);

  useEffect(() => {
    fetchApplications(1);
  }, [search, statusFilter]);

  // 👉 ADD APPLICATION
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

  // 👉 DELETE APPLICATION
  const handleDelete = async (id) => {
    try {
      await api.delete(`/applications/${id}`);
      setApplications((prev) => prev.filter((app) => app._id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  // Edit/ Update application
  const handleUpdate = async (id, updatedData) => {
    try {
      await api.put(`/applications/${id}`, updatedData);
      fetchApplications(page); // refresh current page
      setEditingId(null); // close edit mode
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-6">
          Your Job Applications
        </h2>

        {/* ANALYTICS */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <StatCard title="Total" value={stats.total} color="bg-gray-100 text-gray-800" />
          <StatCard title="Applied" value={stats.applied} color="bg-blue-100 text-blue-700" />
          <StatCard title="Interview" value={stats.interview} color="bg-yellow-100 text-yellow-700" />
          <StatCard title="Offer" value={stats.offer} color="bg-green-100 text-green-700" />
          <StatCard title="Rejected" value={stats.rejected} color="bg-red-100 text-red-700" />
        </div>
      

        {/* ADD FORM */}
        <div className="bg-white p-4 rounded-lg shadow border mb-6">
          <h3 className="text-lg font-semibold mb-4">Add Application</h3>

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

        {/* FILTERS */}
        <div className="bg-white p-4 rounded-lg shadow border mb-6 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by company or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full md:w-48"
          >
            <option value="">All Status</option>
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>

          <button
            onClick={() => fetchApplications(1)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Apply
          </button>
        </div>

        {/* LIST */}
        {loading ? (
          <p>Loading...</p>
        ) : applications.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <p className="text-lg font-medium">No applications yet</p>
            <p className="text-sm mt-1">Start by adding your first job application above.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {applications.map((app) => (
            <div
              key={app._id}
              className="bg-white p-4 rounded-lg shadow border"
            >
              {editingId === app._id ? (
                // ✏️ EDIT MODE
                <EditForm
                  app={app}
                  onCancel={() => setEditingId(null)}
                  onSave={handleUpdate}
                />
              ) : (
                // 👀 VIEW MODE
                <>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className={`text-lg font-semibold ${app.status=="Rejected" ? "text-red-800" : "text-black"}` }>
                        {app.company}
                      </h3>
                      <p className={`text-sm text-gray-600 ${app.status=="Rejected" ? "text-red-800" : "text-black"}`}>
                        {app.role}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 text-sm rounded-full 
                      ${statusColors[app.status] || "bg-gray-100 text-gray-700"}`}>
                        {app.status}
                      </span>

                      <button
                        onClick={() => setEditingId(app._id)}
                        className="text-sm bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(app._id)}
                        className="text-sm bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 mt-2">
                    Applied on: {new Date(app.dateApplied).toDateString()}
                  </p>

                  {app.notes && (
                    <p className="mt-2 text-gray-700 text-sm">
                      {app.notes}
                    </p>
                  )}
                </>
              )}
            </div>
          ))}

          </div>
        )}
        {applications.length > 0 && (
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              onClick={() => fetchApplications(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 text-sm bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300"
            >
              Previous
            </button>

            <span className="text-sm text-gray-700">
              Page <strong>{page}</strong> of <strong>{totalPages}</strong>
            </span>

            <button
              onClick={() => fetchApplications(page + 1)}
              disabled={page === totalPages}
              className="px-4 py-2 text-sm bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </>
  );
}


function StatCard({ title, value, color }) {
  return (
    <div className={`p-4 rounded-lg shadow border ${color}`}>
      <h4 className="text-sm font-medium">{title}</h4>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}
