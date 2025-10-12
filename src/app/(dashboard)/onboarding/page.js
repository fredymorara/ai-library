// src/app/(dashboard)/onboarding/page.js
"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { FilePlus, Search, Trash2, Edit, RefreshCw, Info, Loader2, CheckCircle, AlertTriangle, Upload, Book } from "lucide-react";
import SplitText from '@/blocks/TextAnimations/SplitText/SplitText';
import { Footer } from "@/components/Footer";
import { useDebounce } from '@/lib/hooks/useDebounce';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// --- STYLING CONSTANTS ---
const buttonStyles = "bg-transparent text-white border border-green-500/50 hover:bg-green-500/10 hover:border-green-500";
const destructiveButtonStyles = "bg-transparent text-white border border-red-500/50 hover:bg-red-500/10 hover:border-red-500";

// Cell component with tooltip for truncated text
const TruncatedCell = ({ text }) => (
  <TooltipProvider delayDuration={300}>
    <Tooltip>
      <TooltipTrigger className="truncate max-w-xs md:max-w-md lg:max-w-lg text-left">
        {text}
      </TooltipTrigger>
      <TooltipContent>
        <p>{text}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

// Simplified Data Table
const BookDataTable = ({ books, loading, totalCount, onEdit, onDelete, onPageChange, currentPage, totalPages }) => {
  const renderPaginationItems = () => {
    const items = [];
    const pagesToShow = 3;
    let startPage = Math.max(1, currentPage - Math.floor(pagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + pagesToShow - 1);
    if (endPage - startPage + 1 < pagesToShow) {
      startPage = Math.max(1, endPage - pagesToShow + 1);
    }
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink 
            isActive={i === currentPage} 
            onClick={() => onPageChange(i)}
            className={i === currentPage ? 'bg-green-500/20 border-green-500' : ''}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    return items;
  };

  return (
    <Card className="border-gray-800 bg-black/30 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2"><Book className="h-5 w-5" /> Your Live Collection ({totalCount} Books)</CardTitle>
        <CardDescription className="text-gray-300">Search, edit, or delete books from the AI&apos;s knowledge base.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-gray-800">
          <Table>
            <TableHeader><TableRow className="border-gray-800 hover:bg-transparent"><TableHead className="text-white pl-6">Title</TableHead><TableHead className="text-white">Author</TableHead><TableHead className="text-right text-white pr-6">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={3} className="text-center text-gray-400 h-24">Loading books...</TableCell></TableRow>
              ) : books.length > 0 ? (
                books.map((book) => (
                  <TableRow key={book.id} className="border-gray-800 hover:bg-transparent">
                    <TableCell className="font-medium text-white pl-6"><TruncatedCell text={book.title} /></TableCell>
                    <TableCell className="text-gray-400"><TruncatedCell text={book.author} /></TableCell>
                    <TableCell className="text-right pr-6">
                      <TooltipProvider delayDuration={100}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="mr-2 rounded-full hover:bg-green-500/10" onClick={() => onEdit(book)}><Edit className="h-4 w-4 text-green-500" /></Button>
                          </TooltipTrigger>
                          <TooltipContent><p>Edit Book</p></TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider delayDuration={100}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-green-500/10" onClick={() => onDelete(book)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                          </TooltipTrigger>
                          <TooltipContent><p>Delete Book</p></TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan={3} className="text-center text-gray-400 h-24">No books found.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {totalPages > 1 && (
          <Pagination className="mt-6 text-white">
            <PaginationContent>
              <PaginationItem><PaginationPrevious onClick={() => onPageChange(currentPage - 1)} /></PaginationItem>
              {renderPaginationItems()}
              <PaginationItem><PaginationNext onClick={() => onPageChange(currentPage + 1)} /></PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </CardContent>
    </Card>
  );
};

// Main Page Component
export default function OnboardingPage() {
  const { getToken, orgId, isLoaded } = useAuth();
  const institutionId = orgId;
  const fileInputRef = useRef(null);

  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [books, setBooks] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const booksPerPage = 10;

  const [editBook, setEditBook] = useState(null);
  const [deleteBook, setDeleteBook] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchBooks = useCallback(async () => {
    if (!isLoaded || !institutionId) return; // Wait for Clerk and orgId
    setLoading(true);
    try {
      const token = await getToken();
      const url = `/api/admin/books?page=${currentPage}&limit=${booksPerPage}&search=${debouncedSearchTerm}`;
      const response = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
      if (!response.ok) {
        // If the institution or books aren't found, it's a 404, which is okay for a new user.
        if (response.status === 404) {
          setBooks([]);
          setTotalCount(0);
          return; // Exit gracefully
        }
        throw new Error('Failed to fetch books.');
      }
      const { books: fetchedBooks, totalCount: fetchedTotalCount } = await response.json();
      setBooks(fetchedBooks);
      setTotalCount(fetchedTotalCount);
    } catch (error) {
      setStatus('error');
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }, [getToken, currentPage, debouncedSearchTerm, isLoaded, institutionId]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handlePageChange = (page) => {
    if (page > 0 && page <= Math.ceil(totalCount / booksPerPage)) {
      setCurrentPage(page);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleUpload = async (file) => {
    setStatus('uploading');
    setMessage('Uploading and processing file...');
    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/admin/upload', { 
        method: 'POST', 
        body: formData,
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Upload failed');
      setStatus('success');
      setMessage(result.message);
      fetchBooks();
    } catch (error) {
      setStatus('error');
      setMessage(error.message);
    }
  };

  const handlePrepareChatbot = async () => {
    setStatus('uploading');
    setMessage('Starting ingestion process... This may take a while.');
    try {
      const token = await getToken();
      const response = await fetch('/api/prepare-chatbot', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to prepare chatbot.');
      setStatus('success');
      setMessage(result.message);
      fetchBooks(); // Refresh the books to show their ingested status
    } catch (error) {
      setStatus('error');
      setMessage(error.message);
    }
  };

  const handleEdit = async () => {
    if (!editBook) return;
    setIsEditing(true);
    setStatus('uploading');
    setMessage('Updating book details...');
    try {
      const token = await getToken();
      const response = await fetch(`/api/admin/books/${editBook.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ title: editBook.title, author: editBook.author }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to update book.');
      setStatus('success');
      setMessage('Book updated successfully.');
      await fetchBooks(); // Re-fetch to show the update
    } catch (error) {
      setStatus('error');
      setMessage(error.message);
    } finally {
      setIsEditing(false);
      setEditBook(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteBook) return;
    setIsDeleting(true);
    setStatus('uploading');
    setMessage(`Deleting "${deleteBook.title}"...`);
    try {
      const token = await getToken();
      const response = await fetch(`/api/admin/books/${deleteBook.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to delete book.');
      setStatus('success');
      setMessage('Book deleted successfully.');
      await fetchBooks(); // Re-fetch to show the update
    } catch (error) {
      setStatus('error');
      setMessage(error.message);
    } finally {
      setIsDeleting(false);
      setDeleteBook(null);
    }
  };

  return (
    <>
      <div className="space-y-8">
        <div className="mb-8">
          <SplitText text="Onboarding & Data Management" className="text-3xl font-bold text-green-500" />
          <p className="mt-2 text-gray-400">Manage, sync, and enrich your library&apos;s AI knowledge base.</p>
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card className="border-gray-800 bg-black/30 backdrop-blur-md"><CardHeader><CardTitle className="flex items-center gap-2 text-white"><FilePlus /> Add Books</CardTitle><CardDescription>Upload a CSV or PDF file.</CardDescription></CardHeader><CardContent><Button className={`w-full ${buttonStyles}`} onClick={() => fileInputRef.current?.click()}><Upload className="mr-2 h-4 w-4" /> Upload File</Button><input ref={fileInputRef} type="file" accept=".csv,.pdf" onChange={(e) => handleUpload(e.target.files[0])} className="hidden" /></CardContent></Card>
          <Card className="border-gray-800 bg-black/30 backdrop-blur-md"><CardHeader><CardTitle className="flex items-center gap-2 text-white"><RefreshCw /> Prepare Chatbot</CardTitle><CardDescription>Process books to make them available to the AI.</CardDescription></CardHeader><CardContent><Button className={`w-full ${destructiveButtonStyles}`} onClick={handlePrepareChatbot}>Prepare Chatbot</Button></CardContent></Card>
        </div>

        {status !== 'idle' && message && (
          <div className="flex items-center gap-3 rounded-md bg-gray-900/50 p-4">
            {status === 'uploading' && <Loader2 className="h-5 w-5 animate-spin text-blue-400" />}
            {status === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
            {status === 'error' && <AlertTriangle className="h-5 w-5 text-red-500" />}
            <p className={`text-sm ${status === 'error' ? 'text-red-400' : 'text-gray-300'}`}>{message}</p>
          </div>
        )}

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input placeholder="Search your collection..." className="pl-10 bg-gray-900/50 border-gray-700 text-white" value={searchTerm} onChange={handleSearchChange} />
        </div>

        <BookDataTable 
          books={books} 
          loading={loading} 
          totalCount={totalCount}
          onEdit={(book) => setEditBook(book)}
          onDelete={(book) => setDeleteBook(book)}
          onPageChange={handlePageChange}
          currentPage={currentPage}
          totalPages={Math.ceil(totalCount / booksPerPage)}
        />
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editBook} onOpenChange={(isOpen) => !isOpen && setEditBook(null)}>
        <DialogContent className="sm:max-w-[425px] bg-gray-950 border-gray-800 text-white">
          <DialogHeader><DialogTitle>Edit Book</DialogTitle></DialogHeader>
          {editBook && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="title" className="text-right">Title</label>
                <Input id="title" value={editBook.title} onChange={(e) => setEditBook({...editBook, title: e.target.value})} className="col-span-3 bg-gray-800 border-gray-700 text-white" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="author" className="text-right">Author</label>
                <Input id="author" value={editBook.author} onChange={(e) => setEditBook({...editBook, author: e.target.value})} className="col-span-3 bg-gray-800 border-gray-700 text-white" />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setEditBook(null)} variant="outline" className={buttonStyles}>Cancel</Button>
            <Button onClick={handleEdit} disabled={isEditing} className={buttonStyles}>
              {isEditing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteBook} onOpenChange={(isOpen) => !isOpen && setDeleteBook(null)}>
        <AlertDialogContent className="bg-gray-950 border-gray-800 text-white">
          <AlertDialogHeader><AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle><AlertDialogDescription className="text-gray-400">This will permanently delete "{deleteBook?.title}".</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className={buttonStyles}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className={destructiveButtonStyles}>
              {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="mt-16"><Footer /></div>
    </>
  );
}
