// src/components/Footer.jsx
"use client";

import { motion } from "motion/react";
import { ArrowUpRight } from "@phosphor-icons/react";

export const Footer = () => {
  return (
    <footer id="contact" className="relative z-10 w-full overflow-hidden bg-transparent pt-24 sm:pt-32 lg:pt-40">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        
        <motion.div 
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.0, ease: [0.32, 0.72, 0, 1] }}
          className="flex flex-col items-center text-center"
        >
          <h2 className="text-[12vw] font-bold tracking-tighter text-white leading-none md:text-[8vw] lg:text-[6rem]">
            Collaborate.
          </h2>
          
          <a 
            href="mailto:momanyifredm@gmail.com" 
            className="group relative mt-12 flex items-center gap-3 rounded-full border border-white/10 bg-white/5 pl-8 pr-3 py-3 text-lg font-medium text-white backdrop-blur-md transition-all duration-500 hover:bg-white/10"
          >
            <span>momanyifredm@gmail.com</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-transform duration-500 group-hover:rotate-45 group-hover:bg-white text-white group-hover:text-black">
              <ArrowUpRight weight="bold" className="h-5 w-5" />
            </div>
          </a>
        </motion.div>

        <div className="mt-32 flex flex-col items-center justify-between border-t border-white/5 py-8 md:flex-row">
          <p className="text-sm font-medium tracking-wide text-gray-500 uppercase">
            &copy; {new Date().getFullYear()} Library AI.
          </p>
          <div className="mt-4 flex gap-6 md:mt-0">
            <a href="https://github.com/fredymorara" target="_blank" rel="noopener noreferrer" className="text-sm font-medium tracking-wide text-gray-500 uppercase transition-colors hover:text-white">Github</a>
            <a href="https://www.linkedin.com/in/freddymorara" target="_blank" rel="noopener noreferrer" className="text-sm font-medium tracking-wide text-gray-500 uppercase transition-colors hover:text-white">LinkedIn</a>
          </div>
        </div>

      </div>
    </footer>
  );
};