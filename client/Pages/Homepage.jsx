import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatInterface from '../Components/ChatInterface.jsx';
import HeroSection from '../Components/ui/HeroSection.jsx';

function Homepage() {
  const [showChat, setShowChat] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

  const handleGetStarted = () => {
    navigate("/adminsignup"); // Redirect to Admin Signup
  };

  if (showChat) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="w-full max-w-6xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
              Hackathon Portal Generator
            </h2>
          </div>
          <ChatInterface />
          <div className="text-center mt-6">
            <button 
              onClick={() => setShowChat(false)}
              className="text-primary hover:text-primary-glow transition-colors text-sm"
            >
              ← Back to home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <HeroSection onGetStarted={handleGetStarted} />;
}

export default Homepage;
