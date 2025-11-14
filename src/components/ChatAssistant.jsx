// src/components/ChatAssistant.jsx
"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, X, Send, Bot, User, Loader2 } from "lucide-react";

const ChatAssistant = ({ apiKey }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        { role: 'assistant', content: "Hello! How can I help you with the library's collection today?" }
      ]);
    }
    scrollToBottom();
  }, [isOpen, messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    
    // Create the new messages array *before* the API call
    const newMessages = [...messages, userMessage];

    // Update the UI immediately
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        // Send the entire message history
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok || !response.body) {
        throw new Error('Network response was not ok');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';
      
      // Add a new bot message placeholder
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullResponse += decoder.decode(value, { stream: true });
        
        // Update the last message (the bot's) with the new content
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].content = fullResponse;
          return newMessages;
        });
      }

    } catch (error) {
      const errorMessage = { role: 'assistant', content: "Sorry, I couldn't get a response. Please try again." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-8 right-8 z-50">
        <Button onClick={() => setIsOpen(true)} className="rounded-full w-16 h-16 bg-green-500 hover:bg-green-600 shadow-lg">
          <MessageSquare className="h-8 w-8 text-white" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-8 right-8 z-50 w-[calc(100vw-4rem)] h-[calc(100vh-4rem)] md:w-96 md:h-[700px] max-h-[80vh] bg-gray-950/90 backdrop-blur-lg border border-gray-800 rounded-2xl shadow-2xl flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800 flex-shrink-0">
        <h3 className="font-semibold text-white">Library Assistant</h3>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}><X className="h-5 w-5 text-gray-400" /></Button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-6">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'assistant' && <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0"><Bot className="h-5 w-5 text-green-400" /></div>}
              <div className={`max-w-xs md:max-w-sm p-3 rounded-xl ${msg.role === 'user' ? 'bg-green-600/40 text-white' : 'bg-gray-800 text-gray-300'}`}>
                <p className="text-sm">{msg.content}</p>
                {msg.sources && (
                  <div className="mt-3 border-t border-gray-700 pt-2">
                    <h4 className="text-xs font-bold text-gray-400 mb-2">Sources:</h4>
                    <ul className="space-y-2">
                      {msg.sources.map((source, i) => (
                        <li key={i} className="text-xs text-gray-500 bg-gray-900/50 p-2 rounded-md truncate">{source.excerpt}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              {msg.role === 'user' && <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0"><User className="h-5 w-5" /></div>}
            </div>
          ))}
          {loading && <div className="flex items-start gap-3"><div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0"><Loader2 className="h-5 w-5 text-green-400 animate-spin" /></div><div className="max-w-xs p-3 rounded-xl bg-gray-800 text-gray-300">...</div></div>}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-800">
        <div className="relative">
          <Input 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            onKeyPress={(e) => e.key === 'Enter' && handleSend()} 
            placeholder="Ask a question..." 
            className="bg-gray-800 border-gray-700 pr-12 text-white"
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
