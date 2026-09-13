"use client";

import { ArrowUp } from "lucide-react";
import { site } from "@/data/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/8 bg-background">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-6 sm:px-8 lg:px-16">
        <p className="text-xs text-text-muted sm:text-sm">
          Designed & Built by {site.name} • {year}
        </p>
        <a
          href="#home"
          aria-label="Back to top"
          className="inline-flex size-10 items-center justify-center rounded-full border border-white/8 text-text-primary transition hover:border-accent/50 hover:text-accent-light hover:shadow-accent-glow"
        >
          <ArrowUp className="size-4" />
        </a>
      </div>
    </footer>
  );
}
