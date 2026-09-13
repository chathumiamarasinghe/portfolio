export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  dateRange: string;
  bullets: string[];
}

export const experience: ExperienceItem[] = [
  {
    id: "ds-engineer",
    role: "Intern AI Engineer",
    company: "Northwind Labs",
    dateRange: "2024 — Present",
    bullets: [
      "Shipped production ML services for churn and demand forecasting, cutting weekly reporting time by 40%.",
      "Built FastAPI inference endpoints with monitoring dashboards so product teams could trust model output.",
      "Partnered with design to turn notebook experiments into tools people actually open every day.",
    ],
  },
  {
    id: "fullstack-intern",
    role: "Full Stack Developer Intern",
    company: "Harbor Studio",
    dateRange: "2023 — 2024",
    bullets: [
      "Shipped Next.js features for an internal analytics console used by 30+ operators.",
      "Designed PostgreSQL schemas and REST endpoints that kept a growing product from drowning in one-off queries.",
    ],
  },
  {
    id: "data-analyst",
    role: "Data Analyst",
    company: "Lotus Insights",
    dateRange: "2022 — 2023",
    bullets: [
      "Owned weekly KPI packs and ad-hoc SQL deep-dives for marketing and operations.",
      "Automated messy spreadsheet workflows in Python so the team could spend time deciding, not cleaning.",
    ],
  },
];
