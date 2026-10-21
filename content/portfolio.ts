/** Public portfolio copy reconciled with Notion on 21 October 2026.
 * Sources and material corrections are recorded in CONTENT-SOURCES.md.
 * Private outreach notes, salary expectations and identifiers stay out of the site.
 */
export const skillLayers = [
  {
    name: "Leadership",
    color: "#eab399",
    title: "People, plans and the path to launch.",
    description: "Team leadership, planning and bringing shared ideas to life.",
    tools: [
      "Leading campus teams",
      "Understanding the problem",
      "Project planning",
      "Technical decisions",
      "Podcast production",
      "Collaboration",
    ],
    projects: ["gitcraft", "citadel"],
  },
  {
    name: "Full-stack",
    color: "#e4c974",
    title: "From the first route to the last pixel.",
    description:
      "Authentication, permissions, APIs and interfaces. I connect the pieces and build the complete application.",
    tools: [
      "React",
      "Next.js",
      "TypeScript",
      "Node / Express",
      "FastAPI",
      "PostgreSQL",
    ],
    projects: ["gitcraft", "citadel"],
  },
  {
    name: "AI & ML",
    color: "#ddb0ae",
    title: "Useful models. Understandable systems.",
    description:
      "LLM integrations, model instrumentation and machine learning with careful evaluation.",
    tools: [
      "MCP",
      "LLM APIs",
      "llama.cpp",
      "PyTorch",
      "LightGBM",
      "Computer vision",
    ],
    projects: ["llm-tracing", "gitcraft"],
  },
  {
    name: "Systems",
    color: "#c4cda7",
    title: "I like knowing what happens underneath.",
    description:
      "C++ runtimes, memory management and lock-free event collection. The details that make software behave.",
    tools: [
      "C++17",
      "CMake",
      "WebAssembly",
      "FTXUI",
      "Lock-free buffers",
      "Runtime debugging",
    ],
    projects: ["llm-tracing", "synapse"],
  },
  {
    name: "Data & quant",
    color: "#b5c5a7",
    title: "The result matters. So does the method.",
    description:
      "Forecasting, stochastic models and risk tooling, evaluated on data the model has not seen.",
    tools: [
      "Python",
      "Walk-forward validation",
      "GARCH",
      "Time series",
      "Option pricing",
      "SQL",
    ],
    projects: ["nifty-intelligence", "option-pricing"],
  },
  {
    name: "Web3",
    color: "#c5bcd4",
    title: "Clear contracts. Clear trust boundaries.",
    description:
      "Tested smart contracts and applications that connect on-chain and off-chain systems.",
    tools: [
      "Solidity",
      "Foundry",
      "Hedera",
      "Uniswap v4",
      "Smart contracts",
      "Testnet integrations",
    ],
    projects: ["tradelayer", "smallcase-defi"],
  },
] as const;

export const projectStories: Record<
  string,
  {
    heading: string;
    image: string;
    tint: string;
    proof: string;
    decision: string;
    note?: string;
  }
> = {
  gitcraft: {
    heading: "Documentation that keeps up with code.",
    image: "/work/gitcraft/live.webp",
    tint: "#b5c5a7",
    proof: "1st · Craft Winter Challenge 2025",
    decision:
      "A significance gate skips trivial commits. Layered JSON recovery keeps the analysis pipeline resilient when model output is imperfect.",
  },
  tradelayer: {
    heading: "Privacy starts with the architecture.",
    image: "/work/tradelayer/live.webp",
    tint: "#ddb0ae",
    proof: "87 Foundry tests · 5 testnet contracts",
    decision:
      "Rebuilt the order flow around client-side encryption, institution isolation and netted settlement. Investigated and reported a CRE response-header consensus issue.",
    note: "Hedera-testnet prototype · local enclave simulation · Alpaca paper trading. Live confidential DON execution remained blocked by consensus.",
  },
  "llm-tracing": {
    heading: "See what happens inside inference.",
    image: "/work/llm-tracing/preview.png",
    tint: "#c5bcd4",
    proof: "C++17 · llama.cpp · model-free replay",
    decision:
      "A lock-free event buffer separates inference telemetry from the terminal UI. Recorded traces can be replayed without loading the model.",
    note: "Preview is an illustrative trace. Model compatibility depends on the graph structure; universal GGUF support is not claimed.",
  },
  "nifty-intelligence": {
    heading: "Research that survives unseen data.",
    image: "/work/nifty-intelligence/preview.png",
    tint: "#e4c974",
    proof: "517,956 out-of-sample predictions",
    decision:
      "Purged, embargoed walk-forward validation keeps future information out. Results report transaction costs and the small daily signal honestly.",
    note: "Research backtest, not a live-money track record. 18.7% CAGR and 0.52 Sharpe versus 14.8% and 0.39 for the equal-weight benchmark, net of 15 bps costs. Preview is an illustrative overview.",
  },
  citadel: {
    heading: "Permissions built into every workflow.",
    image: "/work/citadel/live.webp",
    tint: "#e4c974",
    proof: "Role-based access · full-stack dashboard",
    decision:
      "A complete dashboard with role-based workflows and access control.",
  },
  resq: {
    heading: "Disaster relief with public proof.",
    image: "/work/resq/repository.webp",
    tint: "#c5bcd4",
    proof: "VeChain hackathon winner",
    decision:
      "A VeChain donation bounty board with IPFS delivery proof, fee delegation and Privy sign-in.",
  },
};

export const openSource = [
  {
    name: "WasmEdge",
    context: "CNCF · C++ / WebAssembly",
    detail:
      "Fixed atomic-notify access width and added serializer coverage for atomic instructions and shared limits.",
    count: "2 merged PRs",
    href: "https://github.com/WasmEdge/WasmEdge/pulls?q=is%3Apr+author%3Amohitagarwal24+is%3Amerged",
  },
  {
    name: "Oppia",
    context: "Open-source learning platform",
    detail:
      "Contributed fixes across topic generation, learner previews, CI logging and a styling regression.",
    count: "4 merged PRs",
    href: "https://github.com/oppia/oppia/pulls?q=is%3Apr+author%3Amohitagarwal24+is%3Amerged",
  },
  {
    name: "Open Source Arcade",
    context: "IMG · IIT Roorkee",
    detail: "An early contribution to the campus open-source arcade.",
    count: "1 merged PR",
    href: "https://github.com/IMGIITRoorkee/open-source-arcade",
  },
];

export const achievements = [
  {
    value: "4",
    label: "Hackathon wins",
    detail:
      "Craft Winter Challenge · VeChain · Oasis track, AKINDO · UniDAO track, StackTooDeep",
  },
  {
    value: "138",
    label: "IMC Prosperity 4 · Mission 1 rank",
    detail:
      "Finalist with Something_like_this · approximately 22,000 teams worldwide",
  },
  {
    value: "Expert",
    label: "Codeforces",
    detail: "Also CodeChef 3★ · best contest ranks 337 and 55 respectively",
  },
  {
    value: "9.31",
    label: "CGPA · IIT Roorkee",
    detail:
      "After six semesters · JEE Advanced AIR 1434 · Reliance Foundation Scholar · INSPIRE-SHE fellow",
  },
];

export const archiveImages: Record<string, string> = {
  "option-pricing": "/work/option-pricing/heston-surface.webp",
  sentioasis: "/work/sentioasis/preview.webp",
  "smallcase-defi": "/work/smallcase-defi/preview.webp",
  chainlance: "/work/chainlance/diagram-sequence.webp",
  nexus: "/work/nexus/diagram-flow.webp",
  "satellite-valuation": "/work/satellite-valuation/repository.webp",
  "sequence-recognition": "/work/sequence-recognition/repository.webp",
  synapse: "/work/synapse/repository.webp",
  "sicxe-assembler": "/work/sicxe-assembler/repository.webp",
};
