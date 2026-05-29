// src/components/AboutSection.jsx
"use client";

import { motion } from "motion/react";

export const AboutSection = () => {
  return (
    <section id="about" className="relative z-10 w-full overflow-hidden bg-transparent py-24 sm:py-32 lg:py-40 border-t border-white/5">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-16">
          
          <motion.div 
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.0, ease: [0.32, 0.72, 0, 1] }}
            className="w-full lg:w-1/2"
          >
            <span className="mb-6 inline-block rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-medium tracking-[0.2em] text-white/70 uppercase">
              The Thesis
            </span>
            <h2 className="text-5xl font-bold tracking-tighter text-white sm:text-6xl md:text-7xl leading-[1.05]">
              Rethinking <br /> Library Search.
            </h2>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.0, ease: [0.32, 0.72, 0, 1], delay: 0.2 }}
            className="w-full lg:w-1/2"
          >
            <div className="p-[6px] rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-md">
              <div className="rounded-[calc(2rem-6px)] bg-[#050505]/90 p-8 sm:p-12 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                <p className="text-xl sm:text-2xl font-medium leading-relaxed text-white">
                  The Smart Library Assistant is a university project engineered by <strong className="text-white">Fredrick M. Morara</strong>.
                </p>
                <div className="mt-8 h-[1px] w-12 bg-white/20"></div>
                <p className="mt-8 text-lg leading-relaxed text-gray-400">
                  It serves as a functional proof-of-concept demonstrating how modern AI pipelines—specifically Retrieval-Augmented Generation (RAG)—can transform static, keyword-based library catalogues into intuitive, semantic search engines capable of understanding human intent.
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};