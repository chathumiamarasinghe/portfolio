"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink, Play } from "lucide-react";
import { projects } from "@/data/projects";

export function Projects() {
  return (
    <section
      id="projects"
      className="scroll-mt-24 border-t border-white/8 bg-background py-24 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-mono text-xs tracking-[0.2em] text-accent uppercase">
            Projects
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            Work that lives at the edge of models and product
          </h2>
        </motion.div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.55,
                delay: index * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group overflow-hidden rounded-2xl border border-white/8 bg-surface transition duration-300 hover:-translate-y-2 hover:border-accent/50 hover:shadow-accent-glow"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={project.image}
                  alt={`${project.title} preview`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition group-hover:opacity-90" />
                <p className="absolute inset-x-4 bottom-4 line-clamp-2 text-sm text-white/90 opacity-0 transition duration-300 group-hover:opacity-100">
                  {project.description}
                </p>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-heading text-lg font-semibold">
                    {project.title}
                  </h3>
                  <div className="flex gap-2">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${project.title} GitHub repository`}
                      className="inline-flex size-8 items-center justify-center rounded-full border border-white/8 text-text-muted transition hover:border-accent/40 hover:text-accent-light hover:shadow-accent-glow"
                    >
                      <ExternalLink className="size-3.5" />
                    </a>
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${project.title} live demo`}
                      className="inline-flex size-8 items-center justify-center rounded-full border border-white/8 text-text-muted transition hover:border-accent/40 hover:text-accent-light hover:shadow-accent-glow"
                    >
                      <Play className="size-3.5" />
                    </a>
                  </div>
                </div>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-text-muted">
                  {project.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tech.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/8 bg-white/5 px-2.5 py-1 text-[11px] text-text-primary/80"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
