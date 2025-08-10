import Card from "./Card";
import Badge from "./Badge";

const PersonnelTab = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <Card title="Judges" description="Assigned to review submissions">
      <div className="flex justify-between border p-3 rounded mb-2">
        <p>Dr. Emily Rogers</p>
        <Badge color="green">Active</Badge>
      </div>
      <div className="flex justify-between border p-3 rounded mb-2">
        <p>Mr. Carlos Diaz</p>
        <Badge color="blue">Pending</Badge>
      </div>
    </Card>

    <Card title="Volunteers" description="Assisting in events">
      <div className="border p-3 rounded mb-2">
        <p className="font-medium">Sarah Lee</p>
        <p className="text-sm text-gray-500">Registration Desk</p>
      </div>
      <div className="border p-3 rounded mb-2">
        <p className="font-medium">James Smith</p>
        <p className="text-sm text-gray-500">Tech Support</p>
      </div>
    </Card>
  </div>
);

export default PersonnelTab;
