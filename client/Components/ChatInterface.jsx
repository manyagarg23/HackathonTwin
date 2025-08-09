import React, { useState } from 'react';
import { Send, Bot, User } from 'lucide-react';

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: "Hello! I'm your hackathon portal agent. I'll help you create a custom hackathon portal by gathering some details. Let's start with the basics - what's the name of your hackathon?",
      sender: 'agent',
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const hackathonQuestions = [
    "What's the name of your hackathon?",
    "When will it take place? (dates)",
    "Where is it located or is it virtual?", 
    "What's the theme or focus area?",
    "How many participants are you expecting?",
    "What are the main prizes or rewards?",
    "Any specific technologies or requirements?"
  ];

  const getAgentResponse = (userMessage, messageCount) => {
    const responses = [
      `Great! "${userMessage}" sounds like an exciting hackathon. Now, when will it take place?`,
      `Perfect timing! And where will "${messages[1]?.text.split('"')[1] || 'your hackathon'}" be held?`,
      `Excellent location choice! What's the main theme or focus area for this hackathon?`,
      `That theme sounds fascinating! How many participants are you expecting?`,
      `Great scale! What prizes or rewards will you be offering to participants?`,
      `Impressive prizes! Are there any specific technologies or requirements participants should know about?`,
      `Perfect! I have all the information I need. Based on your inputs, I'll now generate a custom hackathon portal with registration, project submission, judging criteria, and participant resources. The portal will be tailored specifically for your event!`
    ];
    
    return responses[Math.min(messageCount - 2, responses.length - 1)] || 
           "Thanks for that information! What else can you tell me about your hackathon?";
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const agentResponse = {
        id: (Date.now() + 1).toString(),
        text: getAgentResponse(inputValue, messages.length),
        sender: 'agent',
      };
      
      setMessages(prev => [...prev, agentResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
      <div className="p-6">
        <div className="h-96 overflow-y-auto space-y-4 mb-4 scroll-smooth">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${
                message.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div className={`p-2 rounded-full ${
                message.sender === 'agent' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary text-secondary-foreground'
              }`}>
                {message.sender === 'agent' ? (
                  <Bot className="w-4 h-4" />
                ) : (
                  <User className="w-4 h-4" />
                )}
              </div>
              <div
                className={`max-w-[70%] p-3 rounded-lg ${
                  message.sender === 'agent'
                    ? 'bg-muted text-muted-foreground'
                    : 'bg-primary text-primary-foreground'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <span className="text-xs opacity-70 mt-1 block">
                </span>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-primary text-primary-foreground">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-muted text-muted-foreground p-3 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your response..."
            className="flex-1 bg-input border-border focus:ring-ring"
          />
          <button 
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            variant="default"
            size="icon"
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
  );
};

export default ChatInterface;
