import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSessionStore } from "@/store/auth";

export function useProtectedSession() {
  const router = useRouter();
  const { session, clearSession } = useSessionStore();
  const [isHydrated, setIsHydrated] = useState(false);
  const hasRedirected = useRef(false);

  useEffect(() => {
    const unsub = useSessionStore.persist.onFinishHydration(() => {
      setIsHydrated(true);
    });
    if (useSessionStore.persist.hasHydrated()) {
      setIsHydrated(true);
    }
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!isHydrated || hasRedirected.current) return;

    const now = Date.now();
    const isExpired = session.expiresAt !== 0 && session.expiresAt <= now;
    const isInvalid = !session.id || isExpired;

    if (isInvalid) {
      hasRedirected.current = true; // Prevent further runs
      clearSession();
      router.replace("/login");
    }
  }, [isHydrated, session, clearSession, router]);

  return { session, isHydrated };
}
