"use client";

import { motion } from "framer-motion";
import { experience } from "@/data/experience";

export function Experience() {
  return (
    <section
      id="experience"
      className="section-shell scroll-mt-24 border-t border-white/8 bg-surface"
    >
      <div className="section-wrap-narrow">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <p className="font-mono text-xs tracking-[0.2em] text-accent uppercase">
            Experience
          </p>
          <h2 className="section-title mt-3 font-heading tracking-tight">
            A short path, taken seriously
          </h2>
        </motion.div>

        <div className="relative mx-auto mt-16 max-w-[860px]">
          <div
            className="absolute top-0 bottom-0 left-4 w-px bg-accent/70 md:left-1/2 md:-translate-x-1/2"
            aria-hidden
          />

          <ol className="space-y-12">
            {experience.map((item, index) => {
              const isLeft = index % 2 === 0;
              return (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className={`relative pl-12 md:w-1/2 md:pl-0 ${
                    isLeft
                      ? "md:pr-12 md:text-right"
                      : "md:ml-auto md:pl-12"
                  }`}
                >
                  <span
                    className={`absolute top-2 left-[11px] size-3 rounded-full border-2 border-accent bg-background ${
                      isLeft
                        ? "md:left-auto md:right-[-7px]"
                        : "md:left-[-7px]"
                    }`}
                    aria-hidden
                  />
                  <article className="rounded-2xl border border-white/8 bg-background p-5 text-left md:p-6">
                    <p className="text-xs text-accent">{item.dateRange}</p>
                    <h3 className="mt-1 font-heading text-lg font-semibold">
                      {item.role}
                    </h3>
                    <p className="text-sm text-text-muted">{item.company}</p>
                    <ul className="mt-3 space-y-2 text-sm leading-6 text-text-primary/75">
                      {item.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  </article>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
