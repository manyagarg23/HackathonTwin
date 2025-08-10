import { useState } from "react";
import {
  Mail,
  MapPin,
  Calendar,
  FileText,
  TrendingUp,
  Users,
} from "lucide-react";

import OutreachTab from "../Components/OutreachTab";
import EventsTab from "../Components/EventsTab";
import PersonnelTab from "../Components/PersonnelTab";
import AnalyticsTab from "../Components/AnalyticsTab";
import RequestsTab from "../Components/RequestsTab";
import TeamsTab from "../Components/TeamsTab";
import WikiTab from "../Components/WikiTab";
import { useNavigate } from "react-router-dom";

const AdminHackPortal = () => {
  const [activeTab, setActiveTab] = useState("analytics");
  const navigate = useNavigate();

  const tabs = [
    { id: "outreach", label: "Outreach", icon: <Mail className="h-4 w-4" /> },
    { id: "events", label: "Events", icon: <MapPin className="h-4 w-4" /> },
    { id: "personnel", label: "Personnel", icon: <Calendar className="h-4 w-4" /> },
    { id: "analytics", label: "Analytics", icon: <TrendingUp className="h-4 w-4" /> },
    { id: "wiki", label: "Wiki", icon: <FileText className="h-4 w-4" /> },
    { id: "requests", label: "Requests", icon: <Users className="h-4 w-4" /> },
    { id: "teams", label: "Teams", icon: <Users className="h-4 w-4" /> },
  ];

  const renderTabButton = (tab) => (
    <button
      key={tab.id}
      onClick={() => setActiveTab(tab.id)}
      className={`flex items-center gap-2 px-3 py-2 border rounded ${
        activeTab === tab.id ? "bg-gray-200 font-bold" : ""
      }`}
    >
      {tab.icon}
      <span className="hidden sm:inline">{tab.label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Hackathon Admin Portal</h1>
          <button
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded"
            onClick={() => navigate("/dummyhack")}
          >
            Visit Current Hackathon
          </button>
        </div>
      </header>

      <div className="p-6">
        {/* Tab buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 mb-8">
          {tabs.map(renderTabButton)}
        </div>

        {/* Tab content */}
        {activeTab === "outreach" && <OutreachTab />}
        {activeTab === "events" && <EventsTab />}
        {activeTab === "personnel" && <PersonnelTab />}
        {activeTab === "analytics" && <AnalyticsTab />}
        {activeTab === "wiki" && <WikiTab />}
        {activeTab === "requests" && <RequestsTab />}
        {activeTab === "teams" && <TeamsTab />}
      </div>
    </div>
  );
};

export default AdminHackPortal;
