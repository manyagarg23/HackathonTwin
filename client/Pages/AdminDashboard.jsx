import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [hackathons, setHackathons] = useState([]);
//   const navigate = useNavigate();

  useEffect(() => {
    // Replace with API call
    setHackathons([
      { id: 1, name: "HackNation 2025", date: "2025-08-15", location: "New York", url: "https://hacknation.com" },
      { id: 2, name: "CodeSprint", date: "2025-09-05", location: "San Francisco", url: "https://codesprint.com" },
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center p-8 space-y-8">
      {/* Header */}
      <h1 className="text-4xl font-bold">
        Admin Dashboard
      </h1>

      {/* Host Button */}
      <button
        // onClick={() => navigate("/chatinterface")}
        className="px-6 py-3 border-2 border-black text-black font-semibold rounded-lg hover:bg-black hover:text-white transition"
      >
        Host a New Hack
      </button>

      {/* Past Hackathons */}
      <div className="w-full max-w-2xl border border-black rounded-lg p-6 shadow-lg bg-white">
        <h2 className="text-2xl font-bold mb-6 border-b border-gray-300 pb-2">
          Past Hackathons
        </h2>

        {hackathons.length > 0 ? (
          <ul className="space-y-4">
            {hackathons.map((hack) => (
              <li
                key={hack.id}
                className="p-4 border border-gray-300 rounded-lg hover:shadow-md transition"
              >
                <div className="font-bold text-lg">{hack.name}</div>
                <div className="text-sm text-gray-600">
                  {hack.date} • {hack.location}
                </div>
                {hack.url && (
                  <a
                    href={hack.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-500 hover:underline"
                  >
                    {hack.url}
                  </a>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">
            No hackathons have been created yet.
          </p>
        )}
      </div>
    </div>
  );
}
