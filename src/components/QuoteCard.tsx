"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { personal } from "@/data/personal";

const KEYWORDS = ["discipline", "ethics", "dreams", "introvert"] as const;

export function QuoteCard({ className }: { className?: string }) {
  const quotes = personal.quotes;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % quotes.length);
    }, 8000);
    return () => window.clearInterval(timer);
  }, [quotes.length]);

  const quote = quotes[index] ?? quotes[0];

  return (
    <div
      className={`relative rounded-2xl p-6 ${className ?? ""}`}
      style={{
        background: "rgba(20,15,15,0.7)",
        border: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(10px)",
      }}
    >
      <span className="mb-3 block font-serif text-5xl leading-none text-[#E8441A] opacity-90">
        &ldquo;
      </span>
      <div className="relative min-h-[92px]">
        <AnimatePresence mode="wait">
          <motion.p
            key={quote.text}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="text-sm leading-relaxed font-light text-gray-200 italic"
          >
            {quote.text}
          </motion.p>
        </AnimatePresence>
      </div>
      <div className="mt-4 border-t border-white/[0.06] pt-4">
        <p className="text-xs tracking-wide text-gray-500">— {quote.author}</p>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {KEYWORDS.map((keyword) => (
          <span
            key={keyword}
            className="rounded-full border border-white/[0.06] px-2 py-0.5 text-[10px] tracking-wider text-gray-600 uppercase"
          >
            {keyword}
          </span>
        ))}
      </div>
    </div>
  );
}
