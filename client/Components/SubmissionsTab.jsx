import Card from "./Card";
import Badge from "./Badge";

const SubmissionsTab = () => (
  <Card title="Project Submissions" description="Manage hackathon project submissions">
    <div className="border p-3 rounded mb-2 flex justify-between">
      <div>
        <p className="font-medium">Team Alpha</p>
        <p className="text-sm text-gray-500">AI-powered translator</p>
      </div>
      <Badge color="blue">Pending Review</Badge>
    </div>
    <div className="border p-3 rounded mb-2 flex justify-between">
      <div>
        <p className="font-medium">Team Beta</p>
        <p className="text-sm text-gray-500">Blockchain voting app</p>
      </div>
      <Badge color="green">Approved</Badge>
    </div>
    <div className="border p-3 rounded mb-2 flex justify-between">
      <div>
        <p className="font-medium">Team Gamma</p>
        <p className="text-sm text-gray-500">IoT weather monitor</p>
      </div>
      <Badge color="red">Rejected</Badge>
    </div>
  </Card>
);

export default SubmissionsTab;
