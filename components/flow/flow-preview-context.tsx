"use client";

import { createContext, useContext, type ReactNode } from "react";

const FlowPreviewContext = createContext(false);

export function FlowPreviewProvider({ children }: { children: ReactNode }) {
  return (
    <FlowPreviewContext.Provider value={true}>
      {children}
    </FlowPreviewContext.Provider>
  );
}

export function useFlowPreview() {
  return useContext(FlowPreviewContext);
}
