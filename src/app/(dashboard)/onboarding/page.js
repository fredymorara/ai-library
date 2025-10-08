// src/app/(dashboard)/onboarding/page.js
"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// --- THIS IS THE FIX ---
import { FilePlus, Search, Trash2, Edit, RefreshCw, Info, Loader2, CheckCircle, AlertTriangle, Upload } from "lucide-react";
import { Footer } from "@/components/Footer";
import { createClient } from '@supabase/supabase-js';
import { useAuth } from "@clerk/nextjs";

// This component was missing from my last response, adding it back
const SplitText = ({ text, className }) => <h1 className={className}>{text}</h1>;

// Public client for browser-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function OnboardingPage() {
  const glassEffect = "border-gray-800 bg-black/30 backdrop-blur-md";
  const fileInputRef = useRef(null);
  
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/get-books');
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to fetch books.");
      }
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error("Error fetching books:", error);
      setMessage(`Error fetching books: ${error.message}`);
      setStatus('error');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleSubmit(file);
    }
  };
  
  const handleSubmit = async (file) => {
    setStatus('uploading');
    setMessage('Parsing and saving books to your collection...');
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch('/api/upload-books', { method: 'POST', body: formData });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setStatus('success');
      setMessage(result.message);
      await fetchBooks();
    } catch (error) {
      setStatus('error');
      setMessage(error.message);
    }
  };

  return (
    <>
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="mb-8">
          <SplitText text="Onboarding & Data Management" className="text-3xl font-bold text-white" />
          <p className="mt-2 text-gray-400">Manage, sync, and enrich your library's AI knowledge base.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card className={glassEffect}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white"><FilePlus className="h-5 w-5" /> Add Books via CSV</CardTitle>
              <CardDescription className="text-gray-300">Upload a CSV to add to your collection. This will append to your existing data.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => fileInputRef.current?.click()}>
                <Upload className="mr-2 h-4 w-4" /> Upload CSV
              </Button>
              <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
            </CardContent>
          </Card>
          
          <Card className={glassEffect}>
            <CardHeader><CardTitle className="flex items-center gap-2 text-white"><RefreshCw className="h-5 w-5" /> Re-Enrich Collection</CardTitle><CardDescription className="text-gray-300">Restart the AI enrichment for your entire collection. Use this after making changes.</CardDescription></CardHeader>
            <CardContent><Button variant="destructive" className="w-full">Start Full Enrichment</Button></CardContent>
          </Card>
        </div>

        {status !== 'idle' && message && (
          <div className="flex items-center gap-3 rounded-md bg-gray-900/50 p-4">
            {status === 'uploading' && <Loader2 className="h-5 w-5 animate-spin text-blue-400" />}
            {status === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
            {status === 'error' && <AlertTriangle className="h-5 w-5 text-red-500" />}
            <p className={`text-sm ${status === 'error' ? 'text-red-400' : 'text-gray-300'}`}>{message}</p>
          </div>
        )}

        <Card className={glassEffect}>
          <CardHeader><CardTitle className="text-white">Your Live Collection</CardTitle><CardDescription className="text-gray-300">Search, edit, or delete books from the AI's knowledge base.</CardDescription></CardHeader>
          <CardContent>
            <div className="relative mb-4"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /><Input placeholder="Search your collection..." className="pl-10 bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500" /></div>
            <div className="rounded-md border border-gray-800">
              <Table>
                <TableHeader><TableRow className="border-gray-800 hover:bg-gray-800/50"><TableHead className="text-white">Title</TableHead><TableHead className="text-white">Author</TableHead><TableHead className="text-right text-white">Actions</TableHead></TableRow></TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={3} className="text-center text-gray-400">Loading books...</TableCell></TableRow>
                  ) : books.length > 0 ? (
                    books.map((book) => (
                      <TableRow key={book.id} className="border-gray-800">
                        <TableCell className="font-medium text-white">{book.title}</TableCell>
                        <TableCell className="text-gray-400">{book.author}</TableCell>
                        <TableCell className="text-right">{/* Edit/Delete buttons */}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow><TableCell colSpan={3} className="text-center text-gray-400">No books found. Upload a CSV to get started.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="mt-16"><Footer /></div>
    </>
  );
}