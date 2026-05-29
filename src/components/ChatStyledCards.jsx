import React from 'react';
import { Robot, User } from '@phosphor-icons/react';

const Container = ({ children }) => (
  <div className="flex h-full w-full flex-col gap-6 overflow-hidden rounded-3xl border border-white/10 bg-[#050505]/95 p-6 shadow-2xl backdrop-blur-2xl">
    <div className="flex items-center gap-3 mb-2 border-b border-white/5 pb-4">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
        <Robot weight="duotone" className="h-5 w-5 text-white" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-white">Library AI</h3>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
          </span>
          <span className="text-xs text-gray-400">Online</span>
        </div>
      </div>
    </div>
    {children}
  </div>
);

const UserMessage = ({ text }) => (
  <div className="flex w-full items-end gap-3 justify-end">
    <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-white p-4 text-sm font-medium leading-relaxed text-black shadow-md">
      <p className="whitespace-pre-wrap">{text}</p>
    </div>
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-black">
      <User weight="fill" className="h-4 w-4" />
    </div>
  </div>
);

const BotMessage = ({ text }) => (
  <div className="flex w-full items-end gap-3 justify-start">
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5">
      <Robot weight="duotone" className="h-4 w-4 text-gray-300" />
    </div>
    <div className="max-w-[80%] rounded-2xl rounded-bl-sm border border-white/10 bg-white/5 p-4 text-sm leading-relaxed text-gray-200">
      <p className="whitespace-pre-wrap">{text}</p>
    </div>
  </div>
);

export const ChatCard1 = () => (
  <Container>
    <UserMessage text="I need a book about artificial intelligence for beginners" />
    <BotMessage text={`I recommend "Artificial Intelligence: A Modern Approach". It's comprehensive yet accessible for beginners.`} />
  </Container>
);

export const ChatCard2 = () => (
  <Container>
    <UserMessage text="Do you have any books on Python programming?" />
    <BotMessage text={`Yes! "Python Crash Course" by Eric Matthes is perfect for beginners. We also have "Automate the Boring Stuff with Python".`} />
  </Container>
);

export const ChatCard3 = () => (
  <Container>
    <UserMessage text="I'm interested in machine learning. What would you suggest?" />
    <BotMessage text={`"Hands-On Machine Learning with Scikit-Learn, Keras & TensorFlow" is excellent. It covers both theory and practical examples in Python.`} />
  </Container>
);
