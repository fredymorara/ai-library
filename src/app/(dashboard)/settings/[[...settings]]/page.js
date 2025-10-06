// src/app/(dashboard)/settings/page.js
"use client";
import { UserProfile } from "@clerk/nextjs";
import SplitText from "@/blocks/TextAnimations/SplitText/SplitText";
import { Footer } from "@/components/Footer";

export default function SettingsPage() {
   return (
     <>
       <div>
         <SplitText text="Account Settings" className="text-3xl font-bold mb-1 text-white" />
         <p className="text-gray-400 mb-6">Manage your profile and account details.</p>
         <UserProfile appearance={{ baseTheme: 'dark', variables: { colorPrimary: '#818cf8' } }} />
       </div>
       <div className="mt-16"><Footer /></div>
     </>
   );
 }