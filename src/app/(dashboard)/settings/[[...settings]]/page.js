// src/app/(dashboard)/settings/page.js
"use client";
import { useState, useEffect } from 'react';
import { UserProfile } from "@clerk/nextjs";
import SplitText from "@/blocks/TextAnimations/SplitText/SplitText";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, RefreshCw, CheckIcon } from "lucide-react";

export default function SettingsPage() {

   return (

     <>

       <div className="space-y-8">

         <div>

           <SplitText text="Account Settings" className="text-3xl font-bold mb-1 text-green-500" />

           <p className="text-gray-400 mb-6">Manage your profile and account details.</p>

           <UserProfile appearance={{
             baseTheme: 'dark',
             variables: {
               colorText: '#FFFFFF',
               colorTextSecondary: '#A0A0A0',
               colorPrimary: '#00ff00',
               colorBackground: 'transparent',
             },
             elements: {
               rootBox: {
                 width: '100%',
                 maxWidth: 'none',
               },
               card: {
                 width: '100%',
                 backgroundColor: 'rgba(0, 0, 0, 0.3)',
                 border: '1px solid rgba(255, 255, 255, 0.1)',
                 backdropFilter: 'blur(10px)',
               },
               navbar: {
                 backgroundColor: 'rgba(0, 0, 0, 0.1)',
               },
               navbarButton: {
                 color: '#FFFFFF',
                 '&:hover': {
                   backgroundColor: 'rgba(0, 255, 0, 0.1)',
                 },
                 '&.cl-active': {
                   backgroundColor: 'rgba(0, 255, 0, 0.2)',
                 },
               },
               formFieldInput: {
                 backgroundColor: 'rgba(0, 0, 0, 0.3)',
                 border: '1px solid rgba(255, 255, 255, 0.2)',
                 color: '#FFFFFF',
               },
               formButtonPrimary: {
                 backgroundColor: '#008000',
                 '&:hover': {
                   backgroundColor: '#006400',
                 },
               },
               headerTitle: { color: '#FFFFFF' },
               headerSubtitle: { color: '#A0A0A0' },
               formFieldLabel: { color: '#FFFFFF' },
             },
           }} />

         </div>



       </div>

       <div className="mt-16"><Footer /></div>

     </>

   );

 }