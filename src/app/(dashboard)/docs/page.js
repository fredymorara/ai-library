// src/app/(dashboard)/docs/page.js
"use client";
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import SplitText from "@/blocks/TextAnimations/SplitText/SplitText";
import { Footer } from "@/components/Footer";

const DocumentationPage = () => {
  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-grow space-y-8 text-gray-300">
        <div className="mb-12">
          <SplitText text="Documentation" className="text-3xl font-bold text-green-500" />
          <p className="mt-2 text-gray-400">A step-by-step guide to setting up and using your Smart Library Assistant.</p>
        </div>

        <Card className="border-gray-800 bg-black/30 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-green-400">Step 1: Creating Your CSV Catalog</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-300">
            <p>Your journey begins by uploading your library&apos;s book catalog. This requires a standard CSV (Comma Separated Values) file.</p>
            <div className="bg-black/50 p-4 rounded-md border border-gray-800">
              <h4 className="font-semibold text-white mb-2">Required Columns</h4>
              <p className="text-sm text-gray-400 mb-2">Your CSV must include a column for the book title and a column for the author. Our system automatically recognizes the following header names (case-insensitive):</p>
              <ul className="list-disc list-inside space-y-1 pl-4 text-sm text-gray-300">
                <li><strong>For Title:</strong> <code>title</code>, <code>Title</code>, or <code>book_title</code></li>
                <li><strong>For Author:</strong> <code>author</code>, <code>Author</code>, <code>authors</code>, or <code>book_author</code></li>
              </ul>
            </div>
            <p className="text-sm text-gray-400">Once your file is ready, navigate to <strong>Onboarding & Data Management</strong> and upload your CSV. The system supports massive files and will seamlessly batch-upload them into your database.</p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-black/30 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-green-400">Step 2: AI Ingestion & Data Enrichment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-300">
            <p>Raw data isn&apos;t enough for AI. To provide contextually sound recommendations, the system needs to research the books and create vector embeddings.</p>
            <ol className="list-decimal list-inside space-y-2 pl-4 text-gray-400">
              <li>On the Onboarding page, click the <strong>&quot;Prepare Chatbot&quot;</strong> button.</li>
              <li>Behind the scenes, the system will automatically query Wikipedia for summaries of your books and pass that data to Google&apos;s <code>gemini-embedding-2</code> model.</li>
              <li>To respect API limits, ingestion processes 5 books at a time. Simply click the button to ingest the next batch!</li>
              <li>Once ingested, books will appear with a green checkmark in your catalog.</li>
            </ol>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-black/30 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-green-400">Step 3: Generate an API Key</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-300">
            <p>To securely access your unique knowledge base from external systems, you need an API key.</p>
            <ol className="list-decimal list-inside space-y-2 pl-4 text-gray-400">
              <li>Navigate to the <strong>API Keys</strong> page from the sidebar.</li>
              <li>Click <strong>Create New Key</strong> and give it a descriptive name (e.g., &quot;Student Portal Integration&quot;).</li>
              <li><strong>Crucial:</strong> Copy the generated key immediately (`pk_live_...`). For security, it will never be shown again!</li>
            </ol>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-black/30 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-green-400">Step 4: Embed the Chat Widget</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-300">
            <p>You can now embed the context-aware assistant directly into your library management system or student portal.</p>
            <ol className="list-decimal list-inside space-y-2 pl-4 text-gray-400">
              <li>Navigate to the <strong>Integration Snippets</strong> page.</li>
              <li>Choose your preferred platform (React Component or standard HTML/JS snippet).</li>
              <li>Copy the code and paste it into your external website.</li>
              <li>Replace the <code>YOUR_API_KEY_HERE</code> placeholder with the API key you generated in Step 3.</li>
              <li>Your users can now ask questions, and the AI will exclusively recommend books from <em>your</em> catalog!</li>
            </ol>
          </CardContent>
        </Card>

      </div>
      <div className="mt-16"><Footer /></div>
    </div>
  );
};

export default DocumentationPage;
