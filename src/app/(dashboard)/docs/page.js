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
            <CardTitle className="text-green-400">Step 1: Initial Setup & Onboarding</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-300">
            <p>Welcome! Your journey begins by populating your library&apos;s knowledge base. This is the data the AI will use to answer questions.</p>
            <ol className="list-decimal list-inside space-y-2 pl-4 text-gray-400">
              <li>Navigate to the Onboarding Page: Use the sidebar link to go to &quot;Onboarding & Data Management&quot;.</li>
              <li>Prepare Your Data: Your book catalog should be in a CSV file with at least `title` and `author` columns.</li>
              <li>Upload Your File: Click the &quot;Upload File&quot; button and select your CSV. The system will process it and add the books to your database. You will see them appear in the table below.</li>
            </ol>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-black/30 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-green-400">Step 2: Prepare the AI (Ingestion)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-300">
            <p>Once your books are uploaded, you need to prepare the AI to use them. This process, called ingestion, involves reading the book data, creating vector embeddings, and storing them for the AI to search.</p>
            <ol className="list-decimal list-inside space-y-2 pl-4 text-gray-400">
              <li>Start the Process: On the Onboarding page, click the &quot;Prepare Chatbot&quot; button.</li>
              <li>Wait for Completion: The process runs in batches. You can click the button multiple times to ingest more books until all are processed. You will see status messages updating you on the progress.</li>
              <li>Verify: Once ingested, the `is_ingested` status for the books will update in your database.</li>
            </ol>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-black/30 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-green-400">Step 3: Get Your API Key</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-300">
            <p>The API key is your password for the chat widget. It authenticates requests and ensures the chat only uses your institution&apos;s data.</p>
            <ol className="list-decimal list-inside space-y-2 pl-4 text-gray-400">
              <li>Navigate to the API Keys Page: Use the sidebar link to go to &quot;API Keys&quot;.</li>
              <li>Create a Key: Click the &quot;Create New Key&quot; button. Give it a descriptive name (e.g., &quot;Main Website Key&quot;).</li>
              <li>Copy Your Key: A dialog will appear showing your new key. This is the only time you will see the full key. Copy it immediately and store it somewhere safe.</li>
            </ol>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-black/30 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-green-400">Step 4: Integrate the Chat Widget</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-300">
            <p>You can now embed the chat assistant directly into your library&apos;s website.</p>
            <ol className="list-decimal list-inside space-y-2 pl-4 text-gray-400">
              <li>Navigate to the Snippets Page: Use the sidebar link to go to &quot;Integration Snippets&quot;.</li>
              <li>Choose Your Method: Select either the &quot;React Component&quot; or &quot;HTML/JS&quot; tab.</li>
              <li>Copy the Snippet: Copy the provided code snippet.</li>
              <li>Add Your API Key: In the snippet you just copied, replace the placeholder `YOUR_API_KEY_HERE` with the actual API key you created in Step 3.</li>
              <li>Deploy: Add the snippet to your website&apos;s code. The chat widget will now appear for your users.</li>
            </ol>
          </CardContent>
        </Card>

      </div>
      <div className="mt-16"><Footer /></div>
    </div>
  );
};

export default DocumentationPage;
