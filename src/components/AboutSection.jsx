// src/components/AboutSection.jsx
import React from "react";
import { FiInfo } from "react-icons/fi";

export const AboutSection = () => {
  return (
    <section id="about" className="bg-transparent text-white py-16 sm:py-24">
      <div className="mx-auto max-w-screen-xl px-4">
        
        <div className="mx-auto"> 
        
          <div className="block rounded-xl border border-gray-800 bg-black/30 backdrop-blur-sm p-8 shadow-xl transition hover:border-indigo-500/10 hover:shadow-indigo-500/10">
            
            <div className="flex items-center gap-4">
              <FiInfo className="text-indigo-400 text-3xl" />
              <h2 className="text-3xl font-bold text-white">About This Project</h2>
            </div>

            <p className="mt-4 text-xl text-gray-300 leading-relaxed">
              The Smart Library Assistant is a university project created by <strong>Fredrick M. Morara</strong>. It serves as a proof-of-concept demonstrating how modern AI techniques like Retrieval-Augmented Generation (RAG) can be used to create a more intuitive and powerful search experience for institutional libraries.
            </p>

          </div>
        </div>

      </div>
    </section>
  );
};