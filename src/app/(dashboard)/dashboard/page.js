// src/app/(dashboard)/dashboard/page.js
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StatCard } from "@/components/StatCard";
import { ArrowUpRight, BookOpen, Users, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  // In the future, this data will come from your database
  const stats = {
    booksIngested: "1,254",
    chatsInitiatedThisMonth: "832",
    totalUsers: "76",
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-white">Welcome Back!</h2>
        {/* This button will eventually link to the onboarding page */}
        <Link href="/onboarding">
          <Button>
            Add New Books <ArrowUpRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* --- STATS GRID --- */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <StatCard
          title="Books Ingested"
          value={stats.booksIngested}
          icon={<BookOpen className="h-4 w-4" />}
          description="Total books in your AI's knowledge base."
        />
        <StatCard
          title="Chats This Month"
          value={stats.chatsInitiatedThisMonth}
          icon={<MessageSquare className="h-4 w-4" />}
          description="+22% from last month"
        />
        <StatCard
          title="Total Users Helped"
          value={stats.totalUsers}
          icon={<Users className="h-4 w-4" />}
          description="Unique chat sessions initiated."
        />
      </div>

      {/* --- MAIN DASHBOARD AREA (CHART + ACTIONS) --- */}
      <div className="grid gap-6 lg:grid-cols-5">
        
        {/* Chart Visualization Placeholder */}
        <Card className="lg:col-span-3 bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Chat Analytics</CardTitle>
            <CardDescription className="text-gray-400">
              User engagement over the last 30 days.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Placeholder for where your chart component will go */}
            <div className="h-60 w-full flex items-center justify-center rounded-lg bg-gray-900 border-2 border-dashed border-gray-700">
              <p className="text-sm text-gray-500">Chart Visualization Coming Soon</p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions / Links Placeholder */}
        <Card className="lg:col-span-2 bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
            <CardDescription className="text-gray-400">
              Manage your assistant and integration.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            <Link href="/onboarding">
              <Button className="w-full justify-start gap-2">
                <BookOpen className="h-4 w-4" /> Onboarding & Data Sync
              </Button>
            </Link>
            <Link href="/snippets">
              <Button className="w-full justify-start gap-2">
                <ArrowUpRight className="h-4 w-4" /> Get Integration Snippets
              </Button>
            </Link>
            <Link href="/settings">
               <Button className="w-full justify-start gap-2">
                <Users className="h-4 w-4" /> Account Settings
              </Button>
            </Link>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}