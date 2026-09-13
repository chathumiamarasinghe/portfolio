"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { personal } from "@/data/personal";
import type { MediumArticle } from "@/lib/medium-types";

export function Articles({ articles }: { articles: MediumArticle[] }) {
  return (
    <section
      id="articles"
      className="section-shell scroll-mt-24 border-t border-white/8 bg-background"
    >
      <div className="section-wrap">
        <p className="font-mono text-xs tracking-[0.2em] text-accent uppercase">
          Medium
        </p>
        <h2 className="section-title mt-3 font-heading tracking-tight">
          Articles
        </h2>
        <p className="section-subtitle mt-3 max-w-2xl text-text-muted">
          Latest writing from{" "}
          <a
            href={personal.mediumUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-light hover:underline"
          >
            Medium
          </a>
          .
        </p>
        {!articles.length ? (
          <p className="mt-10 text-sm text-text-muted">
            Articles will appear here once the Medium feed is available.
          </p>
        ) : (
        <motion.ul
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08 } },
          }}
          className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {articles.map((article) => (
            <motion.li
              key={article.link}
              variants={{
                hidden: { opacity: 0, y: 16 },
                show: { opacity: 1, y: 0 },
              }}
              className="overflow-hidden rounded-2xl border border-white/8 bg-surface"
            >
              <div className="relative aspect-[16/9] bg-white/5">
                {article.thumbnail ? (
                  <Image
                    src={article.thumbnail}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                ) : null}
              </div>
              <div className="p-5">
                <p className="text-xs text-text-muted">
                  {new Date(article.pubDate).toLocaleDateString()}
                </p>
                <h3 className="mt-2 font-heading text-lg font-semibold">
                  {article.title}
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {article.categories.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/8 px-2.5 py-1 text-[11px] text-text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex text-sm text-accent-light hover:underline"
                >
                  Read on Medium →
                </a>
              </div>
            </motion.li>
          ))}
        </motion.ul>
        )}
      </div>
    </section>
  );
}
