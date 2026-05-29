// src/app/(dashboard)/dashboard/page.js
"use client"
import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowUpRight, BookOpenText, Users, ChatCircleDots, Code, Gear, CheckCircle } from "@phosphor-icons/react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { Footer } from "@/components/Footer";
import SplitText from "@/blocks/TextAnimations/SplitText/SplitText";
import { useAuth } from "@clerk/nextjs";

const StatCard = ({ title, value, icon, description }) => (
  <div className="p-[6px] rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md">
    <div className="flex h-full flex-col justify-between rounded-[calc(1.5rem-6px)] bg-[#050505]/90 p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
      <div className="flex items-start justify-between">
        <h3 className="text-sm font-medium tracking-wide text-gray-400 uppercase">{title}</h3>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
          {icon}
        </div>
      </div>
      <div className="mt-8">
        <div className="text-4xl font-bold tracking-tight text-white">{value}</div>
        <p className="mt-2 text-xs font-medium text-gray-500">{description}</p>
      </div>
    </div>
  </div>
);

export default function DashboardPage() {
  const [stats, setStats] = useState({ totalBooks: 0, ingestedBooks: 0, chatsThisMonth: 0, change: 0, dailyChats: [] });
  const [loading, setLoading] = useState(true);
  const { getToken, isLoaded } = useAuth();

  const fetchDashboardStats = useCallback(async () => {
    if (!isLoaded) return;
    setLoading(true);
    try {
      const token = await getToken();
      const response = await fetch('/api/admin/analytics', { headers: { 'Authorization': `Bearer ${token}` } });
      
      if (!response.ok) {
        if (response.status === 404) {
          setStats({ totalBooks: 0, ingestedBooks: 0, chatsThisMonth: 0, change: 0, dailyChats: [] });
          return;
        }
        throw new Error("Failed to fetch dashboard stats.");
      }

      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  }, [getToken, isLoaded]);

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  return (
    <>
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-12">
        <div>
          <SplitText text="Overview" className="text-4xl font-bold tracking-tighter text-white sm:text-5xl" />
          <p className="mt-2 text-lg text-gray-400">Your library&apos;s semantic knowledge base at a glance.</p>
        </div>
        <Link href="/onboarding">
          <button className="group relative flex items-center gap-3 rounded-full border border-white/10 bg-white/5 pl-6 pr-2 py-2 text-sm font-semibold text-white transition-all duration-500 hover:bg-white/10 active:scale-[0.98]">
            Manage Books
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-transform duration-500 group-hover:bg-white group-hover:text-black">
              <ArrowUpRight weight="bold" className="h-4 w-4" />
            </div>
          </button>
        </Link>
      </div>

      <div className="space-y-8">
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <StatCard 
            title="Total Books"
            value={loading ? "..." : stats.totalBooks}
            icon={<BookOpenText weight="duotone" className="h-5 w-5 text-white" />}
            description="Total books in your library catalog."
          />
          <StatCard 
            title="Books Ingested"
            value={loading ? "..." : stats.ingestedBooks}
            icon={<CheckCircle weight="duotone" className="h-5 w-5 text-white" />}
            description="Books ready for the AI to use."
          />
          <StatCard 
            title="Chats This Month" 
            value={loading ? "..." : stats.chatsThisMonth} 
            icon={<ChatCircleDots weight="duotone" className="h-5 w-5 text-white" />} 
            description={`${stats.change >= 0 ? '+' : ''}${stats.change}% from last month`} 
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3 rounded-3xl overflow-hidden border border-white/10">
            <ChartAreaInteractive data={stats.dailyChats} />
          </div>

          <div className="lg:col-span-2 p-[6px] rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md">
            <div className="flex h-full flex-col rounded-[calc(1.5rem-6px)] bg-[#050505]/90 p-8 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
              <h3 className="text-xl font-bold text-white tracking-tight">Quick Actions</h3>
              <p className="mt-2 text-sm text-gray-400">Manage your assistant and integration.</p>
              
              <div className="mt-8 flex flex-col gap-3">
                <Link href="/onboarding" className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-4 transition-colors hover:bg-white/10 text-white">
                  <BookOpenText weight="duotone" className="h-5 w-5 text-gray-400" />
                  <span className="font-medium text-sm">Onboarding & Data Sync</span>
                </Link>
                <Link href="/snippets" className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-4 transition-colors hover:bg-white/10 text-white">
                  <Code weight="duotone" className="h-5 w-5 text-gray-400" />
                  <span className="font-medium text-sm">Get Integration Snippets</span>
                </Link>
                <Link href="/settings" className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-4 transition-colors hover:bg-white/10 text-white">
                  <Gear weight="duotone" className="h-5 w-5 text-gray-400" />
                  <span className="font-medium text-sm">Account Settings</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16"><Footer /></div>
    </>
  );
}
