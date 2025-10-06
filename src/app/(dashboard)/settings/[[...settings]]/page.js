// src/app/(dashboard)/settings/page.js
"use client";
import SplitText from "@/blocks/TextAnimations/SplitText/SplitText";
import { UserProfile } from "@clerk/nextjs";

export default function SettingsPage() {
   return (
     <div>
       <SplitText
         text="Account Settings"
         className="text-3xl font-bold mb-6"
         from={{ opacity: 0, y: 20 }}
         to={{ opacity: 1, y: 0 }}
         stagger={0.05}
       />
       <UserProfile 
         appearance={{
           baseTheme: 'dark',
           variables: { colorPrimary: '#6366f1' }
         }}
       />
     </div>
   );
 }