"use client";

import React, { useState, useEffect, useRef } from 'react';

type Message = {
  sender: 'user' | 'bot';
  text: string;
  timestamp?: string;
};

// AHroomi fragrance-themed bot responses (shortened)
const getBotResponse = (userMessage: string): string => {
  const message = userMessage.toLowerCase();
  
  if (message.includes("return policy") || message.includes("return")) {
    return "We offer a 30-day return policy for unopened products in original packaging. Contact our customer service team for assistance with returns or exchanges.";
  } else if (message.includes("discount") || message.includes("sale") || message.includes("offer")) {
    return "Yes! Sign up for our newsletter for 15% off your first order. We also have seasonal promotions and a loyalty program with points on every purchase.";
  } else if (message.includes("track") || message.includes("order")) {
    return "Track your order using the number sent to your email or log into your account and visit 'My Orders' for real-time updates on your fragrance delivery.";
  } else if (message.includes("contact") || message.includes("customer service") || message.includes("support")) {
    return "Reach us at support@ahroomi.com or call 1-800-FRAGRANCE (1-800-372-4726) Monday-Friday 9AM-6PM EST. We're here to help you find your perfect scent!";
  } else if (message.includes("recommendation") || message.includes("product")) {
    return "I'd love to help you find your perfect AHroomi fragrance! Do you prefer floral, woody, citrus, or oriental notes? Are you looking for daytime or evening wear?";
  } else {
    // Default responses for other messages
    const defaultResponses = [
      "Thank you for your question about AHroomi! Our fragrances are crafted with the finest ingredients. What would you like to know?",
      "At AHroomi, fragrance is a personal journey. Each scent tells a story and evokes emotions. How can I help you explore our collection?",
      "Our AHroomi collection features scents from fresh and floral to warm and woody. What type of scent are you drawn to?",
      "AHroomi fragrances are expressions of your personality. How can I assist you in finding your signature scent?"
    ];
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  }
};

// Sample suggestions for quick replies
const quickReplies = [
  "What's your return policy?",
  "Do you offer discounts?",
  "Track my order",
  "Contact customer service",
  "Product recommendations"
];

// Function to get time-appropriate greeting
const getTimeBasedGreeting = (): string => {
  const now = new Date();
  const hours = now.getHours();
  
  if (hours < 12) {
    return "Good Morning";
  } else if (hours < 18) {
    return "Good Afternoon";
  } else {
    return "Good Evening";
  }
};

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      sender: 'bot', 
      text: "Welcome to our support center. I'm your virtual assistant here to help you with any questions about products, orders, or services.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messageSequence, setMessageSequence] = useState(0);
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [greeting, setGreeting] = useState("");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Update greeting when chat opens
  useEffect(() => {
    if (isOpen) {
      setGreeting(getTimeBasedGreeting());
    }
  }, [isOpen]);

  // Handle the sequential welcome messages
  useEffect(() => {
    if (isOpen && messageSequence < 3) {
      const timer = setTimeout(() => {
        let messageText = "";
        
        if (messageSequence === 0) {
          messageText = "Hi I'm Renee from AHroomi!";
        } else if (messageSequence === 1) {
          messageText = `${greeting}, how are you doing today?`;
        } else if (messageSequence === 2) {
          messageText = "Welcome to Ahroomi - a world of fragrance!";
        }
        
        setMessages(prev => [...prev, {
          sender: 'bot',
          text: messageText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        
        setMessageSequence(prev => prev + 1);
      }, 1500);
      
      return () => clearTimeout(timer);
    } else if (isOpen && messageSequence === 3) {
      const timer = setTimeout(() => {
        setMessages(prev => [...prev, {
          sender: 'bot',
          text: "How can I help you?",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        setShowQuickReplies(true);
        setMessageSequence(prev => prev + 1);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, messageSequence, greeting]);

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;

    const userMessage: Message = { 
      sender: 'user', 
      text: inputText,
      timestamp: getCurrentTime()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botMessage: Message = {
        sender: 'bot',
        text: getBotResponse(inputText),
        timestamp: getCurrentTime()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickReply = (reply: string) => {
    const userMessage: Message = { 
      sender: 'user', 
      text: reply,
      timestamp: getCurrentTime()
    };
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    setTimeout(() => {
      const botMessage: Message = {
        sender: 'bot',
        text: getBotResponse(reply),
        timestamp: getCurrentTime()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      { 
        sender: 'bot', 
        text: "Welcome to our support center. I'm your virtual assistant here to help you with any questions about products, orders, or services.",
        timestamp: getCurrentTime()
      }
    ]);
    setMessageSequence(0);
    setShowQuickReplies(false);
  };

  // Reset message sequence when chat is closed
  useEffect(() => {
    if (!isOpen) {
      setMessageSequence(0);
      setShowQuickReplies(false);
    }
  }, [isOpen]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl w-[380px] mb-4 flex flex-col h-[500px] border border-gray-100 overflow-hidden transform transition-all duration-300 ease-out animate-fadeIn">
          {/* Header with linear linear */}
          <div className="bg-linear-to-r from-[#22a6dd] to-[#1a8bc7] text-white p-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h3 className="font-bold text-lg">AHroomi Help Center</h3>
                <p className="text-sm text-white/80">Online • Ready to help</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={clearChat}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                title="Clear chat"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-linear-to-b from-gray-50 to-white">
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] ${msg.sender === 'user' ? 'ml-auto' : 'mr-auto'}`}>
                    <div className={`relative rounded-2xl p-2 ${msg.sender === 'user' 
                      ? 'bg-linear-to-r from-[#22a6dd] to-[#1a8bc7] text-white rounded-br-none shadow-md' 
                      : 'bg-white text-gray-800 rounded-bl-none border border-gray-100 shadow-sm'
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>
                      <div className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-white/70' : 'text-gray-400'}`}>
                        {msg.timestamp}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] mr-auto">
                    <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none p-4 shadow-sm">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-75"></div>
                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-150"></div>
                        <span className="ml-2 text-sm text-gray-500">Typing...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Show quick replies after all welcome messages have been sent */}
              {showQuickReplies && (
                <div className="mt-3 mb-4">
                  <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
                  <div className="flex flex-wrap gap-2">
                    {quickReplies.map((reply, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleQuickReply(reply)}
                        className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs text-gray-700 hover:bg-gray-50 hover:border-[#22a6dd] transition-all duration-200"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-100 p-4 bg-white">
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#22a6dd]/30 focus:border-[#22a6dd] transition-all duration-200"
                  placeholder="Type your message here..."
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                  <button className="p-1.5 hover:bg-gray-200 rounded-full transition-colors">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                  </button>
                </div>
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
                className={`p-3 rounded-full ${inputText.trim() 
                  ? 'bg-linear-to-r from-[#22a6dd] to-[#1a8bc7] hover:from-[#1a8bc7] hover:to-[#22a6dd] shadow-md' 
                  : 'bg-gray-300 cursor-not-allowed'
                } text-white transition-all duration-200 transform hover:scale-105`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-gray-400 text-center mt-2">
              Press <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600">Enter</kbd> to send
            </p>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`bg-linear-to-r from-[#22a6dd] to-[#1a8bc7] text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform ${isOpen ? 'rotate-90' : 'hover:scale-110'} focus:outline-none focus:ring-4 focus:ring-[#22a6dd]/30`}
      >
        {isOpen ? (
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <div className="relative">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {messages.length > 1 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold animate-pulse">
                {messages.length - 1}
              </div>
            )}
          </div>
        )}
      </button>
    </div>
  );
};

export default ChatBot;