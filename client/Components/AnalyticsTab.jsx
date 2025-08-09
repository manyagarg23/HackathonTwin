import Card from "./Card";

const AnalyticsTab = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <Card title="Participant Growth" description="Last 6 months">
      <div className="text-4xl font-bold">+32%</div>
      <p className="text-sm text-gray-500">Compared to previous period</p>
    </Card>
    <Card title="Top Categories" description="Most popular project topics">
      <ul className="list-disc list-inside text-sm text-gray-700">
        <li>Artificial Intelligence</li>
        <li>Blockchain</li>
        <li>Health Tech</li>
      </ul>
    </Card>
    <Card title="Engagement Rate" description="Event participation rate">
      <div className="text-4xl font-bold">87%</div>
      <p className="text-sm text-gray-500">Across all events</p>
    </Card>
  </div>
);

export default AnalyticsTab;
