// src/app/(dashboard)/settings/api-keys/page.js
"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Key, PlusCircle, Trash, Copy, CheckCircle, Warning, SpinnerGap } from "@phosphor-icons/react";
import SplitText from '@/blocks/TextAnimations/SplitText/SplitText';

export default function ApiKeysPage() {
  const { getToken, isLoaded } = useAuth();
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
    if (!isLoaded) return;
    setLoading(true);
    try {
      const token = await getToken();
      const response = await fetch('/api/admin/api-keys', { headers: { 'Authorization': `Bearer ${token}` } });
      if (!response.ok) {
        if (response.status === 404) {
          setKeys([]);
          return;
        }
        const result = await response.json();
        throw new Error(result.error || 'Failed to fetch API keys.');
      }
      const { apiKeys } = await response.json();
      setKeys(apiKeys);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [getToken, isLoaded]);

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
    const originalKeys = [...keys];
    const updatedKeys = keys.map(k => k.id === key.id ? { ...k, is_active: isActive } : k);
    setKeys(updatedKeys);

    try {
      const token = await getToken();
      const response = await fetch(`/api/admin/api-keys/${key.id}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ is_active: isActive }),
        }
      );
      if (!response.ok) {
        setKeys(originalKeys);
        throw new Error("Failed to update key status.");
      }
    } catch (error) {
      console.error("Failed to toggle key status", error);
      setKeys(originalKeys);
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
      <div className="space-y-12">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <SplitText text="API Keys" className="text-4xl font-bold tracking-tighter text-white sm:text-5xl" />
            <p className="mt-4 text-xl font-medium text-gray-500">Manage API keys for accessing your library&apos;s AI assistant.</p>
          </div>
          <button 
            className="group relative flex items-center gap-3 rounded-full border border-white/10 bg-white text-black pl-6 pr-2 py-2 text-sm font-bold transition-all duration-500 hover:bg-gray-200 active:scale-[0.98]"
            onClick={() => setShowCreateDialog(true)}
          >
            Create New Key
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black/10 transition-transform duration-500 group-hover:bg-black group-hover:text-white">
              <PlusCircle weight="bold" className="h-4 w-4" />
            </div>
          </button>
        </div>

        <div className="p-[6px] rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md">
          <div className="rounded-[calc(1.5rem-6px)] bg-[#050505]/90 p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
            <div className="mb-6">
              <h3 className="text-xl font-bold tracking-tight text-white flex items-center gap-2"><Key weight="duotone" className="h-5 w-5" /> Active Tokens</h3>
              <p className="text-sm text-gray-400 mt-1">Keys only grant public query access. They don&apos;t have admin rights.</p>
            </div>
            
            <div className="rounded-xl border border-white/10 overflow-hidden">
              <Table>
                <TableHeader className="bg-white/[0.02]">
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead className="text-gray-400 font-medium pl-6">Name</TableHead>
                    <TableHead className="text-gray-400 font-medium">Key Prefix</TableHead>
                    <TableHead className="text-gray-400 font-medium">Status</TableHead>
                    <TableHead className="text-gray-400 font-medium">Last Used</TableHead>
                    <TableHead className="text-right text-gray-400 font-medium pr-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={5} className="text-center text-gray-400 h-24">Loading keys...</TableCell></TableRow>
                  ) : keys.length > 0 ? (
                    keys.map(key => (
                      <TableRow key={key.id} className="border-white/5 hover:bg-white/5 transition-colors text-white">
                        <TableCell className="font-medium pl-6">{key.name}</TableCell>
                        <TableCell><code className="bg-white/10 px-2 py-1 rounded text-gray-300 font-mono text-xs">{key.key_prefix}</code></TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Switch id={`active-switch-${key.id}`} checked={key.is_active} onCheckedChange={(checked) => handleToggleKey(key, checked)} />
                            <label htmlFor={`active-switch-${key.id}`} className={`text-xs font-semibold tracking-wide uppercase ${key.is_active ? 'text-green-400' : 'text-gray-500'}`}>{key.is_active ? "Active" : "Inactive"}</label>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-400 text-sm">{key.last_used_at ? new Date(key.last_used_at).toLocaleString() : 'Never'}</TableCell>
                        <TableCell className="text-right pr-6">
                          <button className="rounded-lg p-2 text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition-colors" onClick={() => setKeyToDelete(key)}>
                            <Trash weight="duotone" className="h-4 w-4" />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow><TableCell colSpan={5} className="text-center text-gray-400 h-24">No API keys found.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[425px] bg-[#050505] border-white/10 text-white rounded-3xl p-6">
          <DialogHeader><DialogTitle className="text-xl font-bold tracking-tight">Create New API Key</DialogTitle></DialogHeader>
          <div className="py-4">
            <label htmlFor="key-name" className="text-sm font-medium text-gray-400">Key Name (optional)</label>
            <Input id="key-name" placeholder="e.g., Production Key" value={newKeyName} onChange={(e) => setNewKeyName(e.target.value)} className="mt-2 h-12 bg-white/5 border-white/10 text-white rounded-xl focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:border-transparent" />
          </div>
          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <button variant="outline" className="rounded-xl px-4 py-2 text-sm font-semibold text-gray-400 hover:text-white transition-colors" onClick={() => setShowCreateDialog(false)}>Cancel</button>
            <button className="flex items-center gap-2 rounded-xl bg-white text-black px-6 py-2 text-sm font-semibold hover:bg-gray-200 transition-colors" onClick={handleCreateKey} disabled={isCreating}>
              {isCreating ? <SpinnerGap className="h-4 w-4 animate-spin" /> : null} {isCreating ? 'Creating...' : 'Create Key'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showNewKeyDialog} onOpenChange={() => setShowNewKeyDialog(false)}>
        <DialogContent className="sm:max-w-md bg-[#050505] border-white/10 text-white rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight text-green-400">Key Generated</DialogTitle>
            <p className="text-gray-400 text-sm mt-2">Save this key now. You will not be able to see it again.</p>
          </DialogHeader>
          <div className="my-6 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between p-4">
            <code className="text-sm text-green-400 font-mono break-all">{generatedKey}</code>
            <button className="rounded-lg p-2 text-gray-400 hover:bg-white/10 hover:text-white transition-colors ml-4 shrink-0" onClick={copyToClipboard}>
              {copied ? <CheckCircle weight="fill" className="h-5 w-5 text-green-400" /> : <Copy weight="duotone" className="h-5 w-5" />}
            </button>
          </div>
          <DialogFooter>
            <button className="w-full flex items-center justify-center gap-2 rounded-xl bg-white text-black px-6 py-3 text-sm font-semibold hover:bg-gray-200 transition-colors" onClick={() => setShowNewKeyDialog(false)}>
              Done
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!keyToDelete} onOpenChange={() => setKeyToDelete(null)}>
        <AlertDialogContent className="bg-[#050505] border-white/10 text-white rounded-3xl p-6">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold tracking-tight text-red-500 flex items-center gap-2"><Warning weight="fill" className="h-6 w-6" /> Destructive Action</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400 mt-2">This will PERMANENTLY DELETE the key &quot;{keyToDelete?.name}&quot;. This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8">
            <AlertDialogCancel className="border-0 bg-transparent text-gray-400 hover:bg-transparent hover:text-white sm:mr-4">Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-0 font-semibold px-6" onClick={handleDeleteKey} disabled={isDeleting}>
              {isDeleting ? <SpinnerGap className="mr-2 h-4 w-4 animate-spin" /> : null} Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}