// src/app/(dashboard)/onboarding/page.js
"use client";
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { FilePlus, Search, Trash2, Edit, RefreshCw, Info, Loader2, CheckCircle, AlertTriangle, Upload, Download } from "lucide-react";
import { Footer } from "@/components/Footer";

const BookDataTable = ({ books, loading, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editBook, setEditBook] = useState(null);
  const [deleteBook, setDeleteBook] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const booksPerPage = 10;

  const filteredBooks = useMemo(() =>
    books.filter(book =>
      (book.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (book.author?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    ), [books, searchTerm]);

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const paginatedBooks = filteredBooks.slice((currentPage - 1) * booksPerPage, currentPage * booksPerPage);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) setCurrentPage(page);
  };

  const handleDelete = async () => {
    if (!deleteBook) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/delete-book?id=${deleteBook.id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error("Failed to delete book.");
      onRefresh(); // Refresh the book list
      setIsDeleteDialogOpen(false);
      setDeleteBook(null);
    } catch (error) {
      console.error("Error deleting book:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = async () => {
    if (!editBook) return;
    setIsEditing(true);
    try {
      const response = await fetch('/api/edit-book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId: editBook.id, title: editBook.title, author: editBook.author }),
      });
      if (!response.ok) throw new Error("Failed to update book.");
      onRefresh();
      setIsEditDialogOpen(false);
      setEditBook(null);
    } catch (error) {
      console.error("Error updating book:", error);
    } finally {
      setIsEditing(false);
    }
  };

  const handleDownloadCSV = () => {
    const csv = Papa.unparse(books.map(b => ({ title: b.title, author: b.author })));
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'book-collection.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openEditDialog = (book) => {
    setEditBook({ ...book });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (book) => {
    setDeleteBook(book);
    setIsDeleteDialogOpen(true);
  };

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
            onClick={() => handlePageChange(i)}
            className={i === currentPage ? 'bg-gray-800 text-white' : 'text-white'}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    return items;
  };

  return (
    <>
      <Card className="border-gray-800 bg-black/30 backdrop-blur-md">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <CardTitle className="text-white">Your Live Collection ({books.length} Books)</CardTitle>
              <CardDescription className="text-gray-300">Search, edit, or delete books from the AI's knowledge base.</CardDescription>
            </div>
            <Button variant="outline" onClick={handleDownloadCSV}><Download className="mr-2 h-4 w-4" /> Download as CSV</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input 
                placeholder="Search your collection..." 
                className="pl-10 bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              />
            </div>
          </div>
          <div className="rounded-md border border-gray-800">
            <Table>
              <TableHeader><TableRow className="border-gray-800 hover:bg-transparent"><TableHead className="text-white pl-6 w-[45%]">Title</TableHead><TableHead className="text-white w-[40%]">Author</TableHead><TableHead className="text-right text-white pr-6 w-[15%]">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={3} className="text-center text-gray-400 h-24">Loading books...</TableCell></TableRow>
                ) : paginatedBooks.length > 0 ? (
                  paginatedBooks.map((book) => (
                    <TableRow key={book.id} className="border-gray-800">
                      <TableCell className="font-medium text-white pl-6">{book.title}</TableCell>
                      <TableCell className="text-gray-400">{book.author}</TableCell>
                      <TableCell className="text-right pr-6">
                        <Button variant="ghost" size="icon" className="mr-2 text-gray-400 hover:text-white" onClick={() => openEditDialog(book)}><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-400" onClick={() => openDeleteDialog(book)}><Trash2 className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow><TableCell colSpan={3} className="text-center text-gray-400 h-24">No books found. Upload a CSV to get started.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {totalPages > 1 && (
            <Pagination className="mt-6 text-white">
              <PaginationContent>
                <PaginationItem><PaginationPrevious className="hover:bg-gray-800 text-white" onClick={() => handlePageChange(currentPage - 1)} /></PaginationItem>
                {renderPaginationItems()}
                <PaginationItem><PaginationNext className="hover:bg-gray-800 text-white" onClick={() => handlePageChange(currentPage + 1)} /></PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-800 text-white">
          <DialogHeader><DialogTitle>Edit Book</DialogTitle></DialogHeader>
          {editBook && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="title" className="text-right">Title</label>
                <Input id="title" value={editBook.title} onChange={(e) => setEditBook({...editBook, title: e.target.value})} className="col-span-3 bg-white text-black" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="author" className="text-right">Author</label>
                <Input id="author" value={editBook.author} onChange={(e) => setEditBook({...editBook, author: e.target.value})} className="col-span-3 bg-white text-black" />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsEditDialogOpen(false)} variant="outline" className="bg-transparent border border-gray-700 hover:bg-gray-800 text-white">Cancel</Button>
            <Button onClick={handleEdit} disabled={isEditing}>
              {isEditing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-gray-950 border-gray-800 text-white">
          <AlertDialogHeader><AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle><AlertDialogDescription className="text-gray-400">This will permanently delete "{deleteBook?.title}".</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border border-gray-700 hover:bg-gray-800 text-white">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
              {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} 
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default function OnboardingPage() {
  const glassEffect = "border-gray-800 bg-black/30 backdrop-blur-md";
  const fileInputRef = useRef(null);
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/get-books');
      if (!response.ok) throw new Error("Failed to fetch books.");
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);
  
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) handleSubmit(file);
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
      await fetchBooks(); // Refresh the book list
    } catch (error) {
      setStatus('error');
      setMessage(error.message);
    }
  };

  return (
    <>
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Onboarding & Data Management</h1>
          <p className="mt-2 text-gray-400">Manage, sync, and enrich your library's AI knowledge base.</p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card className={glassEffect}><CardHeader><CardTitle className="flex items-center gap-2 text-white"><FilePlus className="h-5 w-5" /> Add Books via CSV</CardTitle><CardDescription className="text-gray-300">Upload a CSV to add to your collection.</CardDescription></CardHeader><CardContent><Button className="w-full" onClick={() => fileInputRef.current?.click()}><Upload className="mr-2 h-4 w-4" /> Upload CSV</Button><input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileChange} className="hidden" /></CardContent></Card>
          <Card className={glassEffect}><CardHeader><CardTitle className="flex items-center gap-2 text-white"><RefreshCw className="h-5 w-5" /> Re-Enrich Collection</CardTitle><CardDescription className="text-gray-300">Restart the AI enrichment for your entire collection.</CardDescription></CardHeader><CardContent><Button variant="destructive" className="w-full" disabled>Start Full Enrichment</Button></CardContent></Card>
        </div>
        {status !== 'idle' && message && (
          <div className="flex items-center gap-3 rounded-md bg-gray-900/50 p-4">
            {status === 'uploading' && <Loader2 className="h-5 w-5 animate-spin text-blue-400" />}
            {status === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
            {status === 'error' && <AlertTriangle className="h-5 w-5 text-red-500" />}
            <p className={`text-sm ${status === 'error' ? 'text-red-400' : 'text-gray-300'}`}>{message}</p>
          </div>
        )}
        <Card className={glassEffect}><CardHeader><CardTitle className="flex items-center gap-2 text-white"><Info className="h-5 w-5" /> CSV File Guide</CardTitle></CardHeader><CardContent className="text-gray-300 text-sm space-y-2"><p>For best results, your CSV file should contain:</p><ul className="list-disc pl-5 space-y-1"><li>A <code className="bg-gray-700 px-1 rounded">title</code> column (Required).</li><li>An <code className="bg-gray-700 px-1 rounded">authors</code> or <code className="bg-gray-700 px-1 rounded">author</code> column (Required).</li></ul></CardContent></Card>
        <BookDataTable books={books} loading={loading} onRefresh={fetchBooks} />
      </div>
      <div className="mt-16"><Footer /></div>
    </>
  );
}