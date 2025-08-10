import { useState, useEffect } from "react";
import { Clock, Check, X, Mail, Phone, AlertCircle, Users } from "lucide-react";

export default function RequestsTab() {
  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const mockRequests = [
    { id: 1, name: "Jessica Park", email: "jessica@email.com", phone: "+1 555-111", role: "Hacker", status: "Pending", priority: "High", skills: ["JavaScript", "React"], motivation: "Passionate about building innovative solutions.", date: "2024-02-20", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica" },
    { id: 2, name: "Marcus Thompson", email: "marcus@email.com", phone: "+1 555-222", role: "Judge", status: "Pending", priority: "Medium", skills: ["UX Research", "Data Analysis"], motivation: "Love mentoring innovators.", date: "2024-02-19", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus" }
  ];

  const roleColors = {
    Hacker: "bg-blue-100 text-blue-800",
    Judge: "bg-purple-100 text-purple-800",
    Sponsor: "bg-green-100 text-green-800"
  };
  const priorityColors = {
    High: "bg-red-100 text-red-800",
    Medium: "bg-yellow-100 text-yellow-800",
    Low: "bg-green-100 text-green-800"
  };
  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-800",
    Approved: "bg-green-100 text-green-800",
    Rejected: "bg-red-100 text-red-800"
  };
  const statusIcons = {
    Pending: <Clock className="h-4 w-4" />,
    Approved: <Check className="h-4 w-4" />,
    Rejected: <X className="h-4 w-4" />
  };

  useEffect(() => {
    setTimeout(() => {
      setRequests(mockRequests);
      setLoading(false);
    }, 500);
  }, []);

  const updateStatus = (id, status) =>
    setRequests(prev => prev.map(r => (r.id === id ? { ...r, status } : r)));

  const filtered = requests.filter(r => statusFilter === "all" || r.status === statusFilter);

  if (loading) return <div className="flex justify-center items-center min-h-96 animate-spin border-b-2 border-black rounded-full h-12 w-12" />;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Registration Requests</h1>
        <p className="text-gray-600">Review and manage hackathon registrations</p>
      </div>

      {/* Filters */}
      <select
        value={statusFilter}
        onChange={e => setStatusFilter(e.target.value)}
        className="border px-3 py-2 rounded-lg"
      >
        <option value="all">All</option>
        <option value="Pending">Pending</option>
        <option value="Approved">Approved</option>
        <option value="Rejected">Rejected</option>
      </select>

      {/* Requests */}
      {filtered.length ? (
        filtered.map(r => (
          <div key={r.id} className="bg-white shadow rounded-lg border overflow-hidden">
            {/* Top Row */}
            <div className="flex justify-between p-4 border-b">
              <div className="flex gap-3">
                <img src={r.avatar} alt={r.name} className="w-12 h-12 rounded-full" />
                <div>
                  <h3 className="font-semibold">{r.name}</h3>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${roleColors[r.role]}`}>{r.role}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${priorityColors[r.priority]}`}>{r.priority}</span>
                    <span className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${statusColors[r.status]}`}>
                      {statusIcons[r.status]} {r.status}
                    </span>
                  </div>
                </div>
              </div>
              <span className="text-sm text-gray-500">{new Date(r.date).toLocaleDateString()}</span>
            </div>

            {/* Details */}
            <div className="p-4 space-y-2">
              <div className="flex items-center text-sm text-gray-600 gap-2"><Mail className="h-4 w-4" />{r.email}</div>
              <div className="flex items-center text-sm text-gray-600 gap-2"><Phone className="h-4 w-4" />{r.phone}</div>
              <div className="flex flex-wrap gap-1">
                {r.skills.map((s, i) => (
                  <span key={i} className="px-2 py-1 text-xs bg-gray-100 rounded">{s}</span>
                ))}
              </div>
              <p className="text-sm italic text-gray-600">"{r.motivation}"</p>
            </div>

            {/* Actions */}
            {r.status === "Pending" && (
              <div className="flex border-t">
                <button onClick={() => updateStatus(r.id, "Approved")} className="flex-1 py-2 bg-green-600 text-white hover:bg-green-700">Approve</button>
                <button onClick={() => updateStatus(r.id, "Rejected")} className="flex-1 py-2 bg-red-600 text-white hover:bg-red-700">Reject</button>
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No {statusFilter === "all" ? "" : statusFilter.toLowerCase()} requests.</p>
        </div>
      )}
    </div>
  );
}
