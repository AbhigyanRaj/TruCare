import React, { useState, useRef, useEffect } from 'react';
import { IoMdClose } from 'react-icons/io';
import { FiSend } from 'react-icons/fi';

// Response patterns for the chatbot
const RESPONSE_PATTERNS = {
  greeting: {
    patterns: ['hi', 'hello', 'hey'],
    response: "Hello! How are you feeling today?"
  },
  help: {
    patterns: ['help', 'support', 'need help'],
    response: "I'm here to listen and support you. Would you like to talk about what's on your mind?"
  },
  sadness: {
    patterns: ['sad', 'depressed', 'unhappy', 'down'],
    response: "I'm sorry to hear that you're feeling this way. Remember, it's okay to feel sad sometimes. Would you like to talk more about what's bothering you?"
  },
  anxiety: {
    patterns: ['anxious', 'anxiety', 'worried', 'stress'],
    response: "Anxiety can be really challenging. Let's take a moment to breathe together. Would you like to try some calming exercises?"
  },
  default: {
    response: "I'm here to listen and support you. Could you tell me more about how you're feeling?"
  }
};

const API_KEY = import.meta.env.VITE_AI_API_KEY || import.meta.env.REACT_APP_AI_API_KEY;

const ChatBot = () => {
  const [messages, setMessages] = useState([
    { 
      text: "Hi! I'm your mental health assistant. How can I help you today?", 
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatRef.current && !chatRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getBotResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    for (const [key, { patterns, response }] of Object.entries(RESPONSE_PATTERNS)) {
      if (patterns && patterns.some(pattern => lowerMessage.includes(pattern))) {
        return response;
      }
    }
    
    return RESPONSE_PATTERNS.default.response;
  };

  const handleSendMessage = async (e, messageText = null) => {
    if (e) {
      e.preventDefault();
    }
    const messageToSend = messageText || inputMessage.trim();

    if (messageToSend) {
      const userMessage = {
        text: messageToSend,
        sender: 'user',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);
      setInputMessage(''); // Clear input after sending
      setIsTyping(true);
      setLoading(true);

      try {
        // Example: Using Google PaLM API (replace with your actual endpoint if different)
        const response = await fetch("https://generativelanguage.googleapis.com/v1beta2/models/chat-bison-001:generateMessage?key=" + API_KEY, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: { messages: [{ content: messageToSend }] },
          }),
        });
        const data = await response.json();
        const aiText = data?.candidates?.[0]?.content || "Sorry, I couldn't get a response.";
        setMessages(prev => [...prev, {
          text: aiText,
          sender: 'bot',
          timestamp: new Date()
        }]);
      } catch (error) {
        setMessages(prev => [...prev, {
          text: "Error: " + error.message,
          sender: 'bot',
          timestamp: new Date()
        }]);
      } finally {
        setIsTyping(false);
        setLoading(false);
      }
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const quickReplies = ["How are you feeling today?", "I need help", "I'm feeling sad", "Tell me about anxiety relief"];

  return (
    <div ref={chatRef} className="fixed bottom-0 right-0 z-50">
      {/* Floating Bot Button */}
      <div 
        className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 transition-transform duration-300 ${
          isOpen ? 'scale-0' : 'scale-100'
        }`}
        onClick={() => setIsOpen(true)}
      >
        <img 
          src="/Bot.png" 
          alt="Chat Bot" 
          className="h-24 sm:h-36 cursor-pointer animate-float"
        />
      </div>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-0 right-0 w-full sm:w-auto transition-all duration-300 p-3 sm:p-10 rounded-2xl ${
          isOpen 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-full pointer-events-none'
        }`}
      >
        <div className="flex flex-col h-[65vh] w-full sm:max-h-[80vh] sm:max-w-[350px] lg:max-w-[500px] bg-white rounded-xl border border-gray-200 shadow-2xl">
          {/* Header */}
          <div className="p-4 bg-green-600 text-white rounded-t-2xl flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img 
                src="/Bot.png" 
                alt="Bot Avatar" 
                className="w-8 h-8 rounded-full"
              />
              <div>
                <h2 className="text-lg font-semibold">Mental Health Assistant</h2>
                <p className="text-xs text-green-100">Online</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-green-100 transition-colors"
              aria-label="Close chat"
            >
              <IoMdClose size={24} />
            </button>
          </div>
          
          {/* Messages Area */}
          <div className="flex-1 p-3 overflow-y-auto bg-gray-50">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  message.sender === 'user' ? 'text-right' : 'text-left'
                }`}
              >
                <div
                  className={`inline-block p-3 rounded-2xl max-w-[75%] ${
                    message.sender === 'user'
                      ? 'bg-green-600 text-white rounded-tr-none border border-green-500'
                      : 'bg-white text-gray-800 rounded-tl-none shadow-sm'
                  }`}
                >
                  <p className="text-sm break-words">{message.text}</p>
                  <span className={`text-xs mt-1 block ${
                    message.sender === 'user' ? 'text-green-100' : 'text-gray-500'
                  }`}>
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="text-left mb-4">
                <div className="inline-block p-3 rounded-2xl bg-white text-gray-800 rounded-tl-none shadow-sm">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            {loading && (
              <div className="text-left mb-4">
                <div className="inline-block p-3 rounded-2xl bg-white text-gray-800 rounded-tl-none shadow-sm">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="p-4 border-t bg-white rounded-b-2xl">
            {window.innerWidth < 768 ? ( // Check for mobile view
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  {quickReplies.map((reply, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={(e) => handleSendMessage(e, reply)}
                      className="px-3.5 py-2.5 border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
                <p className="text-center text-xs text-gray-500 italic mt-2">Voice to chat (under development)</p>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 p-3 border border-gray-200 rounded-full focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                  aria-label="Message input"
                />
                <button
                  type="submit"
                  className="p-3 bg-green-600 text-white rounded-full hover:bg-green-700 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!inputMessage.trim() || loading}
                  aria-label="Send message"
                >
                  <FiSend size={20} />
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatBot; 