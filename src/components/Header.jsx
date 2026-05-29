// src/components/Header.jsx
"use client";

import React from "react";
import { Star, Info, Envelope } from "@phosphor-icons/react";
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

import ClientOnly from "@/components/utils/ClientOnly";

import { Logo } from "@/components/Logo";

const LoginButton = React.forwardRef((props, ref) => {
  const { afterSignInUrl, ...rest } = props;
  return (
    <button
      ref={ref}
      {...rest}
      className="rounded-full px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:text-white"
    >
      Login
    </button>
  );
});
LoginButton.displayName = "LoginButton";

const RegisterButton = React.forwardRef((props, ref) => {
  const { afterSignUpUrl, ...rest } = props;
  return (
    <button
      ref={ref}
      {...rest}
      className="rounded-full bg-white px-5 py-2 text-sm font-medium text-black transition-all hover:bg-white/90 active:scale-95"
    >
      Register
    </button>
  );
});
RegisterButton.displayName = "RegisterButton";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/40 backdrop-blur-md border-b border-white/5">
      <div className="mx-auto flex h-20 max-w-screen-xl items-center gap-8 px-4 sm:px-6 lg:px-8">
        <a className="flex items-center gap-3 text-white transition-opacity hover:opacity-80" href="/">
          <Logo className="h-8 w-8 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
          <span className="text-sm font-semibold tracking-wide uppercase">Library AI</span>
        </a>

        <div className="flex flex-1 items-center justify-end md:justify-between">
          <nav aria-label="Global" className="hidden md:block">
            <ul className="flex items-center gap-8 text-[13px] font-medium tracking-wide uppercase text-white/50">
              <li>
                <a className="flex items-center gap-2 transition hover:text-white" href="#features">
                  <Star weight="fill" className="text-[14px]" /> Features
                </a>
              </li>
              <li>
                <a className="flex items-center gap-2 transition hover:text-white" href="#about">
                  <Info weight="fill" className="text-[14px]" /> About
                </a>
              </li>
              <li>
                <a className="flex items-center gap-2 transition hover:text-white" href="#contact">
                  <Envelope weight="fill" className="text-[14px]" /> Contact
                </a>
              </li>
            </ul>
          </nav>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <ClientOnly>
                <SignedOut>
                  <SignInButton mode="modal">
                    <LoginButton />
                  </SignInButton>
                  <SignUpButton mode="modal" afterSignUpUrl="/dashboard">
                    <RegisterButton />
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <UserButton afterSignOutUrl="/" />
                </SignedIn>
              </ClientOnly>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};