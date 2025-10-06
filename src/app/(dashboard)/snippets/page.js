// src/app/(dashboard)/onboarding/page.js
"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import SplitText from "@/blocks/TextAnimations/SplitText/SplitText";
import { Footer } from "@/components/Footer";

export default function OnboardingPage() {
   return (
     <>
       <div className="mx-auto max-w-4xl space-y-8">
         <div className="text-center">
           <SplitText text="Onboarding" className="text-3xl font-bold text-white" />
           <p className="mt-2 text-gray-400">Sync your library's collection to activate your AI assistant.</p>
         </div>
         <Card className="bg-black/30 backdrop-blur-md border-gray-800">
           <CardHeader>
             <CardTitle className="text-white">Upload Your Book Data</CardTitle>
             <CardDescription className="text-gray-300">Please upload a CSV file with 'title' and 'authors' columns.</CardDescription>
           </CardHeader>
           <CardContent>
             <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border-2 border-dashed border-gray-700 p-12">
               <Upload className="h-12 w-12 text-gray-500" />
               <p className="text-gray-400">Drag & drop your CSV file here, or</p>
               <Button variant="outline">Browse Files</Button>
             </div>
           </CardContent>
         </Card>
       </div>
       <div className="mt-16"><Footer /></div>
     </>
   );
 }