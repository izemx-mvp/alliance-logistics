/**
 * Mock client session for the demo /espace-client (NO real authentication).
 * Stored in sessionStorage only; replace with a real auth provider in a later phase.
 */
import { useEffect, useState } from "react";

const KEY = "alliance-demo-session";

export function signInDemo(email: string) {
  try {
    window.sessionStorage.setItem(KEY, email);
  } catch {
    /* ignore */
  }
}

export function signOutDemo() {
  try {
    window.sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

/** `undefined` while reading (SSR / first render), `null` when signed out. */
export function useDemoSession(): string | null | undefined {
  const [email, setEmail] = useState<string | null | undefined>(undefined);
  useEffect(() => {
    try {
      setEmail(window.sessionStorage.getItem(KEY));
    } catch {
      setEmail(null);
    }
  }, []);
  return email;
}
