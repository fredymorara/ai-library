// src/components/MockChat.jsx
"use client";
import React from 'react';
import { Bot, User, Send } from "lucide-react";

const MockChat = () => {
  return (
    <div className="w-full h-full bg-gray-900/80 rounded-2xl flex flex-col p-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-gray-700">
        <h3 className="font-semibold text-white text-sm">Library Assistant</h3>
      </div>

      {/* Messages */}
      <div className="flex-1 py-4 space-y-4 overflow-hidden">
        <div className="flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0"><Bot className="h-4 w-4 text-green-400" /></div>
          <div className="max-w-xs p-2 rounded-lg bg-gray-800 text-gray-300 text-sm">
            <p>Hello! How can I help you find a book today?</p>
          </div>
        </div>
        <div className="flex items-start gap-2.5 justify-end">
          <div className="max-w-xs p-2 rounded-lg bg-green-600/40 text-white text-sm">
            <p>Any books on Roman military tactics?</p>
          </div>
          <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0"><User className="h-4 w-4" /></div>
        </div>
        <div className="flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0"><Bot className="h-4 w-4 text-green-400" /></div>
          <div className="max-w-xs p-2 rounded-lg bg-gray-800 text-gray-300 text-sm">
            <p>Of course. You might like "The Roman Army" by Adrian Goldsworthy...</p>
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="relative">
        <div className="bg-gray-800 border-gray-700 pr-10 text-sm rounded-md p-2 text-gray-500">Ask a question...</div>
        <Send className="h-4 w-4 text-green-400 absolute right-2 top-1/2 -translate-y-1/2" />
      </div>
    </div>
  );
};

export default MockChat;
