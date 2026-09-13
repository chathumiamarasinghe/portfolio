"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  BadgeCheck,
  BarChart2,
  Bookmark,
  Folder,
  Link2,
  MapPin,
  MessageCircle,
  Monitor,
  Star,
  type LucideIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { personal } from "@/data/personal";
import { useStats } from "@/hooks/useStats";

const avatarSrc =
  process.env.NEXT_PUBLIC_AVATAR_URL?.trim() ||
  process.env.NEXT_PUBLIC_CLOUDINARY_URL?.trim() ||
  personal.avatarCutout;

const QUOTES = [
  ["Better", "Tools", "Brighter", "Creators"],
  ["Quiet", "Discipline", "Loud", "Results"],
  ["Dreams", "Over", "Doubt", "Always"],
] as const;

const BADGES = [
  { icon: MapPin, text: personal.location },
  { icon: Monitor, text: "Data Scientist · Full Stack Developer" },
  { icon: Link2, text: personal.website, href: personal.websiteUrl },
] as const;

function StatCard({
  icon: Icon,
  value,
  label,
  accent,
  loading,
  delay,
}: {
  icon: LucideIcon;
  value: string;
  label: string;
  accent?: boolean;
  loading: boolean;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-1 rounded-[10px] px-4 py-3.5"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <Icon size={16} style={{ color: accent ? "#F59E0B" : "rgba(255,255,255,0.45)" }} />
      {loading ? (
        <div className="mt-1 h-[22px] w-12 animate-pulse rounded bg-white/[0.06]" />
      ) : (
        <p className="font-bold text-white" style={{ fontSize: "clamp(16px, 1.8vw, 24px)" }}>
          {value}
        </p>
      )}
      <p
        className="text-[10px] tracking-[0.08em] uppercase"
        style={{ color: "rgba(255,255,255,0.35)" }}
      >
        {label}
      </p>
    </motion.div>
  );
}

export default function HeroCard() {
  const { stats, loading } = useStats();
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setQuoteIndex((current) => (current + 1) % QUOTES.length);
    }, 8000);
    return () => window.clearInterval(timer);
  }, []);

  const quote = QUOTES[quoteIndex] ?? QUOTES[0];

  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full overflow-hidden"
        style={{
          minHeight: "clamp(240px, 35vh, 420px)",
          borderRadius: "clamp(14px, 1.5vw, 22px)",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.03)",
        }}
      >
        <div className="absolute inset-0 z-0">
          <Image
            src={personal.heroBackground}
            alt=""
            fill
            preload
            sizes="100vw"
            className="object-cover object-right"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, rgba(8,4,4,0.55) 0%, rgba(8,4,4,0.28) 55%, rgba(8,4,4,0.08) 100%)",
            }}
          />
        </div>

        <button
          type="button"
          aria-label="Bookmark"
          className="absolute top-4 right-4 z-20 hidden items-center justify-center lg:flex"
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "rgba(0,0,0,0.5)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <Bookmark size={15} color="white" />
        </button>

        <div className="relative z-10 grid h-full grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_2fr_1.3fr]">
          <div
            className="flex items-center gap-4 border-white/[0.06] sm:gap-[18px] md:border-r lg:[min-height:clamp(220px,32vh,400px)]"
            style={{
              background: "rgba(5,2,2,0.55)",
              padding: "clamp(20px, 3vw, 44px) clamp(20px, 3.5vw, 48px)",
            }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="flex size-[68px] shrink-0 items-center justify-center rounded-full p-[5px] md:size-20 lg:size-24"
              style={{
                background:
                  "radial-gradient(circle, rgba(190,35,35,0.95) 0%, rgba(80,10,10,0.85) 50%, transparent 80%)",
              }}
            >
              <Image
                src={avatarSrc}
                alt={`${personal.name} portrait`}
                width={84}
                height={84}
                className="size-[58px] rounded-full object-cover object-top md:size-[70px] lg:size-[84px]"
              />
            </motion.div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1
                  className="tracking-tight text-white"
                  style={{ fontSize: "clamp(18px, 2.2vw, 26px)", fontWeight: 700 }}
                >
                  {personal.name}
                </h1>
                <BadgeCheck size={20} color="#4A9EFF" aria-label="Verified" />
              </div>
              <p className="mt-[3px] text-[13px]" style={{ color: "rgba(255,255,255,0.4)" }}>
                {personal.handle}
              </p>
              <div className="my-3 h-px w-4/5 bg-white/[0.07]" />
              <p
                className="max-w-[240px] text-[13px] leading-[1.6]"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                {personal.tagline} {personal.bio}
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                {BADGES.map(({ icon: Icon, text, ...rest }, index) => {
                  const href = "href" in rest ? rest.href : undefined;
                  const className = `flex items-center gap-1.5 text-xs ${index === 2 ? "max-sm:hidden" : ""}`;
                  const style = { color: "rgba(255,255,255,0.45)" };
                  const content = (
                    <>
                      <Icon size={14} />
                      <span className="truncate">{text}</span>
                    </>
                  );

                  if (href) {
                    return (
                      <a
                        key={text}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${className} transition hover:text-white`}
                        style={style}
                      >
                        {content}
                      </a>
                    );
                  }

                  return (
                    <div key={text} className={className} style={style}>
                      {content}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div
            className="flex flex-col justify-center gap-5 border-white/[0.06] lg:border-r lg:[min-height:clamp(220px,32vh,400px)]"
            style={{
              background: "rgba(5,2,2,0.4)",
              padding: "clamp(20px, 3vw, 44px) clamp(20px, 3.5vw, 48px)",
            }}
          >
            <p
              className="text-[10px] tracking-[0.12em] uppercase"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              Live Stats
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              <StatCard
                icon={Star}
                value={stats.stars}
                label="Rating"
                accent
                loading={loading}
                delay={0.2}
              />
              <StatCard
                icon={Folder}
                value={stats.repos}
                label="Projects"
                loading={loading}
                delay={0.25}
              />
              <StatCard
                icon={MessageCircle}
                value={stats.comments}
                label="Comments"
                loading={loading}
                delay={0.3}
              />
              <StatCard
                icon={BarChart2}
                value={stats.experience}
                label="Experience"
                loading={loading}
                delay={0.35}
              />
            </div>

            <motion.a
              href="#contact"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex w-full items-center justify-center gap-2 font-semibold text-white hover:brightness-110"
              style={{
                background: "linear-gradient(135deg, #E8441A 0%, #FF6B35 100%)",
                borderRadius: 999,
                padding: "13px 28px",
                fontSize: 15,
                boxShadow: "0 4px 20px rgba(232,68,26,0.35)",
              }}
            >
              Get in touch <ArrowRight size={16} />
            </motion.a>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="hidden flex-col justify-center lg:flex lg:[min-height:clamp(220px,32vh,400px)]"
            style={{
              background: "rgba(5,2,2,0.1)",
              padding: "clamp(20px, 3vw, 44px) clamp(20px, 3.5vw, 48px)",
            }}
          >
            <span
              className="mb-3.5 block font-serif text-[48px] leading-[0.7] text-[#E8441A]"
              aria-hidden
            >
              &ldquo;
            </span>
            <div className="relative min-h-[148px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={quote.join("-")}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="leading-[1.4] font-bold text-white"
                  style={{ fontSize: "clamp(18px, 2vw, 22px)" }}
                >
                  <p>{quote[0]}</p>
                  <p>{quote[1]}</p>
                  <p>{quote[2]}</p>
                  <div className="my-1.5 h-[2.5px] w-9 bg-[#E8441A]" />
                  <p>{quote[3]}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
