"use client";

import { motion } from "framer-motion";
import { Award, ExternalLink } from "lucide-react";
import { linkedinCertificates } from "@/data/linkedin";
import { personal } from "@/data/personal";

export function Certificates() {
  return (
    <section
      id="certificates"
      className="section-shell scroll-mt-24 border-t border-white/8 bg-background"
    >
      <div className="section-wrap">
        <p className="font-mono text-xs tracking-[0.2em] text-accent uppercase">
          LinkedIn
        </p>
        <h2 className="section-title mt-3 font-heading tracking-tight">
          Certificates
        </h2>
        <p className="section-subtitle mt-3 max-w-2xl text-text-muted">
          Licenses and certifications from{" "}
          <a
            href={`${personal.linkedin}details/certifications/`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-light hover:underline"
          >
            LinkedIn
          </a>
          .
        </p>

        <motion.ul
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.06 } },
          }}
          className="mt-10 grid gap-4 md:grid-cols-2"
        >
          {linkedinCertificates.map((cert) => (
            <motion.li
              key={`${cert.title}-${cert.issuer}`}
              variants={{
                hidden: { opacity: 0, y: 16 },
                show: { opacity: 1, y: 0 },
              }}
            >
              <a
                href={cert.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-full items-start gap-4 rounded-2xl border border-white/8 bg-surface p-5 transition hover:-translate-y-1 hover:border-accent/50 hover:shadow-accent-glow"
              >
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-white/8 bg-white/5 text-accent-light">
                  <Award className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-start justify-between gap-3">
                    <span className="font-heading text-base font-semibold text-text-primary">
                      {cert.title}
                    </span>
                    <ExternalLink className="mt-1 size-3.5 shrink-0 text-text-muted" />
                  </span>
                  <span className="mt-1 block text-sm text-text-muted">
                    {cert.issuer}
                  </span>
                  <span className="mt-1 block text-xs text-text-muted/80">
                    Issued {cert.issued}
                  </span>
                </span>
              </a>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
