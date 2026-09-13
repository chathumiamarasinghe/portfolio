"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { skills, skillTabs, type SkillTabId } from "@/data/skills";

function SkillIcon({ icon, fallback }: { icon: string; fallback: string }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="relative flex size-9 items-center justify-center overflow-hidden rounded-lg bg-white/5">
      {failed ? (
        <span className="text-sm">{fallback}</span>
      ) : (
        <Image
          src={icon}
          alt=""
          width={22}
          height={22}
          unoptimized
          className="size-[22px] object-contain"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}

export function Skills() {
  const [tab, setTab] = useState<SkillTabId>("all");

  const visible = useMemo(
    () =>
      tab === "all" ? skills : skills.filter((skill) => skill.category === tab),
    [tab],
  );

  return (
    <section
      id="skills"
      className="scroll-mt-24 border-t border-white/8 bg-surface py-24 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-mono text-xs tracking-[0.2em] text-accent uppercase">
            Skills
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            A stack that goes from notebook to production
          </h2>
        </motion.div>

        <div
          className="mt-8 flex flex-wrap gap-2"
          role="tablist"
          aria-label="Skill categories"
        >
          {skillTabs.map((item) => {
            const selected = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setTab(item.id)}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  selected
                    ? "bg-gradient-to-r from-accent to-accent-light text-white"
                    : "border border-white/8 bg-background text-text-muted hover:text-text-primary"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.ul
            key={tab}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={{
              hidden: {},
              show: {
                transition: { staggerChildren: 0.05 },
              },
            }}
            className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {visible.map((skill) => (
              <motion.li
                key={skill.name}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  show: { opacity: 1, y: 0 },
                }}
                className="rounded-2xl border border-white/8 bg-background p-4"
              >
                <div className="flex items-center gap-3">
                  <SkillIcon icon={skill.icon} fallback={skill.fallback} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium">{skill.name}</p>
                      <p className="text-xs text-text-muted">{skill.level}%</p>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/8">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-accent to-accent-light"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </div>
                  </div>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </div>
    </section>
  );
}
