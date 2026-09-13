import Image from "next/image";
import FloatingArcs from "@/components/FloatingArcs";
import HeroCard from "@/components/HeroCard";
import { personal } from "@/data/personal";

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative flex min-h-svh w-full items-center overflow-hidden bg-[#0a0a0a]"
      style={{ paddingBlock: "clamp(5.5rem, 10vh, 8rem) clamp(2rem, 6vh, 4.5rem)" }}
    >
      <Image
        src={personal.heroBackground}
        alt=""
        fill
        preload
        sizes="100vw"
        className="object-cover object-center opacity-40"
      />

      <FloatingArcs color="rgba(110,185,160,1)" count={6} maxOpacity={0.2} />

      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/60 via-black/40 to-black/80" />

      <div className="relative z-10 w-full">
        <HeroCard />
      </div>
    </section>
  );
}
