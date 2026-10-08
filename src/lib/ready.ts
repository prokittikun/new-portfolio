"use client";

import { useSyncExternalStore } from "react";

// Flips to true once the preloader curtain starts lifting, so intro
// animations play when they're actually visible.
let ready = false;
const listeners = new Set<() => void>();

export function setReady() {
  if (ready) return;
  ready = true;
  listeners.forEach((l) => l());
}

export function useReady() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => ready,
    () => false,
  );
}
