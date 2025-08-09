import { useState } from "react";
import {
  BarChart3,
  MessageSquare,
  Mail,
  MapPin,
  Calendar,
  FileText,
  TrendingUp,
  Settings,
} from "lucide-react";

import DashboardTab from "../Components/DashboardTab";
import ChatInterface from "../Components/ChatInterface";
import OutreachTab from "../Components/OutreachTab";
import EventsTab from "../Components/EventsTab";
import SchedulingTab from "../Components/SchedulingTab";
import SubmissionsTab from "../Components/SubmissionsTab";
import AnalyticsTab from "../Components/AnalyticsTab";
import SettingsTab from "../Components/SettingsTab";

const AdminPortal = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: <BarChart3 className="h-4 w-4" /> },
    { id: "chatbot", label: "Chatbot", icon: <MessageSquare className="h-4 w-4" /> },
    { id: "outreach", label: "Outreach", icon: <Mail className="h-4 w-4" /> },
    { id: "events", label: "Events", icon: <MapPin className="h-4 w-4" /> },
    { id: "scheduling", label: "Schedule", icon: <Calendar className="h-4 w-4" /> },
    { id: "submissions", label: "Submissions", icon: <FileText className="h-4 w-4" /> },
    { id: "analytics", label: "Analytics", icon: <TrendingUp className="h-4 w-4" /> },
    { id: "settings", label: "Settings", icon: <Settings className="h-4 w-4" /> },
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
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded">
            Admin Dashboard
          </span>
        </div>
      </header>

      <div className="p-6">
        {/* Tab buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 mb-8">
          {tabs.map(renderTabButton)}
        </div>

        {/* Tab content */}
        {activeTab === "dashboard" && <DashboardTab />}
        {activeTab === "chatbot" && <ChatInterface />}
        {activeTab === "outreach" && <OutreachTab />}
        {activeTab === "events" && <EventsTab />}
        {activeTab === "scheduling" && <SchedulingTab />}
        {activeTab === "submissions" && <SubmissionsTab />}
        {activeTab === "analytics" && <AnalyticsTab />}
        {activeTab === "settings" && <SettingsTab />}
      </div>
    </div>
  );
};

export default AdminPortal;
