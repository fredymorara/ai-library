// src/app/(dashboard)/snippets/page.js
"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code, Copy } from "lucide-react";
import SplitText from "@/blocks/TextAnimations/SplitText/SplitText";
import { Footer } from "@/components/Footer";

const reactSnippet = `
import React, { useState, useEffect } from 'react';

const Chatbot = ({ apiKey }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');

    // Replace with your actual API endpoint
    const response = await fetch('https://your-api-endpoint.com/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 	'Bearer ' + apiKey,
      },
      body: JSON.stringify({ messages: newMessages }),
    });

    const data = await response.json();
    setMessages([...newMessages, { role: 'assistant', content: data.content }]);
  };

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
      <button 
        onClick={toggleChat}
        style={{
          background: '#6366F1', color: 'white', borderRadius: '50%', 
          width: '60px', height: '60px', border: 'none', cursor: 'pointer',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)', display: 'flex', 
          alignItems: 'center', justifyContent: 'center'
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
      </button>
      {isOpen && (
        <div style={{
          position: 'absolute', bottom: '80px', right: '0',
          width: '350px', height: '500px', background: 'white',
          borderRadius: '10px', boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden'
        }}>
          <div style={{ padding: '10px', background: '#F3F4F6', borderBottom: '1px solid #E5E7EB' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Chat with us</h3>
          </div>
          <div style={{ flex: 1, padding: '10px', overflowY: 'auto' }}>
            {messages.map((msg, index) => (
              <div key={index} style={{
                textAlign: msg.role === 'user' ? 'right' : 'left',
                marginBottom: '10px'
              }}>
                <div style={{
                  display: 'inline-block', padding: '8px 12px',
                  borderRadius: '10px',
                  background: msg.role === 'user' ? '#6366F1' : '#E5E7EB',
                  color: msg.role === 'user' ? 'white' : 'black'
                }}>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: '10px', borderTop: '1px solid #E5E7EB' }}>
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #D1D5DB' }}
              placeholder="Type a message..."
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
`;

const htmlSnippet = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Chatbot</title>
  <style>
    #chat-widget-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 1000;
    }
    #chat-toggle-button {
      background: #6366F1;
      color: white;
      border-radius: 50%;
      width: 60px;
      height: 60px;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    #chat-popup {
      position: absolute;
      bottom: 80px;
      right: 0;
      width: 350px;
      height: 500px;
      background: white;
      border-radius: 10px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.2);
      display: none;
      flex-direction: column;
      overflow: hidden;
    }
  </style>
</head>
<body>

<div id="chat-widget-container">
  <button id="chat-toggle-button">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
  </button>
  <div id="chat-popup">
    <div style="padding: 10px; background: #F3F4F6; border-bottom: 1px solid #E5E7EB;">
      <h3 style="margin: 0; font-size: 16px; font-weight: 600;">Chat with us</h3>
    </div>
    <div id="chat-messages" style="flex: 1; padding: 10px; overflow-y: auto;"></div>
    <div style="padding: 10px; border-top: 1px solid #E5E7EB;">
      <input type="text" id="chat-input" style="width: 100%; padding: 8px; border-radius: 5px; border: 1px solid #D1D5DB;" placeholder="Type a message...">
    </div>
  </div>
</div>

<script>
  const apiKey = 'YOUR_API_KEY'; // Replace with your actual API key
  const chatPopupButton = document.getElementById('chat-toggle-button');
  const chatPopup = document.getElementById('chat-popup');
  const chatMessages = document.getElementById('chat-messages');
  const chatInput = document.getElementById('chat-input');
  let messages = [];

  chatPopupButton.addEventListener('click', () => {
    chatPopup.style.display = chatPopup.style.display === 'flex' ? 'none' : 'flex';
  });

  const handleSend = async () => {
    const input = chatInput.value;
    if (!input.trim()) return;

    messages.push({ role: 'user', content: input });
    renderMessages();
    chatInput.value = '';

    const response = await fetch('https://your-api-endpoint.com/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 	'Bearer ' + apiKey,
      },
      body: JSON.stringify({ messages }),
    });

    const data = await response.json();
    messages.push({ role: 'assistant', content: data.content });
    renderMessages();
  };

  const renderMessages = () => {
    chatMessages.innerHTML = '';
    messages.forEach(msg => {
      const msgDiv = document.createElement('div');
      msgDiv.style.textAlign = msg.role === 'user' ? 'right' : 'left';
      msgDiv.style.marginBottom = '10px';
      
      const contentDiv = document.createElement('div');
      contentDiv.style.display = 'inline-block';
      contentDiv.style.padding = '8px 12px';
      contentDiv.style.borderRadius = '10px';
      contentDiv.style.background = msg.role === 'user' ? '#6366F1' : '#E5E7EB';
      contentDiv.style.color = msg.role === 'user' ? 'white' : 'black';
      contentDiv.textContent = msg.content;
      
      msgDiv.appendChild(contentDiv);
      chatMessages.appendChild(msgDiv);
    });
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };

  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  });
</script>

</body>
</html>
`;

const CodeSnippet = ({ code }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="relative">
      <pre className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto">
        <code>{code}</code>
      </pre>
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-2 right-2 text-gray-400 hover:text-white"
        onClick={copyToClipboard}
      >
        <Copy className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default function SnippetsPage() {
  const [activeTab, setActiveTab] = useState('react');

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
              <Button variant={activeTab === 'react' ? 'default' : 'ghost'} onClick={() => setActiveTab('react')}>React Component</Button>
              <Button variant={activeTab === 'html' ? 'default' : 'ghost'} onClick={() => setActiveTab('html')}>HTML/CSS/JS</Button>
            </div>
          </CardHeader>
          <CardContent>
            {activeTab === 'react' && <CodeSnippet code={reactSnippet} />}
            {activeTab === 'html' && <CodeSnippet code={htmlSnippet} />}
          </CardContent>
        </Card>
      </div>
      <div className="mt-16"><Footer /></div>
    </>
  );
}
