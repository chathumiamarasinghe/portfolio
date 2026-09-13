import { personal } from "@/data/personal";

export const site = {
  name: personal.name,
  initials: personal.initials,
  role: personal.role,
  handle: personal.handle,
  tagline: `${personal.tagline} ${personal.bio}`,
  location: personal.location,
  email: personal.email,
  avatar: personal.avatar,
  heroBackground: personal.heroBackground,
  quote: personal.quotes[0],
  stats: {
    rating: "4.9",
    projects: "150+",
    comments: "1.2k",
    experience: "3+",
  },
  about: {
    story:
      "I'm Chathumi — an intern AI engineer who also loves shipping full-stack products. I spend my days turning messy datasets into models people can actually trust, then wrapping those models in interfaces that feel fast and human. I care about the last mile: the dashboard someone opens at 11pm, the API that doesn't flake, the chart that tells the truth without shouting. If you're building something at the intersection of AI and product, I'd love to help.",
    highlights: [
      { value: "150+", label: "Projects Built" },
      { value: "24+", label: "Technologies Used" },
      { value: "8+", label: "Certifications" },
    ],
  },
  socials: {
    github: personal.github,
    linkedin: personal.linkedin,
    medium: personal.mediumUrl,
    kaggle: personal.kaggle,
    twitter: personal.twitter,
  },
} as const;
