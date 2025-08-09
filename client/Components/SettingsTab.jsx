import Card from "./Card";

const SettingsTab = () => (
  <div className="space-y-6">
    <Card title="Profile Settings" description="Update your admin profile">
      <form className="space-y-3">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input className="w-full border rounded px-2 py-1" defaultValue="Admin User" />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input className="w-full border rounded px-2 py-1" defaultValue="admin@example.com" />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          Save Changes
        </button>
      </form>
    </Card>

    <Card title="System Settings" description="Hackathon configuration">
      <form className="space-y-3">
        <div>
          <label className="block text-sm font-medium">Event Name</label>
          <input className="w-full border rounded px-2 py-1" defaultValue="Hackathon 2025" />
        </div>
        <div>
          <label className="block text-sm font-medium">Timezone</label>
          <select className="w-full border rounded px-2 py-1">
            <option>UTC</option>
            <option>PST</option>
            <option>EST</option>
          </select>
        </div>
        <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">
          Update Settings
        </button>
      </form>
    </Card>
  </div>
);

export default SettingsTab;
