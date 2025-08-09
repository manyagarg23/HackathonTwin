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

  const getAgentResponse = (userMessage, messageCount) => {
    const responses = [
      `Great! "${userMessage}" sounds like an exciting hackathon. Now, when will it take place?`,
      `Perfect timing! And where will it be held?`,
      `Excellent location choice! What's the main theme or focus area for this hackathon?`,
      `That theme sounds fascinating! How many participants are you expecting?`,
      `Great scale! What prizes or rewards will you be offering to participants?`,
      `Impressive prizes! Are there any specific technologies or requirements participants should know about?`,
      `Perfect! I have all the information I need. Based on your inputs, I'll now generate a custom hackathon portal.`,
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
    <div className="p-6 text-black bg-white border border-gray-300 rounded">
      <div className="h-96 overflow-y-auto space-y-4 mb-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`p-2 rounded-full border border-gray-500 bg-white`}>
              {message.sender === 'agent' ? (
                <Bot className="w-4 h-4" />
              ) : (
                <User className="w-4 h-4" />
              )}
            </div>
            <div
              className={`max-w-[70%] p-3 rounded-lg border border-gray-300 bg-gray-100`}
            >
              <p className="text-sm">{message.text}</p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full border border-gray-500 bg-white">
              <Bot className="w-4 h-4" />
            </div>
            <div className="border border-gray-300 bg-gray-100 p-3 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-black rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
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
          className="flex-1 border border-gray-400 px-3 py-2 rounded"
        />
        <button
          onClick={handleSendMessage}
          disabled={!inputValue.trim() || isTyping}
          className="border border-gray-600 px-4 py-2 rounded bg-white hover:bg-gray-100"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
