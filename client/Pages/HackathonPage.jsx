import RegisterSection from "../HackathonPageComponents/RegisterSection";

const mockHackathons = {
  "tech-innovate-2024": {
    id: "tech-innovate-2024",
    title: "TechInnovate 2024",
    tagline: "Building the Future, One Hack at a Time",
    description:
      "Join 500+ developers, designers, and entrepreneurs for 48 hours of innovation, learning, and building groundbreaking solutions.",
    startDate: "March 15, 2024",
    endDate: "March 17, 2024",
    location: "Silicon Valley Tech Center",
    prizes: "$50,000 in prizes",
    participants: "500+",
    status: "Registration Open",
    keyDates: [
      { label: "Registration Deadline", date: "March 10, 2024" },
      { label: "Event Starts", date: "March 15, 2024 9:00 AM" },
      { label: "Submission Deadline", date: "March 17, 2024 6:00 PM" },
      { label: "Awards Ceremony", date: "March 17, 2024 8:00 PM" },
    ],
    contact: {
      email: "hello@techinnovate2024.com",
      phone: "+1 (555) 123-4567",
    },
  },
};

export default function HackathonPage() {
//   const { hackathonId } = useParams();
//   const hackathon = hackathonId
//     ? mockHackathons[hackathonId as keyof typeof mockHackathons]
//     : null;

//   if (!hackathon) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold mb-2">Hackathon Not Found</h1>
//           <p>The hackathon you're looking for doesn't exist.</p>
//         </div>
//       </div>
//     );
//   }


const hackathon = mockHackathons["tech-innovate-2024"];
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gray-800 text-white py-16 px-4 text-center">
        <p className="mb-4 font-semibold">{hackathon.status}</p>
        <h1 className="text-4xl font-bold mb-4">{hackathon.title}</h1>
        <p className="text-xl mb-4">{hackathon.tagline}</p>
        <p className="max-w-2xl mx-auto mb-8">{hackathon.description}</p>

        <div className="flex flex-wrap justify-center gap-6 text-sm">
          <span>
            {hackathon.startDate} - {hackathon.endDate}
          </span>
          <span>{hackathon.location}</span>
          <span>{hackathon.participants} Participants</span>
          <span>{hackathon.prizes}</span>
        </div>

      </section>

      {/* Key Dates */}
      <section className="py-12 px-4 bg-gray-100">
        <h2 className="text-2xl font-bold text-center mb-8">
          Important Dates
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {hackathon.keyDates.map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow text-center"
            >
              <h3 className="font-semibold mb-2">{item.label}</h3>
              <p className="text-gray-600">{item.date}</p>
            </div>
          ))}
        </div>
      </section>
      
        {/* Registration Section */}
      <RegisterSection />

      {/* About */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-6">
            About {hackathon.title}
          </h2>
          <p className="mb-8 text-gray-700">{hackathon.description}</p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Network</h3>
              <p>Connect with developers, designers, and entrepreneurs.</p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Compete</h3>
              <p>Win amazing prizes and gain recognition.</p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Learn</h3>
              <p>Attend workshops and mentorship sessions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-12 px-4 bg-gray-100 text-center">
        <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
        <p className="mb-4">Have questions? We're here to help!</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={`mailto:${hackathon.contact.email}`}
            className="border px-6 py-2 rounded hover:bg-gray-200"
          >
            {hackathon.contact.email}
          </a>
          <a
            href={`tel:${hackathon.contact.phone}`}
            className="border px-6 py-2 rounded hover:bg-gray-200"
          >
            {hackathon.contact.phone}
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 border-t text-center text-sm text-gray-500">
        © 2024 {hackathon.title}. All rights reserved.
      </footer>
    </div>
  );
}
