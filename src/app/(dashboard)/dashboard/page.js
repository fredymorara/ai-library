// src/app/(dashboard)/dashboard/page.js
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowUpRight, BookOpen, Users, MessageSquare, Code, Settings } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/Footer";

// StatCard component defined locally for this page
const StatCard = ({ title, value, icon, description }) => (
  <Card className="border-gray-800 bg-black/30 backdrop-blur-md">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-gray-400">{title}</CardTitle>
      <div className="text-gray-400">{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-white">{value}</div>
      <p className="text-xs text-gray-500">{description}</p>
    </CardContent>
  </Card>
);

export default function DashboardPage() {
  // In the future, this data will come from your database
  const stats = {
    booksIngested: "1,254",
    chatsInitiatedThisMonth: "832",
    totalUsers: "76",
  };
  const glassEffect = "border-gray-800 bg-black/30 backdrop-blur-md";

  return (
    // Use a React Fragment to wrap the page content and the footer
    <>
      <div className="mx-auto max-w-7xl">
        {/* The page title is now in layout.js, so this section just has the button */}
        <div className="flex justify-end items-center mb-6">
          <Link href="/onboarding">
            <Button>
              Add New Books <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* --- STATS GRID --- */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
          <StatCard title="Books Ingested" value={stats.booksIngested} icon={<BookOpen className="h-4 w-4" />} description="Total books in your AI's knowledge base." />
          <StatCard title="Chats This Month" value={stats.chatsInitiatedThisMonth} icon={<MessageSquare className="h-4 w-4" />} description="+22% from last month" />
          <StatCard title="Total Users Helped" value={stats.totalUsers} icon={<Users className="h-4 w-4" />} description="Unique chat sessions initiated." />
        </div>

        {/* --- MAIN DASHBOARD AREA (CHART + ACTIONS) --- */}
        <div className="grid gap-6 lg:grid-cols-5">
          <Card className={cn("lg:col-span-3", glassEffect)}>
            <CardHeader>
              <CardTitle className="text-white">Chat Analytics</CardTitle>
              <CardDescription className="text-gray-400">User engagement over the last 30 days.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-60 w-full flex items-center justify-center rounded-lg bg-black/20 border-2 border-dashed border-gray-700">
                <p className="text-sm text-gray-500">Chart Visualization Coming Soon</p>
              </div>
            </CardContent>
          </Card>

          <Card className={cn("lg:col-span-2", glassEffect)}>
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
              <CardDescription className="text-gray-400">Manage your assistant and integration.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col space-y-4">
              <Link href="/onboarding"><Button className="w-full justify-start gap-2"><BookOpen className="h-4 w-4" /> Onboarding & Data Sync</Button></Link>
              <Link href="/snippets"><Button className="w-full justify-start gap-2"><Code className="h-4 w-4" /> Get Integration Snippets</Button></Link>
              <Link href="/settings"><Button className="w-full justify-start gap-2"><Settings className="h-4 w-4" /> Account Settings</Button></Link>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Footer is placed at the end of the page content */}
      <div className="mt-16">
        <Footer />
      </div>
    </>
  );
}