// src/app/(dashboard)/snippets/page.js
"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  const { getToken } = useAuth();
  const [activeTab, setActiveTab] = useState('react');
  const [apiKey, setApiKey] = useState('YOUR_API_KEY_HERE');
  const [displayApiKey, setDisplayApiKey] = useState('YOUR_API_KEY_HERE');

  useEffect(() => {
    const fetchFirstKey = async () => {
      try {
        const token = await getToken();
        const response = await fetch('/api/admin/api-keys', { headers: { 'Authorization': `Bearer ${token}` } });
        const { apiKeys } = await response.json();
        if (apiKeys && apiKeys.length > 0) {
          const firstActiveKey = apiKeys.find(k => k.is_active);
          if(firstActiveKey) {
             // We can't get the full key, so we use a placeholder for the display snippet
             setDisplayApiKey(`YOUR_API_KEY (e.g., ${firstActiveKey.key_prefix})`);
             // For the actual component demo, we need a real key. We'll use the key ID as a stand-in.
             // In a real product, we might need to rethink this flow.
             setApiKey(firstActiveKey.id); // Using ID for demo purposes
          }
        }
      } catch (error) {
        console.error("Could not fetch API key for snippet.", error);
      }
    };
    fetchFirstKey();
  }, [getToken]);

  const reactSnippet = `
import ChatAssistant from '@/components/ChatAssistant';

function YourApp() {
  const apiKey = "${displayApiKey}";

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
    apiKey: "${displayApiKey}",
  };
</script>
<script src="https://your-cdn.com/chat-assistant.js" defer></script>
`;

  return (
    <>
      <div className="space-y-8">
        <div className="mb-8">
          <SplitText text="Integration Snippets" className="text-3xl font-bold text-white" />
          <p className="mt-2 text-gray-400">Integrate the chatbot into your website with these snippets.</p>
        </div>

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

      {/* Live Demo of the Chat Assistant */}
      <ChatAssistant apiKey={apiKey} />
    </>
  );
}