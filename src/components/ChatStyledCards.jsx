import React from 'react';
import { Bot, User } from 'lucide-react';

// Individual chat card components matching your ChatAssistant design
export const ChatCard1 = () => (
  <div className="w-full h-full bg-gray-950/90 backdrop-blur-lg border border-gray-800 rounded-2xl p-6 flex flex-col gap-4">
    {/* User Message */}
    <div className="flex items-start gap-3 justify-end">
      <div className="max-w-[280px] p-3 rounded-xl bg-green-600/40 text-white">
        <p className="text-sm">I need a book about artificial intelligence for beginners</p>
      </div>
      <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
        <User className="h-5 w-5" />
      </div>
    </div>
    
    {/* Bot Message */}
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
        <Bot className="h-5 w-5 text-green-400" />
      </div>
      <div className="max-w-[280px] p-3 rounded-xl bg-gray-800 text-gray-300">
        <p className="text-sm">I recommend "Artificial Intelligence: A Modern Approach" by Stuart Russell. It's comprehensive yet accessible for beginners.</p>
      </div>
    </div>
  </div>
);

export const ChatCard2 = () => (
  <div className="w-full h-full bg-gray-950/90 backdrop-blur-lg border border-gray-800 rounded-2xl p-6 flex flex-col gap-4">
    <div className="flex items-start gap-3 justify-end">
      <div className="max-w-[280px] p-3 rounded-xl bg-green-600/40 text-white">
        <p className="text-sm">Do you have any books on Python programming?</p>
      </div>
      <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
        <User className="h-5 w-5" />
      </div>
    </div>
    
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
        <Bot className="h-5 w-5 text-green-400" />
      </div>
      <div className="max-w-[280px] p-3 rounded-xl bg-gray-800 text-gray-300">
        <p className="text-sm">Yes! "Python Crash Course" by Eric Matthes is perfect for beginners. We also have "Automate the Boring Stuff with Python" available.</p>
      </div>
    </div>
  </div>
);

export const ChatCard3 = () => (
  <div className="w-full h-full bg-gray-950/90 backdrop-blur-lg border border-gray-800 rounded-2xl p-6 flex flex-col gap-4">
    <div className="flex items-start gap-3 justify-end">
      <div className="max-w-[280px] p-3 rounded-xl bg-green-600/40 text-white">
        <p className="text-sm">I'm interested in machine learning. What would you suggest?</p>
      </div>
      <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
        <User className="h-5 w-5" />
      </div>
    </div>
    
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
        <Bot className="h-5 w-5 text-green-400" />
      </div>
      <div className="max-w-[280px] p-3 rounded-xl bg-gray-800 text-gray-300">
        <p className="text-sm">"Hands-On Machine Learning with Scikit-Learn, Keras & TensorFlow" is excellent. It covers both theory and practical examples in Python.</p>
      </div>
    </div>
  </div>
);
