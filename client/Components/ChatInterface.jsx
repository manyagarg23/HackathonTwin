import React, { useState, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE_URL = 'http://localhost:8000/api';

  // Initialize chat session on component mount
  useEffect(() => {
    initializeChat();
  }, []);

  const initializeChat = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/new`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to initialize chat');
      }
      
      const data = await response.json();
      setSessionId(data.session_id);
      
      // Add the welcome message to the chat
      setMessages([{
        id: '1',
        text: data.response,
        sender: 'agent',
      }]);
      
    } catch (error) {
      console.error('Error initializing chat:', error);
      // Fallback message if API is not available
      setMessages([{
        id: '1',
        text: "Hello! I'm your hackathon setup assistant. I'll help you gather all the important details to create an amazing hackathon. Let's start with the basics - what's the name of your hackathon?",
        sender: 'agent',
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessageToAPI = async (message) => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          session_id: sessionId,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      const data = await response.json();
      return data.response;
      
    } catch (error) {
      console.error('Error sending message:', error);
      return "I'm sorry, I'm having trouble connecting right now. Please try again.";
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    const messageText = inputValue;
    const userMessage = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Get response from API
    const agentResponseText = await sendMessageToAPI(messageText);
    
    const agentResponse = {
      id: (Date.now() + 1).toString(),
      text: agentResponseText,
      sender: 'agent',
    };
    
    setMessages(prev => [...prev, agentResponse]);
    setIsTyping(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 text-black bg-white border border-gray-300 rounded">
        <div className="h-96 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-2"></div>
            <p>Initializing chat...</p>
          </div>
        </div>
      </div>
    );
  }

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
