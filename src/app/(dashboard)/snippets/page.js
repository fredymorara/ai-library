// src/app/(dashboard)/snippets/page.js
"use client";
import React, { useState } from 'react';
import { useAuth } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";
import { Code, Copy, CheckCircle, TerminalWindow } from "@phosphor-icons/react";
import SplitText from "@/blocks/TextAnimations/SplitText/SplitText";
import { Footer } from "@/components/Footer";
import ChatAssistant from "@/components/ChatAssistant";

const CodeSnippet = ({ code, language = "javascript" }) => {
  const [copied, setCopied] = useState(false);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#050505]">
      {/* Mac-like Header */}
      <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-4 py-3">
        <div className="flex gap-2">
          <div className="h-3 w-3 rounded-full bg-red-500/80"></div>
          <div className="h-3 w-3 rounded-full bg-yellow-500/80"></div>
          <div className="h-3 w-3 rounded-full bg-green-500/80"></div>
        </div>
        <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">{language}</span>
      </div>
      
      {/* Code Body */}
      <div className="relative p-6">
        <pre className="overflow-x-auto text-sm font-mono leading-relaxed text-gray-300">
          <code>{code}</code>
        </pre>
        <button 
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-gray-400 backdrop-blur-md transition-all hover:bg-white/10 hover:text-white" 
          onClick={copyToClipboard}
        >
          {copied ? <CheckCircle weight="fill" className="h-4 w-4 text-green-400" /> : <Copy weight="duotone" className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
};

export default function SnippetsPage() {
  const [activeTab, setActiveTab] = useState('react');
  const [apiKey, setApiKey] = useState('');

  const reactSnippet = `
import ChatAssistant from '@/components/ChatAssistant';

function YourApp() {
  // Replace with your actual API Key
  const apiKey = "${apiKey || 'YOUR_API_KEY_HERE'}";

  return (
    <div>
      {/* Your application content */}
      <ChatAssistant apiKey={apiKey} />
    </div>
  );
}
`;

  const htmlSnippet = `
<!-- Add this script tag to the end of your <body> -->
<script>
  window.chatAssistant = {
    apiKey: "${apiKey || 'YOUR_API_KEY_HERE'}",
  };
</script>
<script src="https://your-cdn.com/chat-assistant.js" defer></script>
`;

  return (
    <>
      <div className="space-y-12">
        <div>
          <SplitText text="Integration Snippets" className="text-4xl font-bold tracking-tighter text-white sm:text-5xl" />
          <p className="mt-4 text-xl font-medium text-gray-500">Embed the context-aware chatbot into your own application.</p>
        </div>

        {/* Live Demo API Key Input */}
        <div className="p-[6px] rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md">
          <div className="flex h-full flex-col md:flex-row md:items-center justify-between gap-6 rounded-[calc(1.5rem-6px)] bg-[#050505]/90 p-8 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
            <div className="flex-1">
              <h3 className="text-xl font-bold tracking-tight text-white">Live Demo Setup</h3>
              <p className="mt-2 text-sm text-gray-400">Paste an API key here to activate the live demo widget on this page.</p>
            </div>
            <div className="w-full md:w-96">
              <Input 
                placeholder="pk_live_..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="h-12 bg-white/5 border-white/10 text-white rounded-xl focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:border-transparent font-mono placeholder:font-sans"
              />
            </div>
          </div>
        </div>

        {/* Code Tabs */}
        <div className="p-[6px] rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md">
          <div className="rounded-[calc(1.5rem-6px)] bg-[#050505]/90 p-8 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
            <div className="mb-8 flex space-x-2">
              <button 
                className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${activeTab === 'react' ? 'bg-white text-black shadow-lg shadow-white/10' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`} 
                onClick={() => setActiveTab('react')}
              >
                <TerminalWindow weight={activeTab === 'react' ? 'fill' : 'duotone'} className="h-4 w-4" />
                React Component
              </button>
              <button 
                className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${activeTab === 'html' ? 'bg-white text-black shadow-lg shadow-white/10' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`} 
                onClick={() => setActiveTab('html')}
              >
                <Code weight={activeTab === 'html' ? 'fill' : 'duotone'} className="h-4 w-4" />
                HTML / JS
              </button>
            </div>
            
            <div className="mt-4">
              {activeTab === 'react' && <CodeSnippet code={reactSnippet} language="react" />}
              {activeTab === 'html' && <CodeSnippet code={htmlSnippet} language="html" />}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-24"><Footer /></div>

      {/* Live Demo of the Chat Assistant */}
      {apiKey && <ChatAssistant apiKey={apiKey} />}
    </>
  );
}