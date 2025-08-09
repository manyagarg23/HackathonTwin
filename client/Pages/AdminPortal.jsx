import { useState } from "react";
import {
  BarChart3,
  MessageSquare,
  Users,
  Calendar,
  FileText,
  Settings,
  Mail,
  MapPin,
  TrendingUp,
  Award,
} from "lucide-react";
import ChatInterface from "../Components/ChatInterface.jsx";

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

  const Card = ({ title, description, children }) => (
    <div className="border rounded-lg p-4 bg-white shadow">
      {title && <h2 className="text-lg font-bold mb-1">{title}</h2>}
      {description && <p className="text-sm text-gray-500 mb-3">{description}</p>}
      {children}
    </div>
  );

  const Badge = ({ children }) => (
    <span className="px-2 py-1 text-xs bg-gray-200 rounded">{children}</span>
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
        {/* Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 mb-8">
          {tabs.map(renderTabButton)}
        </div>

        {/* Dashboard */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card title="Active Hackathons">
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-gray-500">+1 from last month</p>
              </Card>
              <Card title="Total Participants">
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-gray-500">+180 from last month</p>
              </Card>
              <Card title="Submissions">
                <div className="text-2xl font-bold">89</div>
                <p className="text-xs text-gray-500">+12 from last week</p>
              </Card>
              <Card title="Success Rate">
                <div className="text-2xl font-bold">94%</div>
                <p className="text-xs text-gray-500">+2% from last month</p>
              </Card>
            </div>
          </div>
        )}

        {/* Chatbot */}
        {activeTab === "chatbot" && <ChatInterface />}

        {/* Example for Outreach */}
        {activeTab === "outreach" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Sponsor Management" description="Track sponsors">
              <div className="flex items-center justify-between border p-3 rounded mb-2">
                <div>
                  <p className="font-medium">TechCorp Inc.</p>
                  <p className="text-sm text-gray-500">Gold Sponsor - $50,000</p>
                </div>
                <Badge>Confirmed</Badge>
              </div>
              <div className="flex items-center justify-between border p-3 rounded mb-2">
                <div>
                  <p className="font-medium">DevTools Ltd.</p>
                  <p className="text-sm text-gray-500">Silver Sponsor - $25,000</p>
                </div>
                <Badge>Pending</Badge>
              </div>
            </Card>
            <Card title="Email Campaigns" description="Manage communications">
              <div className="border p-3 rounded mb-2">
                <div className="flex justify-between mb-1">
                  <p className="font-medium">Welcome Email</p>
                  <Badge>Sent</Badge>
                </div>
                <p className="text-sm text-gray-500">Sent to 234 participants</p>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPortal;
