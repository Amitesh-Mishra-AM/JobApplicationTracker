import { useState } from "react";


export default function EditForm({ app, onCancel, onSave }) {
  const [company, setCompany] = useState(app.company);
  const [role, setRole] = useState(app.role);
  const [status, setStatus] = useState(app.status);
  const [dateApplied, setDateApplied] = useState(app.dateApplied.split("T")[0]);
  const [notes, setNotes] = useState(app.notes || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(app._id, { company, role, status, dateApplied, notes });
  };

  return (
    <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
      <input
        type="text"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        className="border rounded-lg px-3 py-2"
        required
      />

      <input
        type="text"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="border rounded-lg px-3 py-2"
        required
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
        className="border rounded-lg px-3 py-2"
        required
      />

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="border rounded-lg px-3 py-2 md:col-span-2"
        placeholder="Notes"
      />

      <div className="flex gap-3 md:col-span-2">
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Save
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
