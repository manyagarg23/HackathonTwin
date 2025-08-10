import { useState, useEffect } from "react";
import { Users, UserPlus, Users2, Target, Zap, RefreshCw } from "lucide-react";

// --- Helper Components ---
function StatsCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow border flex items-center">
      <Icon className={`h-8 w-8 ${color}`} />
      <div className="ml-3">
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function CreateTeamModal({ onCreate, onClose }) {
  const [name, setName] = useState("");
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-96">
        <h3 className="text-lg font-semibold mb-4">Create New Team</h3>
        <input
          className="w-full px-3 py-2 border rounded-lg mb-4"
          placeholder="Team Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="flex space-x-3">
          <button
            onClick={() => { if (name.trim()) onCreate(name); }}
            className="flex-1 px-4 py-2 bg-black text-white rounded-lg"
          >
            Create
          </button>
          <button onClick={onClose} className="flex-1 px-4 py-2 border rounded-lg">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function TeamCard({ team, teamSize, unassigned, onRemoveMember, onAddMember }) {
  return (
    <div className="bg-white rounded-lg shadow border">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">{team.name}</h3>
        <p className="text-sm text-gray-600">Project: {team.project}</p>
      </div>
      <div className="p-4">
        {team.members.map(m => (
          <div key={m.id} className="flex justify-between items-center bg-gray-50 p-2 rounded mb-2">
            <span>{m.name} • {m.experience}</span>
            <button onClick={() => onRemoveMember(m.id, team.id)} className="text-red-600">Remove</button>
          </div>
        ))}
        {team.members.length < teamSize && (
          <select
            onChange={(e) => {
              if (e.target.value) onAddMember(Number(e.target.value), team.id);
              e.target.value = "";
            }}
            className="w-full px-3 py-2 border rounded-lg mt-3"
          >
            <option value="">Add member...</option>
            {unassigned.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        )}
      </div>
    </div>
  );
}

function ParticipantCard({ participant, teams, teamSize, onAdd }) {
  return (
    <div className="bg-white rounded-lg shadow border p-4">
      <h4 className="font-medium">{participant.name}</h4>
      <p className="text-sm text-gray-600">{participant.role} • {participant.experience}</p>
      <select
        onChange={(e) => {
          if (e.target.value) onAdd(participant.id, Number(e.target.value));
          e.target.value = "";
        }}
        className="w-full px-3 py-2 border rounded-lg mt-3"
      >
        <option value="">Add to team...</option>
        {teams.map(t => (
          <option key={t.id} value={t.id}>
            {t.name} ({t.members.length}/{teamSize})
          </option>
        ))}
      </select>
    </div>
  );
}

// --- Main Page ---
export default function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [unassigned, setUnassigned] = useState([]);
  const [teamSize, setTeamSize] = useState(4);
  const [showModal, setShowModal] = useState(false);
  const [autoGrouping, setAutoGrouping] = useState(false);

  useEffect(() => {
    setTeams(mockTeams);
    setUnassigned(mockUnassigned);
  }, []);

  const handleCreateTeam = (name) => {
    setTeams([...teams, { id: Date.now(), name, members: [], project: "TBD", status: "Forming" }]);
    setShowModal(false);
  };

  const addMember = (pid, tid) => {
    const p = unassigned.find(x => x.id === pid);
    setUnassigned(unassigned.filter(x => x.id !== pid));
    setTeams(teams.map(t => t.id === tid ? { ...t, members: [...t.members, p] } : t));
  };

  const removeMember = (pid, tid) => {
    const t = teams.find(t => t.id === tid);
    const m = t.members.find(x => x.id === pid);
    setTeams(teams.map(t => t.id === tid ? { ...t, members: t.members.filter(x => x.id !== pid) } : t));
    setUnassigned([...unassigned, m]);
  };

  const autoGroup = () => {
    setAutoGrouping(true);
    setTimeout(() => {
      let newTeams = [...teams];
      let rem = [...unassigned];
      while (rem.length >= teamSize) {
        newTeams.push({
          id: Date.now() + Math.random(),
          name: `Team ${newTeams.length + 1}`,
          members: rem.splice(0, teamSize),
          project: "TBD"
        });
      }
      setTeams(newTeams);
      setUnassigned(rem);
      setAutoGrouping(false);
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard icon={Users} label="Teams" value={teams.length} color="text-blue-600" />
        <StatsCard icon={Users2} label="Members" value={teams.reduce((a, t) => a + t.members.length, 0)} color="text-green-600" />
        <StatsCard icon={UserPlus} label="Unassigned" value={unassigned.length} color="text-purple-600" />
        <StatsCard icon={Target} label="Team Size" value={teamSize} color="text-orange-600" />
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        <select value={teamSize} onChange={(e) => setTeamSize(Number(e.target.value))} className="border rounded px-3 py-2">
          {[2,3,4,5,6].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <button
          onClick={autoGroup}
          disabled={autoGrouping || unassigned.length < teamSize}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          {autoGrouping ? <RefreshCw className="animate-spin h-4 w-4" /> : <Zap className="h-4 w-4" />}
          {autoGrouping ? "Grouping..." : "Auto-Group"}
        </button>
        <button onClick={() => setShowModal(true)} className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <UserPlus className="h-4 w-4" /> Create Team
        </button>
      </div>

      {/* Teams */}
      <div className="grid md:grid-cols-2 gap-4">
        {teams.map(team => (
          <TeamCard key={team.id} team={team} teamSize={teamSize} unassigned={unassigned} onRemoveMember={removeMember} onAddMember={addMember} />
        ))}
      </div>

      {/* Unassigned */}
      <h2 className="text-xl font-bold">Unassigned Participants</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {unassigned.map(p => (
          <ParticipantCard key={p.id} participant={p} teams={teams} teamSize={teamSize} onAdd={addMember} />
        ))}
      </div>

      {showModal && <CreateTeamModal onCreate={handleCreateTeam} onClose={() => setShowModal(false)} />}
    </div>
  );
}

// --- Mock Data ---
const mockTeams = [
  { id: 1, name: "Team Alpha", members: [], project: "AI Sustainability", status: "Active" }
];

const mockUnassigned = [
  { id: 9, name: "Lisa Zhang", role: "Hacker", skills: ["Python"], experience: "Advanced" }
];
