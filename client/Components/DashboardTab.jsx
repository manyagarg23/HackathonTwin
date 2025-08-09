import Card from "./Card";

const DashboardTab = () => (
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
);

export default DashboardTab;
