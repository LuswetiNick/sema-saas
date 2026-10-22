export const heroDescription =
  "A preview of website support for Kenyan businesses, with approved answers in English and Swahili and a clear path to your team when a person is needed.";

export const organizations = [
  "Northwind", "Halcyon Labs", "Ostrava", "Kestrel",
  "Lumen & Co", "Parallax", "Fieldwork", "Atlas Nine",
] as const;

export const platformCards = [
  { id: "knowledge", tag: "KNOWLEDGE", title: "Approved knowledge", description: "Explore answers drawn from the information your business approves." },
  { id: "languages", tag: "LANGUAGES", title: "English and Swahili", description: "See a support experience designed around both languages." },
  { id: "people", tag: "PEOPLE", title: "Human handoff", description: "Keep a clear path to a person when an answer is not enough." },
  { id: "website", tag: "WEBSITE", title: "Website support", description: "Preview a support widget that belongs beside your business website." },
  { id: "publish", tag: "PUBLISH", title: "Preview and publish", description: "Review the knowledge before it supports a live answer." },
  { id: "boundaries", tag: "BOUNDARIES", title: "Clear boundaries", description: "Explore the intended separation of business knowledge and conversations." },
] as const;

export type PlatformVisualKind = (typeof platformCards)[number]["id"];

export const processSteps = [
  { title: "Add knowledge", description: "Start with the answers your business approves.", detail: "A clearer conversation starts with a shared source of truth.", visual: "hub" },
  { title: "Answer clearly", description: "Explore English and Swahili support.", detail: "The right context, in the language your customer knows.", visual: "chart" },
  { title: "Keep control", description: "Preview and publish before answers go live.", detail: "Your knowledge. Your review. Your decision to publish.", visual: "gauge" },
  { title: "Bring in people", description: "Pass the conversation to your team.", detail: "Because sometimes the best next step is a real person.", visual: "timeline" },
] as const;

export type ProcessVisualKind = (typeof processSteps)[number]["visual"];

export const revealCopy =
  "Questions arrive in different languages. The gaps between answers and people are where trust quietly breaks. Sema helps close those gaps.";

export const sampleMetrics = [
  { id: "latency", target: 38, value: "38ms", label: "median handoff latency", format: "ms", line: "M0 35 L20 31 L40 34 L60 21 L80 26 L100 18 L120 23 L140 12 L160 16 L180 7 L200 10" },
  { id: "handoffs", target: 2400000000, value: "2.4B", label: "handoffs routed", format: "billions", line: "M0 40 L20 38 L40 34 L60 35 L80 29 L100 26 L120 22 L140 24 L160 15 L180 13 L200 4" },
  { id: "failures", target: 61, value: "61%", label: "fewer failed runs", format: "percent", line: "M0 8 L20 12 L40 10 L60 20 L80 17 L100 25 L120 23 L140 31 L160 29 L180 37 L200 40" },
  { id: "teams", target: 900, value: "900+", label: "teams in beta", format: "plus", line: "M0 40 L20 40 L40 32 L60 32 L80 26 L100 26 L120 18 L140 18 L160 10 L180 10 L200 3" },
] as const;

type FooterItem = { label: string; href: `#${string}` } | { label: string; href?: never };
export const footerGroups: readonly { title: string; items: readonly FooterItem[] }[] = [
  { title: "Product", items: [{ label: "How it works", href: "#how-it-works" }, { label: "Platform", href: "#platform" }, { label: "Pricing" }, { label: "Changelog" }, { label: "Roadmap" }] },
  { title: "Developers", items: ["Docs", "API reference", "SDKs", "MCP server", "Status"].map((label) => ({ label })) },
  { title: "Company", items: ["About", "Customers", "Careers", "Blog", "Contact"].map((label) => ({ label })) },
  { title: "Legal", items: ["Privacy", "Terms", "Security", "DPA"].map((label) => ({ label })) },
];

export const flowNodes = [
  { title: "Question received", subtitle: "website visitor", x: "7%", y: "52%", symbol: "message" },
  { title: "Staff requested", subtitle: "visitor choice", x: "38%", y: "30%", symbol: "person" },
  { title: "No clear answer", subtitle: "approved knowledge", x: "38%", y: "74%", symbol: "document" },
  { title: "Human handoff", subtitle: "sample wait · 2 min", x: "70%", y: "52%", symbol: "spinner" },
] as const;

export const sampleSubjects = ["Opening hours", "Pricing question", "Speak to staff"] as const;
export const sampleDurations = [38, 41, 36, 44] as const;
export const sampleRoutes = [[0, 1, 3], [0, 2, 3]] as const;
export const initialRuns = [
  { id: 4409, subject: "Speak to staff", duration: 36, elapsed: "t+00:00" },
  { id: 4408, subject: "Pricing question", duration: 41, elapsed: "t+00:00" },
  { id: 4407, subject: "Opening hours", duration: 38, elapsed: "t+00:00" },
] as const;
