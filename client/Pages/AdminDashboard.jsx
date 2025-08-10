import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatInterface from "../Components/ChatInterface";
import WikiUpload from "../Components/WikiUpload";

export default function AdminDashboard() {
  const [hackathons, setHackathons] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Replace with API call
    setHackathons([
      { id: 1, name: "HackNation 2025", date: "2025-08-15", location: "New York", url: "https://hacknation.com" },
      { id: 2, name: "CodeSprint", date: "2025-09-05", location: "San Francisco", url: "https://codesprint.com" },
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col items-center p-8 space-y-12">
      {/* Header */}
      <header className="text-center">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your hackathons with ease</p>
      </header>

      {/* New Hackathon Section */}
      <section className="w-full max-w-5xl">
        <h2 className="text-2xl font-semibold mb-6">Host a New Hackathon</h2>
        <div className="grid gap-8 md:grid-cols-2">
          {/* Chat Section */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <h3 className="font-medium text-lg mb-2">Chat with our AI Assistant</h3>
            <p className="text-sm text-gray-500 mb-4">
              Tell our chatbot your requirements and let it set up the basics for your hackathon.
            </p>
            <ChatInterface />
          </div>

          {/* Wiki Upload Section */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <h3 className="font-medium text-lg mb-2">Upload Wiki Document</h3>
            <p className="text-sm text-gray-500 mb-4">
              Prefer to prepare offline? Upload a document with your logistics.
            </p>
            <WikiUpload />
          </div>
        </div>
      </section>

      {/* Past Hackathons */}
      <section className="w-full max-w-5xl">
        <h2 className="text-2xl font-semibold mb-6">Past Hackathons</h2>
        {hackathons.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {hackathons.map((hack) => (
              <div
                key={hack.id}
                className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition"
              >
                <div className="font-bold text-lg">{hack.name}</div>
                <div className="text-sm text-gray-600 mt-1">
                  {hack.date} • {hack.location}
                </div>
                {hack.url && (
                  <a
                    href={hack.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline mt-2 block"
                  >
                    {hack.url}
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No hackathons have been created yet.</p>
        )}
      </section>

      {/* Visit Current Hackathon */}
      <button
        onClick={() => navigate("/adminhack")}
        className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
      >
        Visit Current Hackathon
      </button>
    </div>
  );
}
