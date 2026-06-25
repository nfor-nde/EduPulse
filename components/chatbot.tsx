'use client';

import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  MessageSquareIcon,
  XIcon,
  SendIcon,
  BotIcon,
  UserIcon,
  GraduationCapIcon
} from '@/components/icons';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  streaming?: boolean;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'bot',
      text: 'Hello! Welcome to the **EduPulse Academic Support**. I am your AI-powered assistant with real-time access to the platform database.\n\nHow can I assist you today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const history = messages.map((m) => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text }));
    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    const botId = `b-${Date.now()}`;
    const botTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => [...prev, { id: botId, sender: 'bot', text: '', timestamp: botTimestamp, streaming: true }]);

    abortRef.current = new AbortController();

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text.trim(), history }),
        signal: abortRef.current.signal,
      });

      if (!res.ok || !res.body) {
        const errData = await res.json().catch(() => ({ error: 'Engine unavailable' }));
        setMessages((prev) =>
          prev.map((m) =>
            m.id === botId
              ? { ...m, text: `⚠️ ${errData.error || 'The AI engine is currently unavailable. Please try again later.'}`, streaming: false }
              : m
          )
        );
        setIsTyping(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        // Parse SSE data lines
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();
            if (data === '[DONE]') break;
            try {
              const parsed = JSON.parse(data);
              const token = parsed.token ?? parsed.content ?? '';
              accumulated += token;
              setMessages((prev) =>
                prev.map((m) => (m.id === botId ? { ...m, text: accumulated } : m))
              );
            } catch {
              // Non-JSON chunk — append raw
              accumulated += data;
              setMessages((prev) =>
                prev.map((m) => (m.id === botId ? { ...m, text: accumulated } : m))
              );
            }
          }
        }
      }

      setMessages((prev) =>
        prev.map((m) => (m.id === botId ? { ...m, streaming: false } : m))
      );
    } catch (err: unknown) {
      if ((err as Error).name !== 'AbortError') {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === botId
              ? { ...m, text: '⚠️ The AI engine is currently unavailable. Please ensure the Python engine is running.', streaming: false }
              : m
          )
        );
      }
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputVal);
    }
  };

  const quickPrompts = [
    'How do I log in?',
    'Tuition fee not updated',
    'Recommend resources for me',
    'What courses are available?',
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Chat button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-blue-800 text-white rounded-full flex items-center justify-center shadow-xl hover:bg-blue-700 transition duration-300 hover:scale-105 focus:outline-none cursor-pointer"
        aria-label="Toggle AI support chatbot"
      >
        {isOpen ? <XIcon className="w-5 h-5" /> : <MessageSquareIcon className="w-5 h-5" />}
      </button>

      {/* Chat window panel */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 md:w-[420px] h-[520px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-blue-800 text-white p-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-blue-900/60 flex items-center justify-center border border-blue-400/30">
                <GraduationCapIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">EduPulse AI Assistant</h3>
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse"></span>
                  <span className="text-xs text-blue-200">AI-Powered · Real-time Database Access</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-blue-100 hover:text-white transition cursor-pointer">
              <XIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start space-x-2 ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.sender === 'bot'
                      ? 'bg-blue-50 text-blue-800 border border-blue-100'
                      : 'bg-slate-100 text-slate-800 border border-slate-200'
                  }`}
                >
                  {msg.sender === 'bot' ? <BotIcon className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
                </div>
                <div className="max-w-[80%]">
                  <div
                    className={`p-3 rounded-2xl text-sm ${
                      msg.sender === 'bot'
                        ? 'bg-white border border-slate-200 text-slate-900 rounded-tl-none shadow-sm'
                        : 'bg-blue-800 text-white rounded-tr-none'
                    }`}
                  >
                    {msg.sender === 'bot' ? (
                      <div className="prose prose-sm max-w-none prose-headings:text-slate-900 prose-p:text-slate-800 prose-strong:text-slate-900 prose-code:text-blue-800 prose-code:bg-blue-50 prose-code:px-1 prose-code:rounded prose-a:text-blue-700 prose-ul:text-slate-800 prose-ol:text-slate-800">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.text || (msg.streaming ? '▌' : '')}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      msg.text
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block px-1">{msg.timestamp}</span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-start space-x-2">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-800 flex items-center justify-center flex-shrink-0 border border-blue-100">
                  <BotIcon className="w-4 h-4" />
                </div>
                <div className="bg-white border border-slate-200 text-slate-500 rounded-2xl rounded-tl-none p-3 shadow-sm flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick prompts */}
          <div className="px-4 py-2 bg-white border-t border-slate-200 overflow-x-auto flex space-x-2 scrollbar-none whitespace-nowrap flex-shrink-0">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                disabled={isTyping}
                className="text-xs bg-white border border-slate-200 text-blue-800 px-3 py-1.5 rounded-full hover:bg-blue-50 transition active:scale-95 flex-shrink-0 font-medium cursor-pointer disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input field */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2 flex-shrink-0">
            <input
              type="text"
              placeholder="Ask the AI assistant..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isTyping}
              className="flex-1 px-4 py-2 border border-slate-200 rounded-full text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-white text-slate-900 disabled:opacity-60"
            />
            <button
              onClick={() => handleSendMessage(inputVal)}
              disabled={!inputVal.trim() || isTyping}
              className="w-9 h-9 rounded-full bg-blue-800 text-white flex items-center justify-center hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer"
            >
              <SendIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
