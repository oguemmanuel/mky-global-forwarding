"use client";

import { useSyncExternalStore } from "react";
import { MessageCircle, X } from "lucide-react";
import { company } from "@/content/site";

/** Shown on preview deployments only (NEXT_PUBLIC_PREVIEW_BANNER=true) */
const bannerListeners = new Set<() => void>();
const readDismissed = () => {
  try {
    return sessionStorage.getItem("mky-preview-dismissed") === "1";
  } catch {
    return false;
  }
};

export function PreviewBanner() {
  const hidden = useSyncExternalStore(
    (cb) => {
      bannerListeners.add(cb);
      return () => bannerListeners.delete(cb);
    },
    readDismissed,
    () => false,
  );
  const dismiss = () => {
    try {
      sessionStorage.setItem("mky-preview-dismissed", "1");
    } catch {
      /* ignore */
    }
    bannerListeners.forEach((cb) => cb());
  };
  if (process.env.NEXT_PUBLIC_PREVIEW_BANNER !== "true" || hidden) return null;
  return (
    <div className="bg-ink-950 text-xs text-ink-300">
      <div className="container-x flex items-center justify-between gap-4 py-2">
        <p>
          <span className="mr-2 rounded bg-signal-500 px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase text-white">Preview</span>
          Redesign preview for MKY Global Forwarding. Items in <span className="font-mono text-signal-400">[orange brackets]</span> are content for MKY to supply.
        </p>
        <button
          type="button"
          aria-label="Dismiss preview notice"
          className="rounded p-1 hover:bg-white/10"
          onClick={dismiss}
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

export function WhatsAppButton() {
  return (
    <a
      href={company.whatsapp}
      target="_blank"
      rel="noopener"
      aria-label="Chat with MKY on WhatsApp"
      className="fixed bottom-5 right-5 z-30 inline-flex items-center gap-2 rounded-full bg-[#1fa855] px-4 py-3 text-sm font-medium text-white shadow-lg shadow-black/20 transition hover:bg-[#1a9049]"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
