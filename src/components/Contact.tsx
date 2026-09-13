"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { contactSchema, type ContactInput } from "@/lib/contact-schema";
import { site } from "@/data/site";

interface SocialIconProps {
  className?: string;
}

function GithubIcon({ className }: SocialIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.28-.01-1.04-.02-2.04-3.34.73-4.04-1.61-4.04-1.61-.55-1.4-1.34-1.77-1.34-1.77-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.17.77.84 1.23 1.91 1.23 3.22 0 4.62-2.81 5.64-5.49 5.94.43.37.81 1.1.81 2.22 0 1.61-.01 2.9-.01 3.3 0 .32.21.7.82.58A12.01 12.01 0 0 0 24 12.5C24 5.87 18.63.5 12 .5Z" />
    </svg>
  );
}

function LinkedinIcon({ className }: SocialIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.73V1.73C24 .77 23.21 0 22.23 0Z" />
    </svg>
  );
}

function KaggleIcon({ className }: SocialIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M17.8 20.4 12.3 13l6-8.4h-3.3L10.4 12v-7H7.6v14.1h2.8v-4.7l4.4 4.7h3z" />
    </svg>
  );
}

function TwitterIcon({ className }: SocialIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M18.24 2H21l-6.53 7.46L22 22h-6.17l-4.82-6.3L5.7 22H3l7-8L2 2h6.3l4.36 5.77L18.24 2Zm-1.08 18h1.68L7 3.92H5.2L17.16 20Z" />
    </svg>
  );
}

const socials = [
  { href: site.socials.github, label: "GitHub", icon: GithubIcon },
  { href: site.socials.linkedin, label: "LinkedIn", icon: LinkedinIcon },
  { href: site.socials.kaggle, label: "Kaggle", icon: KaggleIcon },
  { href: site.socials.twitter, label: "Twitter", icon: TwitterIcon },
] as const;

export function Contact() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "" },
  });

  async function onSubmit(values: ContactInput) {
    setServerError(null);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const payload = (await response.json()) as { success?: boolean; error?: string };
      if (!response.ok || !payload.success) {
        setServerError(payload.error ?? "Something went wrong. Try again.");
        return;
      }
      setSent(true);
    } catch {
      setServerError("Something went wrong. Try again.");
    }
  }

  return (
    <section
      id="contact"
      className="section-shell scroll-mt-24 border-t border-white/8 bg-background"
    >
      <div className="section-wrap grid gap-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-mono text-xs tracking-[0.2em] text-accent uppercase">
            Contact
          </p>
          <h2 className="section-title mt-3 font-heading tracking-tight">
            Let&apos;s build something tomorrow
          </h2>
          <p className="section-subtitle mt-4 max-w-md text-text-muted">
            Whether it&apos;s a model that needs a home, a product that needs
            intelligence, or a team that needs another pair of hands — send a
            note. I read every message.
          </p>
          <a
            href={`mailto:${site.email}`}
            className="mt-4 inline-block text-sm text-text-primary/80 transition hover:text-accent-light"
          >
            {site.email}
          </a>
          <div className="mt-8 flex gap-3">
            {socials.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="inline-flex size-11 items-center justify-center rounded-full border border-white/8 text-text-primary/80 transition hover:border-accent/50 hover:text-accent-light hover:shadow-accent-glow"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-3xl border border-white/8 bg-surface p-6 sm:p-8"
        >
          {sent ? (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <CheckCircle2 className="size-8 text-emerald-400" />
              <p className="text-sm text-emerald-300">
                Message sent! I&apos;ll reply soon.
              </p>
            </div>
          ) : (
            <fieldset disabled={isSubmitting} className="space-y-5">
              <label className="block space-y-2">
                <span className="text-sm text-text-primary/80">Name</span>
                <Input
                  {...register("name")}
                  aria-invalid={Boolean(errors.name)}
                  className="h-11 bg-background"
                  placeholder="Your name"
                />
                {errors.name ? (
                  <span className="text-xs text-red-400">{errors.name.message}</span>
                ) : null}
              </label>
              <label className="block space-y-2">
                <span className="text-sm text-text-primary/80">Email</span>
                <Input
                  type="email"
                  {...register("email")}
                  aria-invalid={Boolean(errors.email)}
                  className="h-11 bg-background"
                  placeholder="you@email.com"
                />
                {errors.email ? (
                  <span className="text-xs text-red-400">{errors.email.message}</span>
                ) : null}
              </label>
              <label className="block space-y-2">
                <span className="text-sm text-text-primary/80">Message</span>
                <Textarea
                  {...register("message")}
                  aria-invalid={Boolean(errors.message)}
                  className="min-h-32 bg-background"
                  placeholder="What should we build?"
                />
                {errors.message ? (
                  <span className="text-xs text-red-400">
                    {errors.message.message}
                  </span>
                ) : null}
              </label>
              {serverError ? (
                <p className="text-sm text-red-400">{serverError}</p>
              ) : null}
              <Button
                type="submit"
                className="h-11 w-full rounded-full bg-gradient-to-r from-accent to-accent-light text-white shadow-accent-glow hover:brightness-110"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Sending
                  </>
                ) : (
                  "Send message"
                )}
              </Button>
            </fieldset>
          )}
        </motion.form>
      </div>
    </section>
  );
}
