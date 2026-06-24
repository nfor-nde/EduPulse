'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Check, GraduationCap } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'bot',
      text: 'Hello! Welcome to EduPulse UB Support. How can I assist you today?',
      timestamp: '10:00 AM',
    },
    {
      id: 'm2',
      sender: 'bot',
      text: 'You can ask me about Tuition Fees, Medical Clearance, Course Registration, or resetting your Institutional Email.',
      timestamp: '10:00 AM',
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    // Simulate bot thinking and responding
    setTimeout(() => {
      setIsTyping(false);
      let reply = 'Thank you for your query. An agent will be notified.';
      
      const lowerText = text.toLowerCase();
      if (lowerText.includes('tuition') || lowerText.includes('fee') || lowerText.includes('pay')) {
        reply = 'To clear tuition fees, make payments through MTN Mobile Money or Orange Money. Once paid, the system updates within 24 hours. If it exceeds, please submit a Support Ticket with your transaction ID.';
      } else if (lowerText.includes('medical') || lowerText.includes('clearance') || lowerText.includes('clinic')) {
        reply = 'Medical clearance requires you to undergo screening at the University Health Center. Once physical files are submitted, the admin clearances will show "Cleared" in your portal.';
      } else if (lowerText.includes('email') || lowerText.includes('office') || lowerText.includes('microsoft')) {
        reply = 'For institutional Office 365 email resets, please submit a Support Ticket in the tickets tab detailing your Matricule and department. An IT support administrator will reset it.';
      } else if (lowerText.includes('matricule') || lowerText.includes('login') || lowerText.includes('password')) {
        reply = 'To log into the Student Portal, use Matricule UB20S1234 and password: password. This is our standard simulated testing account.';
      }

      const botMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        sender: 'bot',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 1200);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage(inputVal);
    }
  };

  const quickPrompts = [
    'How do I log in?',
    'Tuition fee not updated',
    'Pending Medical Clearance status',
    'Reset institutional email',
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Chat button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-blue-800 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition duration-300 hover:scale-105 focus:outline-none"
        aria-label="Toggle support chatbot"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>

      {/* Chat window panel */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 md:w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-blue-800 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-blue-900/60 flex items-center justify-center border border-blue-400/30">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">UB Support Bot</h3>
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse"></span>
                  <span className="text-xs text-blue-200">Online &bull; EduPulse Hub</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-blue-100 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start space-x-2 ${
                  msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.sender === 'bot' ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {msg.sender === 'bot' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>
                <div className="max-w-[75%]">
                  <div
                    className={`p-3 rounded-2xl text-sm ${
                      msg.sender === 'bot'
                        ? 'bg-white border border-gray-100 text-gray-800 rounded-tl-none shadow-sm'
                        : 'bg-blue-800 text-white rounded-tr-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1 block px-1">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-start space-x-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-gray-100 text-gray-500 rounded-2xl rounded-tl-none p-3 shadow-sm flex items-center space-x-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions (only show if no custom user replies yet, or as suggestions) */}
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 overflow-x-auto flex space-x-2 scrollbar-none whitespace-nowrap">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                className="text-xs bg-white border border-gray-200 text-blue-800 px-3 py-1.5 rounded-full hover:bg-blue-50 transition active:scale-95 flex-shrink-0 font-medium"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input field */}
          <div className="p-3 bg-white border-t border-gray-100 flex items-center space-x-2">
            <input
              type="text"
              placeholder="Ask UB Support..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-gray-50"
            />
            <button
              onClick={() => handleSendMessage(inputVal)}
              disabled={!inputVal.trim()}
              className="w-9 h-9 rounded-full bg-blue-800 text-white flex items-center justify-center hover:bg-blue-700 transition disabled:opacity-50 disabled:hover:bg-blue-800"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
