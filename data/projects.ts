// data/projects.ts

export type Project = {
  readonly id: number;
  readonly title: string;
  readonly domain: string;
  readonly domainColor: string;
  readonly description: string;
  readonly metric?: string;          // ← ADD THIS — optional so old entries don't break
  readonly tags: readonly string[];
  readonly color: string;
  readonly github: string;
  readonly live: string;
};

export const projects: readonly Project[] = [
  {
    id: 1,
    title: "Medicare Hub",
    domain: "Healthcare",
    domainColor: "#34d399",
    description:
      "Built a real-time teleconsultation platform with role-based dashboards, handling scheduling, token queues, and secure API flows.",
    metric: "Reduced appointment wait time by 60%",   // ← populate per project
    tags: ["Next.js", "Node.js", "PostgreSQL", "WebSockets"],
    color: "#34d399",
    github: "https://github.com",
    live: "https://example.com",
  },
  {
    id: 2,
    title: "FinTrack",
    domain: "Finance",
    domainColor: "#60a5fa",
    description:
      "Personal finance dashboard with real-time expense tracking, budget alerts, and AI-powered spend categorisation.",
    metric: "Handles 10k+ transactions/day with <50ms response",
    tags: ["React", "Prisma", "tRPC", "OpenAI"],
    color: "#60a5fa",
    github: "https://github.com",
    live: "https://example.com",
  },
  {
    id: 3,
    title: "AI Summariser",
    domain: "AI / NLP",
    domainColor: "#c084fc",
    description:
      "Document summarisation tool using GPT-4 with streaming output, PDF ingestion, and per-user usage metering.",
    metric: "Reduced reading time by 40% across 500+ beta users",
    tags: ["Next.js", "OpenAI", "LangChain", "Stripe"],
    color: "#c084fc",
    github: "https://github.com",
    live: "https://example.com",
  },
  {
    id: 4,
    title: "DevFlow",
    domain: "DevTools",
    domainColor: "#ff9f0a",
    description:
      "Internal developer portal for managing microservice configs, feature flags, and deployment pipelines via a unified UI.",
    metric: "Cut deploy cycle from 25 min → 8 min",
    tags: ["React", "Node.js", "Docker", "Redis"],
    color: "#ff9f0a",
    github: "https://github.com",
    live: "https://example.com",
  },
] as const;