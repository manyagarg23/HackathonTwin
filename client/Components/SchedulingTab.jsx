import Card from "./Card";
import Badge from "./Badge";

const SchedulingTab = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <Card title="Schedule Overview" description="Daily schedule for hackathon">
      <div className="border p-3 rounded mb-2 flex justify-between">
        <div>
          <p className="font-medium">Registration</p>
          <p className="text-sm text-gray-500">8:00 AM - 9:00 AM</p>
        </div>
        <Badge color="green">Done</Badge>
      </div>
      <div className="border p-3 rounded mb-2 flex justify-between">
        <div>
          <p className="font-medium">Workshops</p>
          <p className="text-sm text-gray-500">10:00 AM - 12:00 PM</p>
        </div>
        <Badge color="blue">Ongoing</Badge>
      </div>
    </Card>

    <Card title="Task Assignments" description="Who's responsible for what">
      <div className="border p-3 rounded mb-2">
        <p className="font-medium">John Smith</p>
        <p className="text-sm text-gray-500">MC for opening ceremony</p>
      </div>
      <div className="border p-3 rounded mb-2">
        <p className="font-medium">Sarah Lee</p>
        <p className="text-sm text-gray-500">Workshop coordinator</p>
      </div>
    </Card>
  </div>
);

export default SchedulingTab;
