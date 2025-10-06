// src/app/(dashboard)/snippets/page.js
"use client";
import SplitText from "@/blocks/TextAnimations/SplitText/SplitText";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const CodeBlock = ({ children }) => (
   <pre className="mt-4 rounded-lg bg-gray-950 p-4 text-sm text-gray-300 overflow-x-auto">
     <code>{children}</code>
   </pre>
 );

export default function SnippetsPage() {
   // Placeholder - we will fetch this from Supabase later
   const apiKey = "sk-xxxxxxxx-your-unique-api-key-xxxxxxxx";

   const htmlSnippet = `
<div id="ai-library-chat-widget"></div>
<script>
window.aiLibraryConfig = {
apiKey: "${apiKey}",
};
</script>
<script src="https://your-domain.com/widget.js" defer></script>
`;

   return (
     <div className="mx-auto max-w-4xl space-y-8">
       <div className="text-center">
         <SplitText
           text="Integration Snippets"
           className="text-3xl font-bold"
           from={{ opacity: 0, y: 20 }}
           to={{ opacity: 1, y: 0 }}
           stagger={0.05}
         />
         <p className="text-gray-400">Embed the chat assistant directly into your existing library website.</p>
       </div>

       <Card className="bg-gray-900/50 border-gray-800">
         <CardHeader>
           <CardTitle>Your API Key</CardTitle>
           <CardDescription>
             This key is unique to your institution. Keep it secure.
           </CardDescription>
         </CardHeader>
         <CardContent>
           <div className="rounded-md bg-gray-950 p-3">
             <p className="text-sm font-mono text-green-400">{apiKey}</p>
           </div>
         </CardContent>
       </Card>

       <Card className="bg-gray-900/50 border-gray-800">
         <CardHeader>
           <CardTitle>HTML Snippet</CardTitle>
           <CardDescription>
             Paste this code into the HTML of your library page where you want the chat widget to appear.
           </CardDescription>
         </CardHeader>
         <CardContent>
           <CodeBlock>{htmlSnippet.trim()}</CodeBlock>
         </CardContent>
       </Card>
     </div>
   );
 }