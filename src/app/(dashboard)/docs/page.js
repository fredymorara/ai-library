// src/app/(dashboard)/docs/page.js
"use client";
import React from 'react';
import SplitText from "@/blocks/TextAnimations/SplitText/SplitText";
import { Footer } from "@/components/Footer";

const DocStep = ({ number, title, children }) => (
  <div className="relative overflow-hidden p-[6px] rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md">
    {/* Massive background number */}
    <div className="absolute -right-4 -top-8 select-none text-[180px] font-bold leading-none tracking-tighter text-white/[0.03]">
      {number}
    </div>
    
    <div className="relative z-10 flex h-full flex-col rounded-[calc(1.5rem-6px)] bg-[#050505]/90 p-8 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
      <h3 className="mb-6 flex items-baseline gap-4 text-2xl font-bold tracking-tight text-white">
        <span className="text-white/30 text-sm font-semibold tracking-widest uppercase">Step 0{number}</span>
        {title}
      </h3>
      <div className="prose prose-invert prose-p:text-gray-400 prose-a:text-white prose-strong:text-white max-w-none">
        {children}
      </div>
    </div>
  </div>
);

const DocumentationPage = () => {
  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-grow space-y-12 text-gray-300 max-w-4xl">
        <div className="mb-16">
          <SplitText text="Documentation" className="text-4xl font-bold tracking-tighter text-white sm:text-5xl" />
          <p className="mt-4 text-xl font-medium text-gray-500">A step-by-step guide to deploying your semantic knowledge base.</p>
        </div>

        <DocStep number={1} title="Creating Your CSV Catalog">
          <p>Your journey begins by uploading your library&apos;s book catalog. This requires a standard CSV (Comma Separated Values) file.</p>
          <div className="my-6 rounded-2xl bg-white/[0.02] p-6 border border-white/5">
            <h4 className="text-sm tracking-wide font-semibold text-white uppercase mb-4">Required Columns</h4>
            <p className="text-sm text-gray-400 mb-4">Your CSV must include a column for the book title and a column for the author. Our system automatically recognizes the following header names (case-insensitive):</p>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-300">
              <li><strong>For Title:</strong> <code className="bg-white/10 px-2 py-1 rounded text-white font-mono text-xs">title</code>, <code className="bg-white/10 px-2 py-1 rounded text-white font-mono text-xs">Title</code>, or <code className="bg-white/10 px-2 py-1 rounded text-white font-mono text-xs">book_title</code></li>
              <li><strong>For Author:</strong> <code className="bg-white/10 px-2 py-1 rounded text-white font-mono text-xs">author</code>, <code className="bg-white/10 px-2 py-1 rounded text-white font-mono text-xs">Author</code>, <code className="bg-white/10 px-2 py-1 rounded text-white font-mono text-xs">authors</code>, or <code className="bg-white/10 px-2 py-1 rounded text-white font-mono text-xs">book_author</code></li>
            </ul>
          </div>
          <p className="text-sm text-gray-400">Once your file is ready, navigate to <strong>Onboarding & Data Management</strong> and upload your CSV. The system supports massive files and will seamlessly batch-upload them into your database.</p>
        </DocStep>

        <DocStep number={2} title="AI Ingestion & Enrichment">
          <p>Raw data isn&apos;t enough for AI. To provide contextually sound recommendations, the system needs to research the books and create vector embeddings.</p>
          <ol className="list-decimal list-inside space-y-4 mt-6 text-gray-400">
            <li>On the Onboarding page, click the <strong className="text-white">Process Data</strong> button.</li>
            <li>Behind the scenes, the system will automatically query Wikipedia for summaries of your books and pass that data to Google&apos;s <code className="bg-white/10 px-2 py-1 rounded text-white font-mono text-xs">gemini-embedding-2</code> model.</li>
            <li>To respect API limits, ingestion processes 5 books at a time. Simply click the button to ingest the next batch!</li>
            <li>Once ingested, books will appear with a green checkmark in your catalog.</li>
          </ol>
        </DocStep>

        <DocStep number={3} title="Generate an API Key">
          <p>To securely access your unique knowledge base from external systems, you need an API key.</p>
          <ol className="list-decimal list-inside space-y-4 mt-6 text-gray-400">
            <li>Navigate to the <strong className="text-white">API Keys</strong> page from the sidebar.</li>
            <li>Click <strong className="text-white">Create New Key</strong> and give it a descriptive name (e.g., &quot;Student Portal Integration&quot;).</li>
            <li className="text-red-400"><strong>Crucial:</strong> Copy the generated key immediately (`pk_live_...`). For security, it will never be shown again!</li>
          </ol>
        </DocStep>

        <DocStep number={4} title="Embed the Chat Widget">
          <p>You can now embed the context-aware assistant directly into your library management system or student portal.</p>
          <ol className="list-decimal list-inside space-y-4 mt-6 text-gray-400">
            <li>Navigate to the <strong className="text-white">Integration Snippets</strong> page.</li>
            <li>Choose your preferred platform (React Component or standard HTML/JS snippet).</li>
            <li>Copy the code and paste it into your external website.</li>
            <li>Replace the <code className="bg-white/10 px-2 py-1 rounded text-white font-mono text-xs">YOUR_API_KEY_HERE</code> placeholder with the API key you generated in Step 3.</li>
            <li>Your users can now ask questions, and the AI will exclusively recommend books from <em className="text-white">your</em> catalog!</li>
          </ol>
        </DocStep>

      </div>
      <div className="mt-24"><Footer /></div>
    </div>
  );
};

export default DocumentationPage;
