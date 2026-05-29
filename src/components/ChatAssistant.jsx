// src/components/ChatAssistant.jsx
"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { ChatCircle, X, PaperPlaneRight, Robot, User, SpinnerGap } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";

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
        { role: 'assistant', content: "Hello! How can I help you find the perfect book from our catalog today?" }
      ]);
    }
    scrollToBottom();
  }, [isOpen, messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];

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
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok || !response.body) {
        throw new Error('Network response was not ok');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';
      
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullResponse += decoder.decode(value, { stream: true });
        
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].content = fullResponse;
          return newMessages;
        });
        scrollToBottom();
      }

    } catch (error) {
      const errorMessage = { role: 'assistant', content: "Sorry, I couldn't get a response. Please try again." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-8 right-8 z-50"
          >
            <button 
              onClick={() => setIsOpen(true)} 
              className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-[#050505]/80 text-white shadow-2xl backdrop-blur-xl transition-transform hover:scale-105 hover:bg-white/10"
            >
              <ChatCircle weight="duotone" className="h-8 w-8" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-8 right-8 z-50 flex h-[calc(100vh-4rem)] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#050505]/95 shadow-2xl backdrop-blur-2xl md:h-[700px] md:max-h-[80vh] md:w-[400px]"
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-white/5 bg-white/[0.02] p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                  <Robot weight="duotone" className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Library AI</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                    </span>
                    <span className="text-xs text-gray-400">Online</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X weight="bold" className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
              <div className="flex flex-col space-y-6">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex w-full items-end gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'assistant' && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 border border-white/10">
                        <Robot weight="duotone" className="h-4 w-4 text-gray-300" />
                      </div>
                    )}
                    
                    <div className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
                      msg.role === 'user' 
                        ? 'rounded-br-sm bg-white text-black font-medium shadow-md' 
                        : 'rounded-bl-sm border border-white/10 bg-white/5 text-gray-200'
                    }`}>
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                      
                      {msg.sources && (
                        <div className="mt-4 border-t border-black/10 pt-3">
                          <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-black/50">Sources:</h4>
                          <ul className="space-y-2">
                            {msg.sources.map((source, i) => (
                              <li key={i} className="truncate rounded-md bg-black/5 p-2 text-xs font-medium text-black/70">{source.excerpt}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    
                    {msg.role === 'user' && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-black">
                        <User weight="fill" className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                ))}
                
                {loading && (
                  <div className="flex w-full items-end gap-3 justify-start">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 border border-white/10">
                      <Robot weight="duotone" className="h-4 w-4 text-gray-300" />
                    </div>
                    <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm border border-white/10 bg-white/5 p-4 text-sm text-gray-400">
                      <SpinnerGap className="h-4 w-4 animate-spin" /> Thinking...
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} className="h-1" />
              </div>
            </div>

            {/* Input */}
            <div className="p-4 bg-white/[0.02] border-t border-white/5">
              <div className="relative flex items-center">
                <Input 
                  value={input} 
                  onChange={(e) => setInput(e.target.value)} 
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
                  placeholder="Ask about a book..." 
                  className="h-12 w-full rounded-full border-white/10 bg-white/5 pl-4 pr-12 text-sm text-white placeholder:text-gray-500 focus-visible:border-white/20 focus-visible:ring-1 focus-visible:ring-white/20"
                />
                <button 
                  onClick={handleSend} 
                  disabled={loading || !input.trim()}
                  className="absolute right-1.5 flex h-9 w-9 items-center justify-center rounded-full bg-white text-black transition-transform active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                >
                  <PaperPlaneRight weight="fill" className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-3 text-center text-[10px] uppercase tracking-widest text-gray-600">
                AI can make mistakes. Check your catalogue.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatAssistant;
