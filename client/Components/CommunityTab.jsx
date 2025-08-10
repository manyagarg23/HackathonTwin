import Card from "./Card";
import Badge from "./Badge";

const CommunityTab = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <Card title="Community Discussions" description="Latest topics in community tab">
      <div className="border p-3 rounded mb-2 flex justify-between">
        <div>
          <p className="font-medium">Team Formation Help</p>
          <p className="text-sm text-gray-500">5 replies • 2 hrs ago</p>
        </div>
        <Badge color="blue">Active</Badge>
      </div>
      <div className="border p-3 rounded mb-2 flex justify-between">
        <div>
          <p className="font-medium">Sharing Project Ideas</p>
          <p className="text-sm text-gray-500">12 replies • 5 hrs ago</p>
        </div>
        <Badge color="green">Popular</Badge>
      </div>
    </Card>

    <Card title="Community Members" description="Recent signups">
      <ul className="list-disc list-inside text-sm text-gray-700">
        <li>Alice Johnson</li>
        <li>Michael Chen</li>
        <li>Priya Kapoor</li>
      </ul>
    </Card>
  </div>
);

export default CommunityTab;
