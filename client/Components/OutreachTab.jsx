import Card from "./Card";
import Badge from "./Badge";

const OutreachTab = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <Card title="Sponsor Management" description="Track sponsors">
      <div className="flex items-center justify-between border p-3 rounded mb-2">
        <div>
          <p className="font-medium">TechCorp Inc.</p>
          <p className="text-sm text-gray-500">Gold Sponsor - $50,000</p>
        </div>
        <Badge color="green">Confirmed</Badge>
      </div>
      <div className="flex items-center justify-between border p-3 rounded mb-2">
        <div>
          <p className="font-medium">DevTools Ltd.</p>
          <p className="text-sm text-gray-500">Silver Sponsor - $25,000</p>
        </div>
        <Badge color="yellow">Pending</Badge>
      </div>
    </Card>
    <Card title="Email Campaigns" description="Manage communications">
      <div className="border p-3 rounded mb-2">
        <div className="flex justify-between mb-1">
          <p className="font-medium">Welcome Email</p>
          <Badge color="blue">Sent</Badge>
        </div>
        <p className="text-sm text-gray-500">Sent to 234 participants</p>
      </div>
    </Card>
  </div>
);

export default OutreachTab;
