// src/components/FeaturesSection.jsx
"use client";

import { Brain, ChatCircleText, PlugsConnected } from "@phosphor-icons/react";
import { motion } from "motion/react";

const DoubleBezelCard = ({ className, children }) => (
  <div className={`p-[6px] rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-md ${className}`}>
    <div className="h-full w-full rounded-[calc(2rem-6px)] bg-[#050505]/90 p-8 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
      {children}
    </div>
  </div>
);

export const FeaturesSection = () => {
  return (
    <section id="features" className="relative z-10 w-full overflow-hidden bg-transparent py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        
        <motion.div 
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.0, ease: [0.32, 0.72, 0, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="mb-6 inline-block rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-medium tracking-[0.2em] text-white/70 uppercase">
            Core Architecture
          </span>
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Smarter Search. <br /> Built for Intuition.
          </h2>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-6 lg:mt-24 lg:gap-8">
          
          <motion.div 
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 1.0, ease: [0.32, 0.72, 0, 1], delay: 0.1 }}
            className="md:col-span-4"
          >
            <DoubleBezelCard className="h-full">
              <div className="flex h-full flex-col justify-between">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                    <Brain weight="duotone" className="text-2xl text-white" />
                  </div>
                  <h3 className="mt-6 text-2xl font-bold text-white tracking-tight">Intelligent Data Enrichment</h3>
                  <p className="mt-4 max-w-[45ch] text-lg leading-relaxed text-gray-400">
                    During onboarding, our AI actively researches each book in your catalogue, understanding its core concepts beyond just metadata to build a rich conceptual index.
                  </p>
                </div>
              </div>
            </DoubleBezelCard>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 1.0, ease: [0.32, 0.72, 0, 1], delay: 0.2 }}
            className="md:col-span-2"
          >
            <DoubleBezelCard className="h-full">
              <div className="flex h-full flex-col justify-between">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                    <PlugsConnected weight="duotone" className="text-2xl text-white" />
                  </div>
                  <h3 className="mt-6 text-2xl font-bold text-white tracking-tight">Simple Integration</h3>
                  <p className="mt-4 text-lg leading-relaxed text-gray-400">
                    Provide your credentials, and the assistant is ready to drop into your existing library website.
                  </p>
                </div>
              </div>
            </DoubleBezelCard>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 1.0, ease: [0.32, 0.72, 0, 1], delay: 0.3 }}
            className="md:col-span-6"
          >
            <DoubleBezelCard>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                <div className="max-w-2xl">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                    <ChatCircleText weight="duotone" className="text-2xl text-white" />
                  </div>
                  <h3 className="mt-6 text-3xl font-bold text-white tracking-tight">Natural Language Chat</h3>
                  <p className="mt-4 text-lg leading-relaxed text-gray-400">
                    Users can ask vague, topic-based questions in plain language. Our system uses a high-performance RAG pipeline to map their intent to the exact concepts in your catalogue.
                  </p>
                </div>
                <div className="hidden lg:block h-32 w-48 rounded-[1.5rem] bg-gradient-to-tr from-white/[0.02] to-white/[0.08] border border-white/5 shadow-inner"></div>
              </div>
            </DoubleBezelCard>
          </motion.div>

        </div>
      </div>
    </section>
  );
};