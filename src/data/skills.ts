export const skillTabs = [
  { id: "all", label: "All" },
  { id: "languages", label: "Languages" },
  { id: "ml", label: "ML/AI" },
  { id: "frontend", label: "Frontend" },
  { id: "backend", label: "Backend" },
  { id: "tools", label: "Tools" },
] as const;

export type SkillTabId = (typeof skillTabs)[number]["id"];

export interface Skill {
  name: string;
  category: Exclude<SkillTabId, "all">;
  level: number;
  icon: string;
  fallback: string;
}

const devicon = (slug: string, file = `${slug}-original.svg`) =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${slug}/${file}`;

export const skills: Skill[] = [
  {
    name: "Python",
    category: "languages",
    level: 92,
    icon: devicon("python"),
    fallback: "🐍",
  },
  {
    name: "JavaScript",
    category: "languages",
    level: 88,
    icon: devicon("javascript"),
    fallback: "🟨",
  },
  {
    name: "TypeScript",
    category: "languages",
    level: 86,
    icon: devicon("typescript"),
    fallback: "🔷",
  },
  {
    name: "SQL",
    category: "languages",
    level: 84,
    icon: devicon("azuresqldatabase", "azuresqldatabase-original.svg"),
    fallback: "🗃️",
  },
  {
    name: "R",
    category: "languages",
    level: 70,
    icon: devicon("r"),
    fallback: "📈",
  },
  {
    name: "TensorFlow",
    category: "ml",
    level: 80,
    icon: devicon("tensorflow"),
    fallback: "🧠",
  },
  {
    name: "PyTorch",
    category: "ml",
    level: 78,
    icon: devicon("pytorch"),
    fallback: "🔥",
  },
  {
    name: "Scikit-learn",
    category: "ml",
    level: 90,
    icon: devicon("scikitlearn", "scikitlearn-original.svg"),
    fallback: "📊",
  },
  {
    name: "Pandas",
    category: "ml",
    level: 93,
    icon: devicon("pandas", "pandas-original.svg"),
    fallback: "🐼",
  },
  {
    name: "NumPy",
    category: "ml",
    level: 91,
    icon: devicon("numpy"),
    fallback: "🔢",
  },
  {
    name: "Matplotlib",
    category: "ml",
    level: 82,
    icon: devicon("matplotlib", "matplotlib-original.svg"),
    fallback: "📉",
  },
  {
    name: "Hugging Face",
    category: "ml",
    level: 74,
    icon: devicon("huggingface", "huggingface-original.svg"),
    fallback: "🤗",
  },
  {
    name: "React",
    category: "frontend",
    level: 88,
    icon: devicon("react"),
    fallback: "⚛️",
  },
  {
    name: "Next.js",
    category: "frontend",
    level: 85,
    icon: devicon("nextjs"),
    fallback: "▲",
  },
  {
    name: "Tailwind CSS",
    category: "frontend",
    level: 90,
    icon: devicon("tailwindcss"),
    fallback: "🌊",
  },
  {
    name: "Framer Motion",
    category: "frontend",
    level: 76,
    icon: devicon("framermotion", "framermotion-original.svg"),
    fallback: "🎞️",
  },
  {
    name: "Node.js",
    category: "backend",
    level: 84,
    icon: devicon("nodejs"),
    fallback: "🟢",
  },
  {
    name: "FastAPI",
    category: "backend",
    level: 86,
    icon: devicon("fastapi"),
    fallback: "⚡",
  },
  {
    name: "Flask",
    category: "backend",
    level: 80,
    icon: devicon("flask", "flask-original.svg"),
    fallback: "🧪",
  },
  {
    name: "PostgreSQL",
    category: "backend",
    level: 83,
    icon: devicon("postgresql"),
    fallback: "🐘",
  },
  {
    name: "MongoDB",
    category: "backend",
    level: 75,
    icon: devicon("mongodb"),
    fallback: "🍃",
  },
  {
    name: "Git",
    category: "tools",
    level: 90,
    icon: devicon("git"),
    fallback: "🔧",
  },
  {
    name: "Docker",
    category: "tools",
    level: 78,
    icon: devicon("docker"),
    fallback: "🐳",
  },
  {
    name: "VS Code",
    category: "tools",
    level: 94,
    icon: devicon("vscode"),
    fallback: "💻",
  },
  {
    name: "Jupyter",
    category: "tools",
    level: 88,
    icon: devicon("jupyter"),
    fallback: "📓",
  },
  {
    name: "AWS",
    category: "tools",
    level: 72,
    icon: devicon("amazonwebservices", "amazonwebservices-original-wordmark.svg"),
    fallback: "☁️",
  },
  {
    name: "Vercel",
    category: "tools",
    level: 82,
    icon: devicon("vercel"),
    fallback: "▲",
  },
];
