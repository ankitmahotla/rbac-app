import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface Session {
  id: string;
  role: string;
  expiresAt: number;
}

interface SessionState {
  session: Session;
  setSession: (session: Session) => void;
  clearSession: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      session: {
        id: "",
        role: "",
        expiresAt: 0,
      },
      setSession: (session) => set({ session }),
      clearSession: () =>
        set({
          session: {
            id: "",
            role: "",
            expiresAt: 0,
          },
        }),
    }),
    {
      name: "session-storage",
      storage: createJSONStorage(() => localStorage),
      // Add hydration listener
      onRehydrateStorage: () => (state) => {
        console.log("Hydration complete", state?.session);
      },
    },
  ),
);
