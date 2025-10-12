// src/components/ChatAssistant.jsx
"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, X, Send, Bot, User, Loader2 } from "lucide-react";
import RippleGrid from '@/blocks/Backgrounds/RippleGrid/RippleGrid';

const ChatAssistant = ({ apiKey }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      setTimeout(() => {
        const botMessage = { 
          role: 'bot', 
          content: "This is a mocked response. The real API call goes here.",
          sources: [{ bookId: '123', excerpt: 'An excerpt from a relevant book...' }]
        };
        setMessages(prev => [...prev, botMessage]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      const errorMessage = { role: 'bot', content: "Sorry, I couldn't get a response. Please try again." };
      setMessages(prev => [...prev, errorMessage]);
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-8 right-8 z-50">
        <Button onClick={() => setIsOpen(true)} className="rounded-full w-16 h-16 bg-green-500 hover:bg-green-600 shadow-lg">
          <MessageSquare className="h-8 w-8" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-8 right-8 z-50 w-[calc(100vw-4rem)] h-[calc(100vh-4rem)] md:w-96 md:h-[600px] border border-gray-800 rounded-xl shadow-2xl flex flex-col overflow-hidden bg-black">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <RippleGrid 
          gridColor="#00ff00"
          rippleIntensity={0.02}
          gridSize={30}
          gridThickness={0.3}
          opacity={1}
          enableRainbow={true}
        />
      </div>
      
      {/* Content Layers (must have higher z-index and transparent backgrounds) */}
      <div className="relative z-10 flex items-center justify-between p-4 border-b border-gray-800 bg-black/30 backdrop-blur-sm">
        <h3 className="font-semibold text-white">Library Assistant</h3>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}><X className="h-5 w-5 text-gray-400" /></Button>
      </div>

      <div className="relative z-10 flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'bot' && <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0"><Bot className="h-5 w-5 text-green-400" /></div>}
              <div className={`max-w-xs md:max-w-sm p-3 rounded-xl bg-black/50 backdrop-blur-md ${msg.role === 'user' ? 'text-white' : 'text-gray-300'}`}>
                <p>{msg.content}</p>
                {msg.sources && (
                  <div className="mt-2 border-t border-gray-700 pt-2">
                    <h4 className="text-xs font-bold text-gray-400 mb-1">Sources:</h4>
                    <ul className="space-y-1">
                      {msg.sources.map((source, i) => (
                        <li key={i} className="text-xs text-gray-500 truncate">{source.excerpt}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              {msg.role === 'user' && <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0"><User className="h-5 w-5" /></div>}
            </div>
          ))}
          {loading && <div className="flex items-start gap-3"><div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0"><Loader2 className="h-5 w-5 text-green-400 animate-spin" /></div><div className="max-w-xs p-3 rounded-xl bg-black/50 text-gray-300">...</div></div>}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="relative z-10 p-4 border-t border-gray-800 bg-black/30 backdrop-blur-sm">
        <div className="relative">
          <Input 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            onKeyPress={(e) => e.key === 'Enter' && handleSend()} 
            placeholder="Ask a question..." 
            className="bg-gray-800 border-gray-700 pr-12"
          />
          <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2" onClick={handleSend} disabled={loading}>
            <Send className="h-5 w-5 text-green-400" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatAssistant;