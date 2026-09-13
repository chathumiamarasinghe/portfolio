"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { site } from "@/data/site";

export function About() {
  return (
    <section
      id="about"
      className="scroll-mt-24 border-t border-white/8 bg-background py-24 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="grid items-center gap-12 lg:grid-cols-2"
        >
          <div className="relative mx-auto w-full max-w-sm">
            <div
              className="absolute -left-8 -top-8 size-40 rounded-full bg-accent/30 blur-3xl"
              aria-hidden
            />
            <div
              className="absolute -bottom-6 -right-4 size-32 rounded-full bg-accent-light/20 blur-3xl"
              aria-hidden
            />
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border-2 border-accent shadow-[0_0_40px_#E8441A22]">
              <Image
                src={site.avatar}
                alt={`${site.name} portrait`}
                fill
                sizes="(max-width: 1024px) 80vw, 380px"
                className="object-cover"
              />
            </div>
          </div>

          <div>
            <p className="font-mono text-xs tracking-[0.2em] text-accent uppercase">
              About
            </p>
            <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              Building with data, shipping like a product person
            </h2>
            <p className="mt-5 text-[15px] leading-7 text-text-primary/80">
              {site.about.story}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-14 grid gap-4 sm:grid-cols-3"
        >
          {site.about.highlights.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-white/8 bg-surface p-6"
            >
              <p className="font-heading text-3xl font-semibold text-accent">
                {item.value}
              </p>
              <p className="mt-1 text-sm text-text-muted">{item.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
