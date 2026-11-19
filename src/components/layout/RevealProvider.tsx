"use client";

import React from "react";
import { useReveal } from "@/lib/reveal";

export function RevealProvider({ children }: { children: React.ReactNode }) {
  useReveal();
  return <>{children}</>;
}
