"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  BarChart3,
  ChevronDown,
  Folder,
  Link2,
  MapPin,
  MessageCircle,
  Sparkles,
  Star,
} from "lucide-react";
import { site } from "@/data/site";

const badges = [
  { icon: MapPin, label: site.location },
  { icon: Sparkles, label: "Earn and Create" },
  { icon: Link2, label: "chathumi.dev" },
] as const;

const stats = [
  { icon: Star, label: `${site.stats.rating} Rating` },
  { icon: Folder, label: `${site.stats.projects} Projects` },
  { icon: MessageCircle, label: `${site.stats.comments} Comments` },
  { icon: BarChart3, label: `${site.stats.experience} Years` },
] as const;

export function HeroCard() {
  return (
    <section
      id="home"
      className="relative flex min-h-svh items-center overflow-hidden"
    >
      <Image
        src={site.heroBackground}
        alt="Dramatic stormy sunset sky"
        fill
        preload
        sizes="100vw"
        className="object-cover"
        quality={80}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(0,0,0,0.8), rgba(20,5,0,0.7))",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-black/20" />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-28 sm:px-8 md:px-12 lg:flex-row lg:items-start lg:justify-between lg:px-16">
        <motion.article
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-lg rounded-3xl border border-white/8 bg-[rgba(15,15,15,0.85)] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-7"
        >
          <div className="flex items-start gap-4">
            <div className="relative size-20 shrink-0 overflow-hidden rounded-full ring-2 ring-accent">
              <Image
                src={site.avatar}
                alt={`Portrait of ${site.name}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0 pt-1">
              <div className="flex items-center gap-1.5">
                <h1 className="font-heading text-xl font-semibold tracking-tight text-text-primary sm:text-2xl">
                  {site.name}
                </h1>
                <BadgeCheck
                  className="size-5 shrink-0 text-[#4A9EFF]"
                  aria-label="Verified"
                />
              </div>
              <p className="mt-0.5 text-sm text-text-muted">{site.handle}</p>
            </div>
          </div>

          <p className="mt-5 max-w-md text-sm leading-relaxed text-text-primary/80 sm:text-[15px]">
            {site.tagline}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {badges.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/8 bg-white/5 px-3 py-1.5 text-xs text-text-primary/90"
              >
                <Icon className="size-3.5 text-accent-light" aria-hidden />
                {label}
              </span>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 border-t border-white/8 pt-5 sm:grid-cols-4">
            {stats.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-start gap-2">
                <Icon
                  className="mt-0.5 size-3.5 shrink-0 text-accent-light"
                  aria-hidden
                />
                <span className="text-xs leading-snug text-text-primary/85">
                  {label}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent to-accent-light px-5 py-2.5 text-sm font-medium text-white shadow-accent-glow transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Get in touch
              <span aria-hidden>→</span>
            </a>
          </div>
        </motion.article>

        <motion.aside
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-xs self-start rounded-2xl border border-white/8 bg-[rgba(15,15,15,0.75)] p-5 backdrop-blur-xl lg:mt-4"
        >
          <span
            className="block font-heading text-5xl leading-none text-accent"
            aria-hidden
          >
            “
          </span>
          <blockquote className="-mt-3 text-sm italic leading-relaxed text-text-primary/85">
            {site.quote.text}
          </blockquote>
          <p className="mt-3 text-xs text-text-muted">— {site.quote.author}</p>
        </motion.aside>
      </div>

      <a
        href="#about"
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-text-muted transition hover:text-accent-light"
        aria-label="Scroll to about section"
      >
        <ChevronDown className="size-6 animate-bounce" />
      </a>
    </section>
  );
}
