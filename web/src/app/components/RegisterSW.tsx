"use client";

import { useEffect } from "react";

export function RegisterSW() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (typeof navigator === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    const controller = new AbortController();
    navigator.serviceWorker
      .register("/sw.js")
      .catch((err) => {
        if (controller.signal.aborted) return;
        console.error("SW registration failed:", err);
      });

    return () => controller.abort();
  }, []);

  return null;
}
