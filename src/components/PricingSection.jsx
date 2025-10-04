// src/components/PricingSection.jsx
import { Button } from "@/components/ui/button";

export const PricingSection = () => {
  // Helper component for check/cross icons
  const IncludedFeature = ({ children }) => (
    <li className="flex items-center gap-1">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 text-indigo-400"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
      <span className="text-gray-300">{children}</span>
    </li>
  );

  return (
    <section id="pricing" className="bg-transparent text-white">
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">Simple, Transparent Pricing</h2>
          <p className="mt-4 text-gray-400">
            Choose a plan that scales with your institution's needs.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-stretch md:grid-cols-3 md:gap-8">
          {/* Starter Plan */}
          <div className="divide-y divide-gray-700 rounded-2xl border border-gray-700 bg-gray-800/50 shadow-lg">
            <div className="p-6 sm:px-8">
              <h2 className="text-lg font-medium">Community<span className="sr-only">Plan</span></h2>
              <p className="mt-2 text-gray-400">For small community libraries and personal projects.</p>
              <p className="mt-2 sm:mt-4"><strong className="text-3xl font-bold sm:text-4xl">Free</strong></p>
              <Button className="mt-4 w-full" variant="secondary">Get Started</Button>
            </div>
            <div className="p-6 sm:px-8">
              <p className="text-lg font-medium sm:text-xl">What's included:</p>
              <ul className="mt-2 space-y-2 sm:mt-4">
                <IncludedFeature>Up to 5,000 books</IncludedFeature>
                <IncludedFeature>Community Support</IncludedFeature>
              </ul>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="divide-y divide-gray-700 rounded-2xl border border-indigo-500 bg-gray-800/50 shadow-lg ring-2 ring-indigo-500">
            <div className="p-6 sm:px-8">
              <h2 className="text-lg font-medium">Academic<span className="sr-only">Plan</span></h2>
              <p className="mt-2 text-gray-400">Perfect for universities and larger institutions.</p>
              <p className="mt-2 sm:mt-4"><strong className="text-3xl font-bold sm:text-4xl">$99</strong><span className="text-sm font-medium text-gray-400">/month</span></p>
              <Button className="mt-4 w-full">Choose Plan</Button>
            </div>
            <div className="p-6 sm:px-8">
              <p className="text-lg font-medium sm:text-xl">What's included:</p>
              <ul className="mt-2 space-y-2 sm:mt-4">
                <IncludedFeature>Up to 100,000 books</IncludedFeature>
                <IncludedFeature>Email & Chat Support</IncludedFeature>
                <IncludedFeature>Basic Usage Analytics</IncludedFeature>
              </ul>
            </div>
          </div>

          {/* Enterprise Plan */}
          <div className="divide-y divide-gray-700 rounded-2xl border border-gray-700 bg-gray-800/50 shadow-lg">
            <div className="p-6 sm:px-8">
              <h2 className="text-lg font-medium">Enterprise<span className="sr-only">Plan</span></h2>
              <p className="mt-2 text-gray-400">For library networks and custom deployments.</p>
              <p className="mt-2 sm:mt-4"><strong className="text-3xl font-bold sm:text-4xl">Contact Us</strong></p>
              <Button className="mt-4 w-full" variant="secondary">Contact Sales</Button>
            </div>
            <div className="p-6 sm:px-8">
              <p className="text-lg font-medium sm:text-xl">What's included:</p>
              <ul className="mt-2 space-y-2 sm:mt-4">
                <IncludedFeature>Unlimited books</IncludedFeature>
                <IncludedFeature>Dedicated Support</IncludedFeature>
                <IncludedFeature>Advanced Analytics & Reporting</IncludedFeature>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};