import React from 'react';
import { Sparkles, Zap, ArrowRight } from 'lucide-react';

const HeroSection = ({ onGetStarted }) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white text-black">
      {/* Main Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Tagline */}
        <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 border rounded-full text-sm font-medium">
          <Sparkles className="w-4 h-4" />
          AI-Powered Hackathon Portal Generator
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          Create Your Perfect
          <br />
          Hackathon Portal
        </h1>

        {/* Description */}
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto leading-relaxed">
          Chat with our AI agent to instantly generate a custom hackathon portal with registration, 
          project submission, judging, and participant management.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            onClick={onGetStarted}
            className="bg-black text-white px-8 py-6 text-lg font-semibold group hover:bg-gray-800 transition-all duration-300"
          >
            Start Building Your Portal
            <ArrowRight className="w-5 h-5 ml-2 inline-block group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            className="border px-8 py-6 text-lg font-semibold hover:bg-gray-100 transition-all duration-300"
          >
            <Zap className="w-5 h-5 mr-2 inline-block" />
            See Demo
          </button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {[
            {
              icon: <Sparkles className="w-6 h-6" />,
              title: 'AI-Powered Setup',
              description: 'Just describe your hackathon and get a complete portal',
            },
            {
              icon: <Zap className="w-6 h-6" />,
              title: 'Instant Generation',
              description: 'Your portal is ready in minutes, not days',
            },
            {
              icon: <ArrowRight className="w-6 h-6" />,
              title: 'Fully Customizable',
              description: 'Easily modify and adapt to your specific needs',
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="p-6 border rounded-lg hover:bg-gray-50 transition-all duration-300"
            >
              <div className="mb-3">{feature.icon}</div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
