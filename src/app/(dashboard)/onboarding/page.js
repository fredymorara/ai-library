// src/app/(dashboard)/onboarding/page.js
"use client";
import SplitText from "@/blocks/TextAnimations/SplitText/SplitText";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export default function OnboardingPage() {
   return (
     <div className="mx-auto max-w-4xl space-y-8">
       <div className="text-center">
         <SplitText
           text="Onboarding"
           className="text-3xl font-bold"
           from={{ opacity: 0, y: 20 }}
           to={{ opacity: 1, y: 0 }}
           stagger={0.05}
         />
         <p className="text-gray-400">Sync your library's collection to activate your AI assistant.</p>
       </div>

       <Card className="bg-gray-900/50 border-gray-800">
         <CardHeader>
           <CardTitle>Upload Your Book Data</CardTitle>
           <CardDescription>
             Please upload a CSV file containing your book collection. The file should have columns for 'title' and 'authors'.
           </CardDescription>
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
   );
 }