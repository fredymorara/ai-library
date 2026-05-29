"use client";

import { CreateOrganization } from "@clerk/nextjs";
import Particles from "@/blocks/Backgrounds/Particles/Particles";

export default function OrganizationSetupPage() {
  return (
    <div className="relative flex justify-center items-center min-h-screen bg-black overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-40">
        <Particles
          particleColors={['#ffffff', '#ffffff']}
          particleCount={1000}
          particleSpread={10}
          speed={0.2}
          particleBaseSize={150}
          alphaParticles={true}
        />
      </div>
      <div className="relative z-10 flex flex-col items-center gap-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Setup Your Library</h1>
          <p className="text-gray-400 text-sm">Create an organization to manage your catalog and API keys.</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl shadow-2xl">
          <CreateOrganization 
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-[#050505] shadow-none border border-white/5",
                headerTitle: "text-white",
                headerSubtitle: "text-gray-400",
                socialButtonsBlockButton: "border-white/10 text-white hover:bg-white/5",
                formButtonPrimary: "bg-white text-black hover:bg-gray-200",
                formFieldLabel: "text-gray-400",
                formFieldInput: "bg-white/5 border-white/10 text-white",
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
