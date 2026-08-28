"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  defaultOnboardingState,
  STORAGE_KEY,
  type OnboardingState,
} from "@/lib/onboarding-state";

type OnboardingContextValue = {
  state: OnboardingState;
  ready: boolean;
  update: (patch: Partial<OnboardingState>) => void;
  reset: () => void;
};

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

function readStoredState(): OnboardingState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultOnboardingState;
    const parsed = JSON.parse(raw) as Partial<OnboardingState>;
    return { ...defaultOnboardingState, ...parsed };
  } catch {
    return defaultOnboardingState;
  }
}

export function OnboardingProvider({
  children,
  persist = true,
}: {
  children: ReactNode;
  /** When false (flow-map previews), use defaults and do not touch localStorage. */
  persist?: boolean;
}) {
  const [state, setState] = useState<OnboardingState>(defaultOnboardingState);
  const [ready, setReady] = useState(!persist);

  useEffect(() => {
    if (!persist) return;
    const frame = window.requestAnimationFrame(() => {
      setState(readStoredState());
      setReady(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [persist]);

  useEffect(() => {
    if (!persist || !ready) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [persist, ready, state]);

  const update = useCallback((patch: Partial<OnboardingState>) => {
    setState((current) => ({ ...current, ...patch }));
  }, []);

  const reset = useCallback(() => {
    setState(defaultOnboardingState);
    if (persist) {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, [persist]);

  const value = useMemo(
    () => ({ state, ready, update, reset }),
    [ready, reset, state, update],
  );

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within OnboardingProvider");
  }
  return context;
}
