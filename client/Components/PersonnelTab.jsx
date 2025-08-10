import { useState, useEffect } from "react";
import { Search, User, Mail, Phone, Users, Award } from "lucide-react";
import Card from "./Card";
import Badge from "./Badge";

/* ===== Constants ===== */
const ROLE_COLORS = {
  Hacker: "bg-blue-100 text-blue-800",
  Judge: "bg-purple-100 text-purple-800",
  Sponsor: "bg-green-100 text-green-800",
  Organizer: "bg-orange-100 text-orange-800",
  Admin: "bg-red-100 text-red-800"
};

const EXP_COLORS = {
  Beginner: "bg-yellow-100 text-yellow-800",
  Intermediate: "bg-blue-100 text-blue-800",
  Advanced: "bg-purple-100 text-purple-800",
  Expert: "bg-green-100 text-green-800"
};

const MOCK_PARTICIPANTS = [
  {
    id: 1,
    name: "Alex Johnson",
    email: "alex@email.com",
    phone: "+1 555-1234",
    role: "Hacker",
    status: "Active",
    skills: ["React", "Node.js"],
    experience: "Intermediate",
    team: "Team Alpha",
    registrationDate: "2024-02-15",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
  },
  {
    id: 2,
    name: "Sarah Chen",
    email: "sarah@email.com",
    phone: "+1 555-2345",
    role: "Hacker",
    status: "Active",
    skills: ["ML", "Python"],
    experience: "Advanced",
    team: "Team Beta",
    registrationDate: "2024-02-14",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
  },
  {
    id: 3,
    name: "Mike Rodriguez",
    email: "mike@email.com",
    phone: "+1 555-3456",
    role: "Judge",
    status: "Active",
    skills: ["Product", "UX"],
    experience: "Expert",
    registrationDate: "2024-02-10",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike"
  }
];

/* ===== Main Component ===== */
export default function PersonnelTab() {
  const [participants, setParticipants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setParticipants(MOCK_PARTICIPANTS);
      setLoading(false);
    }, 500);
  }, []);

  const filteredParticipants = participants.filter(p => {
    const matchSearch = [p.name, p.email, ...p.skills]
      .some(field => field.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchRole = role === "all" || p.role === role;
    const matchStatus = status === "all" || p.status === status;
    return matchSearch && matchRole && matchStatus;
  });

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      
      {/* Section: Judges & Volunteers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Judges" description="Assigned to review submissions">
          <JudgeList />
        </Card>
        <Card title="Volunteers" description="Assisting in events">
          <VolunteerList />
        </Card>
      </div>

      {/* Section: Participants Overview */}
      <header>
        <h1 className="text-3xl font-bold">Participants</h1>
        <p className="text-gray-600">Manage and view all registered participants</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Stat icon={<Users className="text-blue-600" />} label="Total" value={participants.length} />
        <Stat icon={<User className="text-green-600" />} label="Hackers" value={participants.filter(p => p.role === "Hacker").length} />
        <Stat icon={<Award className="text-purple-600" />} label="Judges" value={participants.filter(p => p.role === "Judge").length} />
        <Stat icon={<Users className="text-orange-600" />} label="Teams" value={new Set(participants.filter(p => p.team).map(p => p.team)).size} />
      </div>

      {/* Section: Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded shadow">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="w-full pl-10 border rounded p-2"
            placeholder="Search name, email, skills..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <select value={role} onChange={e => setRole(e.target.value)} className="border rounded p-2">
          <option value="all">All Roles</option>
          {Object.keys(ROLE_COLORS).map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <select value={status} onChange={e => setStatus(e.target.value)} className="border rounded p-2">
          <option value="all">All Status</option>
          {["Active", "Inactive", "Pending"].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Section: Participant List */}
      {loading ? (
        <div className="flex justify-center p-20">Loading...</div>
      ) : filteredParticipants.length ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredParticipants.map(p => (
            <ParticipantCard key={p.id} participant={p} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}

/* ===== Subcomponents ===== */
const Stat = ({ icon, label, value }) => (
  <div className="bg-white p-4 rounded shadow flex items-center gap-3">
    {icon}
    <div>
      <p className="text-sm text-gray-600">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

const ParticipantCard = ({ participant: p }) => (
  <div className="bg-white rounded shadow hover:shadow-lg transition">
    <div className="p-4 flex items-center gap-3 border-b">
      <img src={p.avatar} alt={p.name} className="w-12 h-12 rounded-full" />
      <div>
        <h3 className="font-semibold">{p.name}</h3>
        <div className="flex gap-2 mt-1">
          <Badge color={ROLE_COLORS[p.role]}>{p.role}</Badge>
          <Badge color={EXP_COLORS[p.experience]}>{p.experience}</Badge>
        </div>
      </div>
    </div>
    <div className="p-4 space-y-2">
      <Info icon={<Mail />} text={p.email} />
      <Info icon={<Phone />} text={p.phone} />
      <div>
        <p className="font-medium">Skills</p>
        <div className="flex flex-wrap gap-1">
          {p.skills.map((s, i) => <Badge key={i} color="bg-gray-100 text-gray-700">{s}</Badge>)}
        </div>
      </div>
      {p.team && <p className="text-sm">Team: {p.team}</p>}
      <p className="text-xs text-gray-500">Registered: {new Date(p.registrationDate).toLocaleDateString()}</p>
    </div>
  </div>
);

const Info = ({ icon, text }) => (
  <div className="flex items-center gap-2 text-sm text-gray-600">
    {icon}
    {text}
  </div>
);

const JudgeList = () => (
  <>
    <Judge name="Dr. Emily Rogers" status="Active" color="bg-green-100 text-green-800" />
    <Judge name="Mr. Carlos Diaz" status="Pending" color="bg-blue-100 text-blue-800" />
  </>
);

const Judge = ({ name, status, color }) => (
  <div className="flex justify-between border p-3 rounded mb-2">
    <p>{name}</p>
    <Badge color={color}>{status}</Badge>
  </div>
);

const VolunteerList = () => (
  <>
    <Volunteer name="Sarah Lee" task="Registration Desk" />
    <Volunteer name="James Smith" task="Tech Support" />
  </>
);

const Volunteer = ({ name, task }) => (
  <div className="border p-3 rounded mb-2">
    <p className="font-medium">{name}</p>
    <p className="text-sm text-gray-500">{task}</p>
  </div>
);

const EmptyState = () => (
  <div className="text-center py-12">
    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
    <h3 className="text-lg font-medium">No participants found</h3>
    <p className="text-gray-600">Try adjusting your search or filter.</p>
  </div>
);
