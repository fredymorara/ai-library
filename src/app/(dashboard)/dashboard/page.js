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

      <div className="flex justify-between items-center mb-8">

        <div>

          <SplitText text="Dashboard" className="text-3xl font-bold text-green-500" />

          <p className="text-gray-400">An overview of your library&apos;s stats.</p>

        </div>

        <Link href="/onboarding"><Button>Manage Books <ArrowUpRight className="ml-2 h-4 w-4" /></Button></Link>

      </div>

      <div className="space-y-8">

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

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

          <StatCard title="Chats This Month" value={loading ? "..." : stats.chatsThisMonth} icon={<MessageSquare className="h-4 w-4" />} description={`${stats.change >= 0 ? '+' : ''}${stats.change}% from last month`} />

        </div>

        <div className="grid gap-6 lg:grid-cols-5">

          <div className="lg:col-span-3"><ChartAreaInteractive data={stats.dailyChats} /></div>

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
