// src/app/(dashboard)/layout.js
import { UserButton } from "@clerk/nextjs";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-950 p-4 border-b border-gray-800">
        <div className="mx-auto max-w-7xl flex justify-between items-center">
          <h1 className="text-xl font-bold">Dashboard</h1>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>
      <main className="p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}