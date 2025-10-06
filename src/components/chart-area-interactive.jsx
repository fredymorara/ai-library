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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// UPDATED: Data is now for the current year, 2025
const chartData = [
  // March 2025
  { date: "2025-03-15", chats: 120 }, { date: "2025-03-16", chats: 138 },
  // April 2025
  { date: "2025-04-10", chats: 261 }, { date: "2025-04-11", chats: 327 },
  { date: "2025-04-25", chats: 215 }, { date: "2025-04-26", chats: 75 },
  { date: "2025-04-27", chats: 383 }, { date: "2025-04-28", chats: 122 },
  { date: "2025-04-29", chats: 315 }, { date: "2025-04-30", chats: 454 },
  // May 2025
  { date: "2025-05-01", chats: 165 }, { date: "2025-05-05", chats: 481 },
  { date: "2025-05-06", chats: 498 }, { date: "2025-05-15", chats: 473 },
  { date: "2025-05-20", chats: 177 }, { date: "2025-05-25", chats: 201 },
  { date: "2025-05-30", chats: 340 }, { date: "2025-05-31", chats: 178 },
  // June 2025
  { date: "2025-06-01", chats: 178 }, { date: "2025-06-02", chats: 470 },
  { date: "2025-06-03", chats: 103 }, { date: "2025-06-04", chats: 439 },
  { date: "2025-06-05", chats: 88 },  { date: "2025-06-06", chats: 294 },
  { date: "2025-06-07", chats: 323 }, { date: "2025-06-08", chats: 385 },
  { date: "2025-06-09", chats: 438 }, { date: "2025-06-10", chats: 155 },
];

const chartConfig = {
  chats: { label: "Chats", color: "hsl(var(--chart-1))" },
};

// NEW: Helper function to generate placeholder data for a flat line
const generatePlaceholderData = (days) => {
  const today = new Date("2025-06-10"); // Use the simulated current date
  const data = [];
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    data.push({
      date: date.toISOString().split('T')[0], // Format as 'YYYY-MM-DD'
      chats: 0,
    });
  }
  return data.reverse(); // Reverse to have the oldest date first
};

export function ChartAreaInteractive() {
  const [timeRange, setTimeRange] = React.useState("90d");

  // Determine the number of days to show based on the selected time range
  const daysToSubtract = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
  
  // Calculate the start date for filtering
  const now = new Date("2025-06-10"); // Use the simulated current date
  const startDate = new Date(now);
  startDate.setDate(now.getDate() - daysToSubtract);

  // Filter the real data
  let filteredData = chartData.filter((item) => new Date(item.date) > startDate);

  // THIS IS THE FIX: If there's no data, generate a flat line
  if (filteredData.length === 0) {
    filteredData = generatePlaceholderData(daysToSubtract);
  }

  return (
    <Card className={cn("border-gray-800 bg-black/30 backdrop-blur-md")}>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b border-gray-800 py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle className="text-white">Chat Analytics</CardTitle>
          <CardDescription className="text-gray-300">
            Showing total chats for the selected period
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto bg-gray-900 border-gray-700 text-gray-200 hover:bg-gray-800" aria-label="Select a value">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent className="rounded-xl bg-gray-900 border-gray-700 text-white">
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={filteredData}>
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