// src/app/(dashboard)/snippets/page.js
"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Code, Copy, Check } from "lucide-react";
import SplitText from "@/blocks/TextAnimations/SplitText/SplitText";
import { Footer } from "@/components/Footer";
import ChatAssistant from "@/components/ChatAssistant"; // <-- IMPORT THE NEW COMPONENT

const buttonStyles = "bg-transparent text-white border border-green-500/50 hover:bg-green-500/10 hover:border-green-500";

const CodeSnippet = ({ code }) => {
  const [copied, setCopied] = useState(false);
  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <pre className="bg-gray-900 text-sm text-green-300 p-4 rounded-lg overflow-x-auto">
        <code>{code}</code>
      </pre>
      <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-gray-400 hover:text-white" onClick={copyToClipboard}>
        {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
      </Button>
    </div>
  );
};

export default function SnippetsPage() {
  const [activeTab, setActiveTab] = useState('react');
  const [apiKey, setApiKey] = useState(''); // State for the live demo key

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
      <div className="space-y-8">
        <div className="mb-8">
          <SplitText text="Integration Snippets" className="text-3xl font-bold text-green-500" />
          <p className="mt-2 text-gray-400">Use these snippets to integrate the chatbot into your website.</p>
        </div>

        {/* Live Demo API Key Input */}
        <Card className="border-gray-800 bg-black/30 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-white">Live Demo Setup</CardTitle>
            <CardDescription className="text-gray-300">Create an API key on the API Keys page, then paste it here to activate the live demo widget on this page.</CardDescription>
          </CardHeader>
          <CardContent>
            <Input 
              placeholder="Paste your pk_live_... key here to test the widget"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-black/30 backdrop-blur-md">
          <CardHeader>
            <div className="flex space-x-1 border-b border-gray-700">
              <Button variant={activeTab === 'react' ? 'default' : 'ghost'} className={activeTab === 'react' ? buttonStyles : 'text-gray-400'} onClick={() => setActiveTab('react')}>React Component</Button>
              <Button variant={activeTab === 'html' ? 'default' : 'ghost'} className={activeTab === 'html' ? buttonStyles : 'text-gray-400'} onClick={() => setActiveTab('html')}>HTML/JS</Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {activeTab === 'react' && <CodeSnippet code={reactSnippet} />}
            {activeTab === 'html' && <CodeSnippet code={htmlSnippet} />}
          </CardContent>
        </Card>
      </div>
      <div className="mt-16"><Footer /></div>

      {/* Live Demo of the Chat Assistant (only renders if API key is provided) */}
      {apiKey && <ChatAssistant apiKey={apiKey} />}
    </>
  );
}