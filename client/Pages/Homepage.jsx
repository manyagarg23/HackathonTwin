import { useState } from 'react';
import ChatInterface from '../Components/ChatInterface.jsx'
import HeroSection from '../Components/ui/HeroSection.jsx';

function Homepage() {
  const [showChat, setShowChat] = useState(false);

  const handleGetStarted = () => {
    setShowChat(true);
  };

  if (showChat) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="w-full max-w-6xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
              Hackathon Portal Generator
            </h2>
            <p className="text-muted-foreground">
              Tell me about your hackathon and I'll create the perfect portal for you
            </p>
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

  // This will be shown when showChat is false
  // return (
  //   <div className="min-h-screen bg-background p-6 flex items-center justify-center">
  //     <button
  //       onClick={handleGetStarted}
  //       className="bg-primary text-primary-foreground px-6 py-3 rounded-lg shadow-lg hover:shadow-xl"
  //     >
  //       Get Started
  //     </button>
  //   </div>
  // );

  return <HeroSection onGetStarted={handleGetStarted} />;

}
export default Homepage;