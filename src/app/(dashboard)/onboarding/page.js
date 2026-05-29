// src/app/(dashboard)/onboarding/page.js
"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { FileArrowUp, MagnifyingGlass, Trash, PencilSimple, ArrowsClockwise, SpinnerGap, CheckCircle, Warning, UploadSimple, BookOpenText } from "@phosphor-icons/react";
import SplitText from '@/blocks/TextAnimations/SplitText/SplitText';
import { Footer } from "@/components/Footer";
import { useDebounce } from '@/lib/hooks/useDebounce';
import Papa from 'papaparse';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// --- STYLING CONSTANTS ---
const ActionCard = ({ title, description, icon, action, buttonText, buttonIcon, destructive }) => (
  <div className="p-[6px] rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md">
    <div className="flex h-full flex-col justify-between rounded-[calc(1.5rem-6px)] bg-[#050505]/90 p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
      <div>
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-full ${destructive ? 'bg-red-500/10 text-red-500' : 'bg-white/10 text-white'}`}>
            {icon}
          </div>
          <h3 className="text-lg font-semibold tracking-tight text-white">{title}</h3>
        </div>
        <p className="mt-3 text-sm text-gray-400">{description}</p>
      </div>
      <div className="mt-6">
        <button 
          onClick={action}
          className={`group relative flex w-full items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold transition-all duration-300 active:scale-[0.98] ${destructive ? 'border-red-500/20 bg-red-500/10 text-red-500 hover:bg-red-500/20' : 'border-white/10 bg-white/5 text-white hover:bg-white/10'}`}
        >
          {buttonIcon}
          {buttonText}
        </button>
      </div>
    </div>
  </div>
);

// Cell component with tooltip for truncated text
const TruncatedCell = ({ text }) => (
  <TooltipProvider delayDuration={300}>
    <Tooltip>
      <TooltipTrigger className="truncate max-w-xs md:max-w-md lg:max-w-lg text-left">
        {text}
      </TooltipTrigger>
      <TooltipContent className="bg-gray-900 border-white/10 text-white">
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
            className={i === currentPage ? 'bg-white/10 text-white border-white/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    return items;
  };

  return (
    <div className="p-[6px] rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md">
      <div className="rounded-[calc(1.5rem-6px)] bg-[#050505]/90 p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
        <div className="mb-6">
          <h3 className="text-xl font-bold tracking-tight text-white flex items-center gap-2"><BookOpenText weight="duotone" className="h-5 w-5" /> Your Collection ({totalCount})</h3>
          <p className="text-sm text-gray-400 mt-1">Manage the books currently accessible by the AI.</p>
        </div>
        
        <div className="rounded-xl border border-white/10 overflow-hidden">
          <Table>
            <TableHeader className="bg-white/[0.02]">
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-gray-400 font-medium pl-6">Title</TableHead>
                <TableHead className="text-gray-400 font-medium">Author</TableHead>
                <TableHead className="text-right text-gray-400 font-medium pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={3} className="text-center text-gray-400 h-24">Loading books...</TableCell></TableRow>
              ) : books.length > 0 ? (
                books.map((book) => (
                  <TableRow key={book.id} className="border-white/5 hover:bg-white/5 transition-colors">
                    <TableCell className="font-medium text-white pl-6"><TruncatedCell text={book.title} /></TableCell>
                    <TableCell className="text-gray-400"><TruncatedCell text={book.author} /></TableCell>
                    <TableCell className="text-right pr-6">
                      <TooltipProvider delayDuration={100}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button className="mr-2 rounded-lg p-2 text-gray-400 hover:bg-white/10 hover:text-white transition-colors" onClick={() => onEdit(book)}><PencilSimple className="h-4 w-4" /></button>
                          </TooltipTrigger>
                          <TooltipContent className="bg-gray-900 border-white/10 text-white"><p>Edit Book</p></TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider delayDuration={100}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button className="rounded-lg p-2 text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition-colors" onClick={() => onDelete(book)}><Trash className="h-4 w-4" /></button>
                          </TooltipTrigger>
                          <TooltipContent className="bg-gray-900 border-white/10 text-white"><p>Delete Book</p></TooltipContent>
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
          <Pagination className="mt-6">
            <PaginationContent>
              <PaginationItem><PaginationPrevious className="text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer" onClick={() => onPageChange(currentPage - 1)} /></PaginationItem>
              {renderPaginationItems()}
              <PaginationItem><PaginationNext className="text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer" onClick={() => onPageChange(currentPage + 1)} /></PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
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
  const [isClearing, setIsClearing] = useState(false);

  const fetchBooks = useCallback(async () => {
    if (!isLoaded || !institutionId) return; // Wait for Clerk and orgId
    setLoading(true);
    try {
      const token = await getToken();
      const url = `/api/admin/books?page=${currentPage}&limit=${booksPerPage}&search=${debouncedSearchTerm}`;
      const response = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
      if (!response.ok) {
        if (response.status === 404) {
          setBooks([]);
          setTotalCount(0);
          return;
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

  const handleCsvUpload = async (file) => {
    setStatus('uploading');
    setMessage('Parsing CSV file... Please wait.');
    
    const token = await getToken();
    const batchSize = 1000;
    let currentBatch = [];
    let totalProcessed = 0;
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      worker: false,
      step: (results, parser) => {
        if (Object.keys(results.data).length > 0) {
          currentBatch.push(results.data);
        }
        
        if (currentBatch.length >= batchSize) {
          parser.pause();
          
          const batchToUpload = [...currentBatch];
          currentBatch = []; 
          
          (async () => {
            try {
              setMessage(`Uploading batch... (${totalProcessed} records processed)`);
              const response = await fetch('/api/admin/books/bulk', {
                method: 'POST',
                headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ books: batchToUpload })
              });
              
              if (!response.ok) {
                const resJson = await response.json();
                throw new Error(resJson.details || resJson.error || 'Failed to upload batch');
              }
              
              totalProcessed += batchToUpload.length;
              parser.resume();
            } catch (error) {
              parser.abort();
              setStatus('error');
              setMessage(`Upload stopped: ${error.message}`);
            }
          })();
        }
      },
      complete: async () => {
        if (currentBatch.length > 0) {
          try {
            setMessage(`Uploading final batch...`);
            const response = await fetch('/api/admin/books/bulk', {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
              },
              body: JSON.stringify({ books: currentBatch })
            });
            if (!response.ok) {
              const resJson = await response.json();
              throw new Error(resJson.details || resJson.error || 'Failed to upload final batch');
            }
            totalProcessed += currentBatch.length;
          } catch (error) {
             setStatus('error');
             setMessage(`Upload stopped: ${error.message}`);
             return;
          }
        }
        
        setStatus('success');
        setMessage(`Successfully uploaded ${totalProcessed} books from CSV!`);
        fetchBooks();
      },
      error: (error) => {
        setStatus('error');
        setMessage(`Error parsing CSV: ${error.message}`);
      }
    });
  };

  const handleUpload = async (file) => {
    if (!file) return;

    if (file.name.toLowerCase().endsWith('.csv') || file.type === 'text/csv') {
      return handleCsvUpload(file);
    }

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
    setMessage('Processing books for AI... this might take a minute.');
    try {
      const token = await getToken();
      const response = await fetch('/api/prepare-chatbot', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.details || result.error || 'Failed to process books');
      setStatus('success');
      setMessage(result.message);
      fetchBooks();
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
      await fetchBooks();
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
      await fetchBooks();
    } catch (error) {
      setStatus('error');
      setMessage(error.message);
    } finally {
      setIsDeleting(false);
      setDeleteBook(null);
    }
  };

  const handleClearData = async () => {
    setIsClearing(false);
    setStatus('uploading');
    setMessage('Clearing entire knowledge base...');
    try {
      const token = await getToken();
      const response = await fetch('/api/admin/books', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to clear data.');
      setStatus('success');
      setMessage(result.message);
      setBooks([]);
      setTotalCount(0);
      setCurrentPage(1);
    } catch (error) {
      setStatus('error');
      setMessage(error.message);
    }
  };

  return (
    <>
      <div className="space-y-8">
        <div className="mb-12">
          <SplitText text="Data Sync" className="text-4xl font-bold tracking-tighter text-white sm:text-5xl" />
          <p className="mt-2 text-lg text-gray-400">Manage, sync, and enrich your library&apos;s AI knowledge base.</p>
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <ActionCard 
            title="Add Books"
            description="Upload a CSV or PDF file to instantly ingest books."
            icon={<FileArrowUp weight="duotone" className="h-5 w-5" />}
            action={() => fileInputRef.current?.click()}
            buttonText="Upload File"
            buttonIcon={<UploadSimple weight="bold" className="h-4 w-4" />}
          />
          <input ref={fileInputRef} type="file" accept=".csv,.pdf" onChange={(e) => handleUpload(e.target.files[0])} className="hidden" />

          <ActionCard 
            title="Prepare Chatbot"
            description="Process raw text into searchable AI embeddings."
            icon={<ArrowsClockwise weight="duotone" className="h-5 w-5" />}
            action={handlePrepareChatbot}
            buttonText="Process Data"
            buttonIcon={<ArrowsClockwise weight="bold" className="h-4 w-4" />}
          />

          <ActionCard 
            title="Clear Data"
            description="Permanently wipe your library catalog and vectors."
            icon={<Trash weight="duotone" className="h-5 w-5" />}
            action={() => setIsClearing(true)}
            buttonText="Wipe Everything"
            buttonIcon={<Trash weight="bold" className="h-4 w-4" />}
            destructive={true}
          />
        </div>

        {status !== 'idle' && message && (
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            {status === 'uploading' && <SpinnerGap weight="bold" className="h-5 w-5 animate-spin text-white" />}
            {status === 'success' && <CheckCircle weight="fill" className="h-5 w-5 text-white" />}
            {status === 'error' && <Warning weight="fill" className="h-5 w-5 text-red-500" />}
            <p className={`text-sm font-medium ${status === 'error' ? 'text-red-400' : 'text-gray-300'}`}>{message}</p>
          </div>
        )}

        <div className="relative max-w-md">
          <MagnifyingGlass weight="bold" className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input 
            placeholder="Search your collection..." 
            className="pl-12 h-12 bg-white/5 border-white/10 text-white rounded-2xl focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:border-transparent placeholder:text-gray-500" 
            value={searchTerm} 
            onChange={handleSearchChange} 
          />
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
        <DialogContent className="sm:max-w-[425px] bg-[#050505] border-white/10 text-white rounded-3xl p-6">
          <DialogHeader><DialogTitle className="text-xl font-bold tracking-tight">Edit Book</DialogTitle></DialogHeader>
          {editBook && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="title" className="text-sm font-medium text-gray-400">Title</label>
                <Input id="title" value={editBook.title} onChange={(e) => setEditBook({...editBook, title: e.target.value})} className="h-12 bg-white/5 border-white/10 text-white rounded-xl" />
              </div>
              <div className="grid gap-2">
                <label htmlFor="author" className="text-sm font-medium text-gray-400">Author</label>
                <Input id="author" value={editBook.author} onChange={(e) => setEditBook({...editBook, author: e.target.value})} className="h-12 bg-white/5 border-white/10 text-white rounded-xl" />
              </div>
            </div>
          )}
          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <button onClick={() => setEditBook(null)} className="rounded-xl px-4 py-2 text-sm font-semibold text-gray-400 hover:text-white transition-colors">Cancel</button>
            <button onClick={handleEdit} disabled={isEditing} className="flex items-center gap-2 rounded-xl bg-white text-black px-6 py-2 text-sm font-semibold hover:bg-gray-200 transition-colors">
              {isEditing ? <SpinnerGap className="h-4 w-4 animate-spin" /> : null} Save Changes
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteBook} onOpenChange={(isOpen) => !isOpen && setDeleteBook(null)}>
        <AlertDialogContent className="bg-[#050505] border-white/10 text-white rounded-3xl p-6">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold tracking-tight">Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">This will permanently delete &quot;{deleteBook?.title}&quot; from the catalog.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel className="border-0 bg-transparent text-gray-400 hover:bg-transparent hover:text-white sm:mr-4">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-0">
              {isDeleting ? <SpinnerGap className="mr-2 h-4 w-4 animate-spin" /> : null} Delete Book
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Clear All Dialog */}
      <AlertDialog open={isClearing} onOpenChange={setIsClearing}>
        <AlertDialogContent className="bg-[#050505] border-white/10 text-white rounded-3xl p-6">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold tracking-tight text-red-500 flex items-center gap-2"><Warning weight="fill" className="h-6 w-6" /> Destructive Action</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400 mt-2">This action cannot be undone. This will permanently wipe your entire catalog and destroy all semantic embeddings associated with this workspace.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8">
            <AlertDialogCancel className="border-0 bg-transparent text-gray-400 hover:bg-transparent hover:text-white sm:mr-4">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearData} className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-0 font-semibold px-6">
              Wipe Data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="mt-16"><Footer /></div>
    </>
  );
}
