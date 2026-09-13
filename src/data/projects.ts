export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tech: string[];
  github: string;
  live: string;
}

export const projects: Project[] = [
  {
    id: "dataviz-dashboard",
    title: "DataViz Dashboard",
    description:
      "Real-time analytics dashboard that streams model metrics into interactive D3 charts, so teams can catch drift before it becomes a fire drill.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop",
    tech: ["React", "D3", "FastAPI"],
    github: "https://github.com/chathumiamarasinghe",
    live: "https://github.com/chathumiamarasinghe",
  },
  {
    id: "ml-price-predictor",
    title: "ML Price Predictor",
    description:
      "Housing price model trained with scikit-learn and served through a Next.js UI — feature importance, confidence bands, and a clean prediction flow.",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1600&auto=format&fit=crop",
    tech: ["Python", "Scikit-learn", "Next.js"],
    github: "https://github.com/chathumiamarasinghe",
    live: "https://github.com/chathumiamarasinghe",
  },
  {
    id: "devconnect",
    title: "DevConnect",
    description:
      "Full-stack social platform for developers to share work, find collaborators, and discuss architecture — auth, profiles, and a Postgres-backed feed.",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1600&auto=format&fit=crop",
    tech: ["Next.js", "PostgreSQL", "Node.js"],
    github: "https://github.com/chathumiamarasinghe",
    live: "https://github.com/chathumiamarasinghe",
  },
];
