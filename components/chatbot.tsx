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
  GraduationCapIcon,
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
      text: 'Hello! Welcome to **EduPulse Academic Support**. I am your AI-powered assistant with real-time access to the platform database.\n\nHow can I assist you today?',
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

    const history = messages.map((m) => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text,
    }));

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    const botId = `b-${Date.now()}`;
    const botTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Don't push the bot bubble yet — show only the thinking dots
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
        setMessages((prev) => [
          ...prev,
          {
            id: botId,
            sender: 'bot',
            text: `⚠️ ${errData.error || 'The AI engine is currently unavailable. Please try again later.'}`,
            timestamp: botTimestamp,
            streaming: false,
          },
        ]);
        setIsTyping(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';
      let bubbleCreated = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split('\n')) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (data === '[DONE]') break;

          let token = '';
          try {
            const parsed = JSON.parse(data);
            token = parsed.token ?? parsed.content ?? '';
          } catch {
            token = data;
          }

          if (!token) continue;
          accumulated += token;

          if (!bubbleCreated) {
            // Create the bubble only when the first real token arrives
            bubbleCreated = true;
            setMessages((prev) => [
              ...prev,
              { id: botId, sender: 'bot', text: accumulated, timestamp: botTimestamp, streaming: true },
            ]);
          } else {
            setMessages((prev) =>
              prev.map((m) => (m.id === botId ? { ...m, text: accumulated } : m))
            );
          }
        }
      }

      // If we never got any token (empty response), show a fallback
      if (!bubbleCreated) {
        setMessages((prev) => [
          ...prev,
          { id: botId, sender: 'bot', text: '_(No response received. Please try again.)_', timestamp: botTimestamp, streaming: false },
        ]);
      } else {
        setMessages((prev) =>
          prev.map((m) => (m.id === botId ? { ...m, streaming: false } : m))
        );
      }
    } catch (err: unknown) {
      if ((err as Error).name !== 'AbortError') {
        setMessages((prev) => [
          ...prev,
          {
            id: botId,
            sender: 'bot',
            text: '⚠️ The AI engine is currently unavailable. Please ensure the Python engine is running.',
            timestamp: botTimestamp,
            streaming: false,
          },
        ]);
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
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-blue-800 text-white rounded-full flex items-center justify-center shadow-xl hover:bg-blue-700 transition duration-300 hover:scale-105 focus:outline-none cursor-pointer"
        aria-label="Toggle AI support chatbot"
      >
        {isOpen ? <XIcon className="w-5 h-5" /> : <MessageSquareIcon className="w-5 h-5" />}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-[340px] md:w-[420px] h-[560px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">

          {/* Header */}
          <div className="bg-blue-800 text-white p-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-blue-900/60 flex items-center justify-center border border-blue-400/30 flex-shrink-0">
                <GraduationCapIcon className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm leading-none">EduPulse AI Assistant</p>
                <div className="flex items-center space-x-1.5 mt-1">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
                  <span className="text-[11px] text-blue-200 truncate">AI-Powered · Real-time DB Access</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-blue-100 hover:text-white transition cursor-pointer flex-shrink-0 ml-2">
              <XIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white min-h-0">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  msg.sender === 'bot'
                    ? 'bg-blue-50 text-blue-800 border border-blue-100'
                    : 'bg-slate-100 text-slate-800 border border-slate-200'
                }`}>
                  {msg.sender === 'bot' ? <BotIcon className="w-3.5 h-3.5" /> : <UserIcon className="w-3.5 h-3.5" />}
                </div>

                {/* Bubble */}
                <div className="min-w-0 max-w-[82%]">
                  <div className={`px-3 py-2.5 rounded-2xl text-sm break-words ${
                    msg.sender === 'bot'
                      ? 'bg-white border border-slate-200 text-slate-900 rounded-tl-none shadow-sm'
                      : 'bg-blue-800 text-white rounded-tr-none'
                  }`}>
                    {msg.sender === 'bot' ? (
                      <div className="prose prose-sm max-w-none
                        prose-p:my-1 prose-p:leading-relaxed
                        prose-headings:font-bold prose-headings:text-slate-900 prose-headings:my-1
                        prose-h1:text-base prose-h2:text-sm prose-h3:text-sm
                        prose-strong:text-slate-900 prose-strong:font-semibold
                        prose-em:text-slate-700
                        prose-code:text-blue-800 prose-code:bg-blue-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
                        prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:rounded-xl prose-pre:p-3 prose-pre:overflow-x-auto prose-pre:text-xs prose-pre:my-2
                        prose-ul:my-1 prose-ul:pl-4 prose-li:my-0.5 prose-li:text-slate-800
                        prose-ol:my-1 prose-ol:pl-4
                        prose-a:text-blue-600 prose-a:underline
                        prose-blockquote:border-l-2 prose-blockquote:border-blue-300 prose-blockquote:pl-3 prose-blockquote:text-slate-600 prose-blockquote:italic
                        prose-table:text-xs prose-table:w-full prose-th:bg-slate-50 prose-th:px-2 prose-th:py-1 prose-td:px-2 prose-td:py-1 prose-td:border prose-td:border-slate-200 prose-th:border prose-th:border-slate-200
                        [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.text}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <span className="text-sm leading-relaxed">{msg.text}</span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-0.5 block px-1">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {/* Thinking dots — shown only while waiting for first token */}
            {isTyping && (
              <div className="flex items-start gap-2">
                <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-800 flex items-center justify-center flex-shrink-0 border border-blue-100 mt-0.5">
                  <BotIcon className="w-3.5 h-3.5" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-3 py-3 shadow-sm flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.15s]" />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.3s]" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick prompts */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 flex gap-2 overflow-x-auto scrollbar-none flex-shrink-0">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                disabled={isTyping}
                className="text-[11px] bg-slate-50 border border-slate-200 text-blue-800 px-2.5 py-1 rounded-full hover:bg-blue-50 hover:border-blue-200 transition flex-shrink-0 font-medium cursor-pointer disabled:opacity-40 whitespace-nowrap"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 flex-shrink-0">
            <input
              type="text"
              placeholder="Ask the AI assistant..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isTyping}
              className="flex-1 min-w-0 px-4 py-2 border border-slate-200 rounded-full text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-white text-slate-900 disabled:opacity-60"
            />
            <button
              onClick={() => handleSendMessage(inputVal)}
              disabled={!inputVal.trim() || isTyping}
              className="w-9 h-9 rounded-full bg-blue-800 text-white flex items-center justify-center hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer flex-shrink-0"
            >
              <SendIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
