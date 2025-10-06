// src/app/(dashboard)/dashboard/page.js
"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowUpRight, BookOpen, Users, MessageSquare, Code, Settings } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { Footer } from "@/components/Footer";
import SplitText from "@/blocks/TextAnimations/SplitText/SplitText";

const StatCard = ({ title, value, icon, description }) => (
  <Card className="border-gray-800 bg-black/30 backdrop-blur-md">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-gray-300">{title}</CardTitle><div className="text-gray-300">{icon}</div></CardHeader>
    <CardContent><div className="text-2xl font-bold text-white">{value}</div><p className="text-xs text-gray-400">{description}</p></CardContent>
  </Card>
);

export default function DashboardPage() {
  const stats = { booksIngested: "1,254", chatsInitiatedThisMonth: "832", totalUsers: "76" };
  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <SplitText text="Dashboard" className="text-3xl font-bold text-white" />
          <p className="text-gray-400">An overview of your library's stats.</p>
        </div>
        <Link href="/onboarding"><Button>Add New Books <ArrowUpRight className="ml-2 h-4 w-4" /></Button></Link>
      </div>
      <div className="space-y-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatCard title="Books Ingested" value={stats.booksIngested} icon={<BookOpen className="h-4 w-4" />} description="Total books in your AI's knowledge base." />
          <StatCard title="Chats This Month" value={stats.chatsInitiatedThisMonth} icon={<MessageSquare className="h-4 w-4" />} description="+22% from last month" />
          <StatCard title="Total Users Helped" value={stats.totalUsers} icon={<Users className="h-4 w-4" />} description="Unique chat sessions initiated." />
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