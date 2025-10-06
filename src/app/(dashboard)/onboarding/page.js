// src/app/(dashboard)/onboarding/page.js
"use client";
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FilePlus, Search, Trash2, Edit, RefreshCw } from "lucide-react";
import { Footer } from "@/components/Footer";
import SplitText from "@/blocks/TextAnimations/SplitText/SplitText";

const sampleBooks = [
  { title: "A Short History of Nearly Everything", author: "Bill Bryson" },
  { title: "The Roman Army", author: "Adrian Goldsworthy" },
  { title: "Artificial Intelligence: A Modern Approach", author: "Stuart Russell & Peter Norvig" },
  { title: "Sapiens: A Brief History of Humankind", author: "Yuval Noah Harari" },
  { title: "Dune", author: "Frank Herbert" },
];

export default function OnboardingPage() {
  const glassEffect = "border-gray-800 bg-black/30 backdrop-blur-md";

  return (
    <>
      {/* UPDATED: This container now matches the full width of the dashboard */}
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Page Title - Consistent with dashboard layout */}
        <div className="mb-8">
          <SplitText
            text="Onboarding & Data Management"
            className="text-3xl font-bold text-white"
            from={{ opacity: 0, y: 20 }} to={{ opacity: 1, y: 0 }}
            stagger={0.05}
          />
          <p className="mt-2 text-gray-400">Sync, manage, and enrich your library's collection.</p>
        </div>

        {/* Section 1: Quick Actions */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card className={glassEffect}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white"><FilePlus className="h-5 w-5" /> Add New Books</CardTitle>
              <CardDescription className="text-gray-300">Upload a new CSV file to add more books to your current collection.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Upload CSV</Button>
            </CardContent>
          </Card>
          <Card className={glassEffect}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white"><RefreshCw className="h-5 w-5" /> Re-Enrich Data</CardTitle>
              <CardDescription className="text-gray-300">Restart the AI data enrichment process for your entire collection after making changes.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" className="w-full">Start Enrichment Process</Button>
            </CardContent>
          </Card>
        </div>

        {/* Section 2: Manage Existing Books */}
        <Card className={glassEffect}>
          <CardHeader>
            <CardTitle className="text-white">Manage Collection</CardTitle>
            <CardDescription className="text-gray-300">Search, edit, or delete individual books from your library.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input 
                placeholder="Search by title or author..." 
                className="pl-10 bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500" 
              />
            </div>
            <div className="rounded-md border border-gray-800">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-800 hover:bg-gray-800/50">
                    <TableHead className="text-white">Title</TableHead>
                    <TableHead className="text-white">Author</TableHead>
                    <TableHead className="text-right text-white">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleBooks.map((book, index) => (
                    <TableRow key={index} className="border-gray-800">
                      <TableCell className="font-medium text-white">{book.title}</TableCell>
                      <TableCell className="text-gray-400">{book.author}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="mr-2 text-gray-400 hover:text-white"><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-400"><Trash2 className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
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