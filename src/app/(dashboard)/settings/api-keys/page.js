// src/app/(dashboard)/settings/api-keys/page.js
"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch"; // Using a Switch for toggling
import { KeyRound, PlusCircle, Trash2, Copy, Check } from "lucide-react";
import SplitText from '@/blocks/TextAnimations/SplitText/SplitText';

const buttonStyles = "bg-transparent text-white border border-green-500/50 hover:bg-green-500/10 hover:border-green-500";
const destructiveButtonStyles = "bg-transparent text-white border border-red-500/50 hover:bg-red-500/10 hover:border-red-500";

export default function ApiKeysPage() {
  const { getToken } = useAuth();
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newKeyName, setNewKeyName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showNewKeyDialog, setShowNewKeyDialog] = useState(false);
  const [generatedKey, setGeneratedKey] = useState(null);
  const [keyToDelete, setKeyToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchKeys = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const response = await fetch('/api/admin/api-keys', { headers: { 'Authorization': `Bearer ${token}` } });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to fetch API keys.');
      setKeys(result.apiKeys);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    fetchKeys();
  }, [fetchKeys]);

  const handleCreateKey = async () => {
    setIsCreating(true);
    try {
      const token = await getToken();
      const response = await fetch('/api/admin/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name: newKeyName || 'Untitled Key' }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to create key.');
      setGeneratedKey(result.apiKey);
      setShowCreateDialog(false);
      setShowNewKeyDialog(true);
      fetchKeys();
    } catch (error) {
      console.error(error);
    } finally {
      setIsCreating(false);
      setNewKeyName('');
    }
  };

  const handleToggleKey = async (key, isActive) => {
    try {
      const token = await getToken();
      await fetch(`/api/admin/api-keys/${key.id}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ is_active: isActive }),
        }
      );
      fetchKeys();
    } catch (error) {
      console.error("Failed to toggle key status", error);
    }
  };

  const handleDeleteKey = async () => {
    if (!keyToDelete) return;
    setIsDeleting(true);
    try {
      const token = await getToken();
      await fetch(`/api/admin/api-keys/${keyToDelete.id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      fetchKeys();
    } catch (error) {
      console.error("Failed to delete key", error);
    } finally {
      setIsDeleting(false);
      setKeyToDelete(null);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="space-y-8">
        <div className="mb-8">
          <SplitText text="API Keys" className="text-3xl font-bold text-white" />
          <p className="text-gray-400">Manage API keys for accessing your library's AI assistant.</p>
        </div>

        <Card className="border-gray-800 bg-black/30 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-white">Your API Keys</CardTitle>
              <CardDescription className="text-gray-300">Keys only grant public query access. They do not have admin rights.</CardDescription>
            </div>
            <Button className={buttonStyles} onClick={() => setShowCreateDialog(true)}><PlusCircle className="mr-2 h-4 w-4" /> Create New Key</Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow className="hover:bg-transparent border-gray-800"><TableHead className="text-white">Name</TableHead><TableHead className="text-white">Key Prefix</TableHead><TableHead className="text-white">Status</TableHead><TableHead className="text-white">Last Used</TableHead><TableHead className="text-right text-white">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={5} className="text-center text-gray-400 h-24">Loading keys...</TableCell></TableRow>
                ) : keys.length > 0 ? (
                  keys.map(key => (
                    <TableRow key={key.id} className="hover:bg-transparent border-gray-800 text-white">
                      <TableCell>{key.name}</TableCell>
                      <TableCell><code className="bg-gray-700/50 p-1 rounded">{key.key_prefix}</code></TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch id={`active-switch-${key.id}`} checked={key.is_active} onCheckedChange={(checked) => handleToggleKey(key, checked)} />
                          <label htmlFor={`active-switch-${key.id}`} className={key.is_active ? 'text-green-400' : 'text-gray-500'}>{key.is_active ? "Active" : "Inactive"}</label>
                        </div>
                      </TableCell>
                      <TableCell>{key.last_used_at ? new Date(key.last_used_at).toLocaleString() : 'Never'}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-400" onClick={() => setKeyToDelete(key)}><Trash2 className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow><TableCell colSpan={5} className="text-center text-gray-400 h-24">No API keys found.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[425px] bg-gray-950 border-gray-800 text-white">
          <DialogHeader><DialogTitle>Create New API Key</DialogTitle></DialogHeader>
          <div className="py-4"><label htmlFor="key-name">Key Name (optional)</label><Input id="key-name" placeholder="e.g., Production Key" value={newKeyName} onChange={(e) => setNewKeyName(e.target.value)} className="mt-2 bg-gray-800" /></div>
          <DialogFooter><Button variant="outline" className={buttonStyles} onClick={() => setShowCreateDialog(false)}>Cancel</Button><Button className={buttonStyles} onClick={handleCreateKey} disabled={isCreating}>{isCreating ? 'Creating...' : 'Create Key'}</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showNewKeyDialog} onOpenChange={() => setShowNewKeyDialog(false)}>
        <DialogContent className="sm:max-w-md bg-gray-950 border-gray-800 text-white">
          <DialogHeader><DialogTitle>New API Key Generated</DialogTitle><CardDescription>Save this key now. You will not be able to see it again.</CardDescription></DialogHeader>
          <div className="py-4 bg-gray-900/50 rounded-md flex items-center justify-between p-2"><code className="text-sm text-green-400 break-all">{generatedKey}</code><Button variant="ghost" size="icon" onClick={copyToClipboard}>{copied ? <Check /> : <Copy />}</Button></div>
          <DialogFooter><Button className={buttonStyles} onClick={() => setShowNewKeyDialog(false)}>Done</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!keyToDelete} onOpenChange={() => setKeyToDelete(null)}>
        <AlertDialogContent className="bg-gray-950 border-gray-800 text-white">
          <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will PERMANENTLY DELETE the key "{keyToDelete?.name}". This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel className={buttonStyles}>Cancel</AlertDialogCancel><AlertDialogAction className={destructiveButtonStyles} onClick={handleDeleteKey} disabled={isDeleting}>{isDeleting ? 'Deleting...' : 'Delete Permanently'}</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}