// src/app/(dashboard)/settings/page.js
"use client";
import { useState, useEffect } from 'react';
import { UserProfile } from "@clerk/nextjs";
import SplitText from "@/blocks/TextAnimations/SplitText/SplitText";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, RefreshCw } from "lucide-react";

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchInstitution = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/institution');
        if (!response.ok) throw new Error("Failed to fetch institution data.");
        const data = await response.json();
        setApiKey(data.api_key);
      } catch (error) {
        console.error("Error fetching institution data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInstitution();
  }, []);

  const handleGenerateNewKey = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/regenerate-api-key', { method: 'POST' });
      if (!response.ok) throw new Error("Failed to generate new API key.");
      const data = await response.json();
      setApiKey(data.apiKey);
    } catch (error) {
      console.error("Error generating new API key:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

   return (
     <>
       <div className="space-y-8">
         <div>
           <SplitText text="Account Settings" className="text-3xl font-bold mb-1 text-white" />
           <p className="text-gray-400 mb-6">Manage your profile and account details.</p>
           <UserProfile appearance={{ baseTheme: 'dark', variables: { colorPrimary: '#818cf8' } }} />
         </div>

         <Card className="border-gray-800 bg-black/30 backdrop-blur-md">
           <CardHeader>
             <CardTitle className="text-white">API Key</CardTitle>
             <CardDescription className="text-gray-300">Use this key to integrate the chatbot into your website.</CardDescription>
           </CardHeader>
           <CardContent className="space-y-4">
             <div className="flex items-center space-x-2">
               <Input value={loading ? 'Loading...' : apiKey} readOnly className="bg-gray-900/50 border-gray-700 text-white" />
               <Button variant="outline" size="icon" onClick={copyToClipboard} disabled={loading}>
                 {copied ? <CheckIcon className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
               </Button>
             </div>
             <Button variant="destructive" onClick={handleGenerateNewKey} disabled={isGenerating}>
               {isGenerating ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />} 
               Generate New Key
             </Button>
           </CardContent>
         </Card>
       </div>
       <div className="mt-16"><Footer /></div>
     </>
   );
 }