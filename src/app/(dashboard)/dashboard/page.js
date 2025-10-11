"use client"
import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowUpRight, BookOpen, Users, MessageSquare, Code, Settings, CheckCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { Footer } from "@/components/Footer";
import SplitText from "@/blocks/TextAnimations/SplitText/SplitText";
import { useAuth } from "@clerk/nextjs";

const StatCard = ({ title, value, icon, description }) => (
  <Card className="border-gray-800 bg-black/30 backdrop-blur-md">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-gray-300">{title}</CardTitle><div className="text-gray-300">{icon}</div></CardHeader>
    <CardContent><div className="text-2xl font-bold text-white">{value}</div><p className="text-xs text-gray-400">{description}</p></CardContent>
  </Card>
);

export default function DashboardPage() {
  const [stats, setStats] = useState({ totalBooks: 0, ingestedBooks: 0 });
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getToken();
      // We only need the counts, so we can ask for a single row to be efficient
      const url = `/api/admin/books?limit=1`; 
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch stats.');
      const { totalCount } = await response.json();

      // To get the ingested count, we need a separate query for now.
      // In a real-world scenario, this might be a dedicated stats endpoint.
      const ingestedUrl = `/api/admin/books?limit=1&is_ingested=true`;
      const ingestedResponse = await fetch(ingestedUrl, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!ingestedResponse.ok) throw new Error('Failed to fetch ingested stats.');
      const { totalCount: ingestedCount } = await ingestedResponse.json();

      setStats({ totalBooks: totalCount, ingestedBooks: ingestedCount });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <SplitText text="Dashboard" className="text-3xl font-bold text-white" />
          <p className="text-gray-400">An overview of your library&apos;s stats.</p>
        </div>
        <Link href="/onboarding"><Button>Manage Books <ArrowUpRight className="ml-2 h-4 w-4" /></Button></Link>
      </div>
      <div className="space-y-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Total Books"
            value={loading ? "..." : stats.totalBooks}
            icon={<BookOpen className="h-4 w-4" />}
            description="Total books in your library catalog."
          />
          <StatCard 
            title="Books Ingested"
            value={loading ? "..." : stats.ingestedBooks}
            icon={<CheckCircle className="h-4 w-4" />}
            description="Books ready for the AI to use."
          />
          <StatCard title="Chats This Month" value="832" icon={<MessageSquare className="h-4 w-4" />} description="+22% from last month" />
          <StatCard title="Total Users Helped" value="76" icon={<Users className="h-4 w-4" />} description="Unique chat sessions initiated." />
        </div>
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3"><ChartAreaInteractive /></div>
          <Card className={cn("lg:col-span-2", "border-gray-800 bg-black/30 backdrop-blur-md")}>
            <CardHeader><CardTitle className="text-white">Quick Actions</CardTitle><CardDescription className="text-gray-300">Manage your assistant and integration.</CardDescription></CardHeader>
            <CardContent className="flex flex-col space-y-4">
              <Link href="/onboarding"><Button className="w-full justify-start gap-2"><BookOpen className="h-4 w-4" /> Onboarding & Data Sync</Button></Link>
              <Link href="/snippets"><Button className="w-full justify-start gap-2"><Code className="h-4 w-4" /> Get Integration Snippets</Button></Link>
              <Link href="/settings"><Button className="w-full justify-start gap-2"><Settings className="h-4 w-4" /> Account Settings</Button></Link>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="mt-16"><Footer /></div>
    </>
  );
}
