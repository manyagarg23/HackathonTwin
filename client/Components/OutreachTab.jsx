import { useState, useRef } from "react";
import Card from "./Card";
import Badge from "./Badge";
import { Upload, Mail, Users, TrendingUp, Download, Send, AlertCircle, CheckCircle } from "lucide-react";

const OutreachTab = () => {
  const [csvFile, setCsvFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [campaignResults, setCampaignResults] = useState(null);
  const [sampleCsv, setSampleCsv] = useState(null);
  const [showSample, setShowSample] = useState(false);
  const [smtpEmail, setSmtpEmail] = useState("");
  const [smtpPassword, setSmtpPassword] = useState("");
  const [smtpConfigured, setSmtpConfigured] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "text/csv") {
      setCsvFile(file);
      setCampaignResults(null);
    } else {
      alert("Please upload a valid CSV file");
    }
  };

  const downloadSampleCsv = () => {
    const sampleData = `name,email,role,company,phone,notes
John Doe,john@example.com,Software Engineer,TechCorp Inc.,555-0123,Interested in AI/ML
Jane Smith,jane@alumni.edu,Alumni Judge,University,555-0124,Previous hackathon winner
Bob Johnson,bob@sponsor.com,Partnership Manager,SponsorCorp,555-0125,Looking for sponsorship opportunities
Alice Brown,alice@startup.co,Founder,StartupCo,555-0126,Innovation enthusiast
Mike Wilson,mike@corp.com,CTO,EnterpriseCorp,555-0127,Technology leader`;

    const blob = new Blob([sampleData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample_contacts.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const configureSMTP = async () => {
    if (!smtpEmail || !smtpPassword) {
      alert("Please enter both email and password");
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/outreach/configure-smtp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: smtpEmail,
          password: smtpPassword
        }),
      });

      const result = await response.json();
      if (result.success) {
        setSmtpConfigured(true);
        alert("SMTP configured successfully!");
      } else {
        alert(`SMTP configuration failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Error configuring SMTP:', error);
      alert('Failed to configure SMTP');
    }
  };

  const processOutreachCampaign = async () => {
    if (!csvFile) return;

    if (!smtpConfigured) {
      alert("Please configure SMTP credentials first");
      return;
    }

    setIsProcessing(true);
    const formData = new FormData();
    formData.append("file", csvFile);

    try {
      const response = await fetch("http://localhost:8000/api/outreach/upload-csv", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      setCampaignResults(result);
    } catch (error) {
      console.error("Error processing campaign:", error);
      setCampaignResults({
        success: false,
        error: "Failed to process campaign. Please check your SMTP configuration."
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusIcon = (success) => {
    return success ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : (
      <AlertCircle className="h-5 w-5 text-red-500" />
    );
  };

  const getStatusColor = (success) => {
    return success ? "green" : "red";
  };

  return (
    <div className="space-y-6">
      {/* Campaign Management */}
      <Card title="AI-Powered Outreach Campaign" description="Upload CSV and send personalized emails using AI">
        <div className="space-y-4">
          {/* File Upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Upload a CSV file with contact information
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Choose CSV File
              </button>
            </div>
            {csvFile && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700">
                  <CheckCircle className="h-4 w-4 inline mr-2" />
                  {csvFile.name} selected
                </p>
              </div>
            )}
          </div>

          {/* Sample CSV */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">Sample CSV Structure</h4>
              <button
                onClick={downloadSampleCsv}
                className="flex items-center gap-2 px-3 py-1 text-sm bg-white border rounded hover:bg-gray-50"
              >
                <Download className="h-4 w-4" />
                Download Sample
              </button>
            </div>
            <div className="text-xs font-mono bg-white p-3 rounded border overflow-x-auto">
              <pre>{`name,email,role,company,phone,notes
John Doe,john@example.com,Software Engineer,TechCorp Inc.,555-0123,Interested in AI/ML
Jane Smith,jane@alumni.edu,Alumni Judge,University,555-0124,Previous hackathon winner
Bob Johnson,bob@sponsor.com,Partnership Manager,SponsorCorp,555-0125,Looking for sponsorship opportunities`}</pre>
            </div>
          </div>

          {/* Process Button */}
          {csvFile && (
            <button
              onClick={processOutreachCampaign}
              disabled={isProcessing}
              className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Processing Campaign...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  Process & Send Emails
                </>
              )}
            </button>
          )}
        </div>
      </Card>

      {/* Campaign Results */}
      {campaignResults && (
        <Card title="Campaign Results" description="Summary of your outreach campaign">
          {campaignResults.success ? (
            <div className="space-y-4">
              {/* Summary Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {campaignResults.summary?.total_contacts || 0}
                  </div>
                  <div className="text-sm text-blue-600">Total Contacts</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {campaignResults.summary?.emails_sent || 0}
                  </div>
                  <div className="text-sm text-green-600">Emails Sent</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {campaignResults.summary?.participants || 0}
                  </div>
                  <div className="text-sm text-yellow-600">Participants</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {campaignResults.summary?.judges || 0}
                  </div>
                  <div className="text-sm text-purple-600">Judges</div>
                </div>
              </div>

              {/* Detailed Results */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Email Results</h4>
                {campaignResults.results?.map((result, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(result.result.success)}
                        <div>
                          <p className="font-medium text-gray-900">
                            {result.contact.name} ({result.contact.email})
                          </p>
                          <p className="text-sm text-gray-500">
                            {result.contact.role} at {result.contact.company || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge color={getStatusColor(result.result.success)}>
                        {result.result.success ? "Sent" : "Failed"}
                      </Badge>
                      <Badge color="blue">{result.contact_type}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 bg-red-50 rounded-lg">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="h-5 w-5" />
                <span className="font-medium">Campaign Failed</span>
              </div>
              <p className="text-red-600 mt-2">{campaignResults.error}</p>
            </div>
          )}
        </Card>
      )}

      {/* Setup Instructions */}
      <Card title="Setup Instructions" description="Configure SMTP for email functionality">
        <div className="space-y-4">
          {!smtpConfigured ? (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">SMTP Configuration Required</h4>
              <p className="text-sm text-blue-700 mb-3">
                Enter your Gmail credentials to enable email functionality. We'll use Gmail's SMTP server.
              </p>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gmail Address
                  </label>
                  <input
                    type="email"
                    value={smtpEmail}
                    onChange={(e) => setSmtpEmail(e.target.value)}
                    placeholder="your-email@gmail.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    App Password
                  </label>
                  <input
                    type="password"
                    value={smtpPassword}
                    onChange={(e) => setSmtpPassword(e.target.value)}
                    placeholder="Enter your Gmail App Password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    Use an App Password, not your regular password. Generate one at:{" "}
                    <a 
                      href="https://myaccount.google.com/apppasswords" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      myaccount.google.com/apppasswords
                    </a>
                  </p>
                </div>
                
                <button
                  onClick={configureSMTP}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Configure SMTP
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-green-700 mb-2">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">SMTP Configured Successfully!</span>
              </div>
              <p className="text-sm text-green-600">
                Using {smtpEmail} for sending emails. You can now process your outreach campaign.
              </p>
            </div>
          )}
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">How It Works</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• We use Gmail's SMTP server (smtp.gmail.com:587)</li>
              <li>• Your credentials are stored securely for the session</li>
              <li>• All emails will be sent from your Gmail address</li>
              <li>• App passwords are more secure than regular passwords</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default OutreachTab;
