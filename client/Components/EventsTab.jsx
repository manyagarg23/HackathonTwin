import Card from "./Card";
import Badge from "./Badge";

const EventsTab = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <Card title="Hackathon Events" description="Manage upcoming hackathon events">
      <div className="flex items-center justify-between border p-3 rounded mb-2">
        <div>
          <p className="font-medium">Opening Ceremony</p>
          <p className="text-sm text-gray-500">Sept 10, 9:00 AM</p>
        </div>
        <Badge color="blue">Scheduled</Badge>
      </div>
      <div className="flex items-center justify-between border p-3 rounded mb-2">
        <div>
          <p className="font-medium">Idea Pitch Session</p>
          <p className="text-sm text-gray-500">Sept 10, 1:00 PM</p>
        </div>
        <Badge color="green">Confirmed</Badge>
      </div>
    </Card>

    <Card title="Venues" description="Event locations and capacities">
      <div className="border p-3 rounded mb-2">
        <p className="font-medium">Main Hall</p>
        <p className="text-sm text-gray-500">Capacity: 300</p>
      </div>
      <div className="border p-3 rounded mb-2">
        <p className="font-medium">Workshop Room</p>
        <p className="text-sm text-gray-500">Capacity: 80</p>
      </div>
    </Card>
  </div>
);

export default EventsTab;
