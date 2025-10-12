// src/components/chart-area-interactive.jsx
"use client";
import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";

const chartConfig = {
  chats: { label: "Chats", color: "hsl(var(--chart-1))" },
};

// Helper to create a complete 30-day data map
const generateDateMap = (days) => {
  const map = new Map();
  const today = new Date();
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const formattedDate = date.toISOString().split('T')[0];
    map.set(formattedDate, { date: formattedDate, chats: 0 });
  }
  return map;
};

export function ChartAreaInteractive({ data: rawData = [] }) {
  const [timeRange, setTimeRange] = React.useState("30d");

  const chartData = React.useMemo(() => {
    const days = 30; // We are now always showing the last 30 days
    const dateMap = generateDateMap(days);

    // Populate the map with real data from the API
    if (rawData && rawData.length > 0) {
      for (const item of rawData) {
        const formattedDate = new Date(item.day).toISOString().split('T')[0];
        if (dateMap.has(formattedDate)) {
          dateMap.set(formattedDate, { date: formattedDate, chats: item.count });
        }
      }
    }
    // Convert map to array and sort by date
    return Array.from(dateMap.values()).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [rawData]);

  return (
    <Card className={cn("border-gray-800 bg-black/30 backdrop-blur-md")}>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b border-gray-800 py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle className="text-white">Chat Analytics</CardTitle>
          <CardDescription className="text-gray-300">
            Showing total chats for the last 30 days
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillChats" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis
              dataKey="date"
              tickLine={false} axisLine={false} tickMargin={8}
              tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              stroke="rgba(255, 255, 255, 0.5)"
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
            <Area dataKey="chats" type="natural" fill="url(#fillChats)" stroke="hsl(var(--chart-1))" />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
