// data/projects.ts

export type Project = {
  id: number;
  title: string;
  domain: string;
  description: string;
  tags: string[];
  color: string;
  github: string;
  live: string;

  // optional
  domainColor?: string;
  metric?: string;
};

export const projects: Project[] = [
  {
    id: 1,
    title: "Medicare Hub",
    domain: "Healthcare",
    description:
      "Real-time teleconsultation platform with role-based dashboards, booking with map , scheduling, and secure APIs.",
    metric: "↓ 60% wait time",
    tags: ["React.js", "Node.js", "MongoDB", "Leaflet"],
    color: "#34d399",
    domainColor: "#34d399",
    github: "https://github.com/Risaabhhhhh/medicare-hub",
    live: "https://example.com",
  },
  {
    id: 2,
    title: "Alphalense",
    domain: "Quantitative Finance",
    description:
      "Real-time sentiment analysis platform for financial markets based on news and social media data with functional app.",
    metric: "10k+ tx/day",
    tags: ["NumPy", "Pandas", "yfinance", "scikit-learn"],
    color: "#60a5fa",
    domainColor: "#60a5fa",
    github: "https://github.com/Risaabhhhhh/AlphaLens",
    live: "https://example.com",
  },
  {
    id: 3,
    title: "Carebridge AI",
    domain: "AI / NLP",
    description:
      "AI-Powered Health Insurance Interpretation & Escalation Support Platform.",
    metric: "↓ 40% reading time",
    tags: ["Next.js", "OpenAI", "LangChain"],
    color: "#c084fc",
    domainColor: "#c084fc",
    github: "https://github.com/Risaabhhhhh/carebridge_ai_v2",
    live: "https://example.com",
  },
  {
    id: 4,
    title: "ConfigMaster",
    domain: "build tools / devops",
    description:
      "Developer portal for managing configs, feature flags, and deployments.",
    metric: "25 → 8 min deploy",
    tags: ["React", "Node.js", "Docker", "Redis"],
    color: "#ff9f0a",
    domainColor: "#ff9f0a",
    github: "https://github.com",
    live: "https://example.com",
  },
];