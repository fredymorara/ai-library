"use client";

import { useState, useEffect } from 'react';

/**
 * A wrapper component that ensures its children are only rendered on the client-side.
 * This is used to prevent React hydration errors with components that rely on
 * browser-only APIs or have different output on the server vs. the client.
 */
export default function ClientOnly({ children }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null; // Render nothing on the server and during the initial client render
  }

  return <>{children}</>;
}
