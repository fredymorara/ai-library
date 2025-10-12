// src/components/FeaturesSection.jsx
import { FiCpu, FiMessageSquare, FiPackage } from "react-icons/fi";

const FeatureCard = ({ icon, title, children }) => (
  <div className="block rounded-xl border border-gray-800 bg-black/30 backdrop-blur-sm p-8 shadow-xl transition hover:border-green-500/10 hover:shadow-green-500/10">
    <div className="text-green-400 text-3xl">{icon}</div>
    <h2 className="mt-4 text-xl font-bold text-white">{title}</h2>
    <p className="mt-1 text-sm text-gray-300">{children}</p>
  </div>
);

export const FeaturesSection = () => {
  return (
    <section id="features" className="bg-transparent text-white">
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">How It Works</h2>
          <p className="mt-4 text-gray-400">
            A smarter search engine built on three core principles.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard icon={<FiCpu />} title="Intelligent Data Enrichment">
            During onboarding, our AI researches each book in your catalogue, understanding its core concepts beyond just metadata. This creates a rich, conceptual "brain" for your library.
          </FeatureCard>

          <FeatureCard icon={<FiMessageSquare />} title="Natural Language Chat">
            Users can ask vague, topic-based questions in plain language. Our system uses a RAG pipeline to understand the user's intent and find the most relevant books from the enriched data.
          </FeatureCard>
          
          <FeatureCard icon={<FiPackage />} title="Simple Integration">
            Our service is designed to be easily embedded into your existing library website. Provide your credentials, and the chat assistant is ready to help your users.
          </FeatureCard>
        </div>
      </div>
    </section>
  );
};