export type Constellation = { id: string; name: string; designation: string; skills: string[] };

export const constellations: Constellation[] = [
  { id: "lang", name: "Languages", designation: "CNS-01", skills: ["C++17", "TypeScript", "Python", "Solidity", "SQL"] },
  { id: "ai", name: "AI & ML", designation: "CNS-02", skills: ["PyTorch", "LLM APIs", "MCP", "llama.cpp", "XGBoost", "LightGBM"] },
  { id: "quant", name: "Quant", designation: "CNS-03", skills: ["Heston / Bates", "GARCH", "MCMC", "Walk-forward CV", "MVO / HRP"] },
  { id: "chain", name: "Web3", designation: "CNS-04", skills: ["Foundry", "Uniswap v4", "Chainlink CRE", "Hedera", "Oasis Sapphire"] },
  { id: "web", name: "Full-stack", designation: "CNS-05", skills: ["Next.js", "React", "Node / Express", "FastAPI", "MongoDB", "Supabase"] },
  { id: "sys", name: "Systems", designation: "CNS-06", skills: ["CMake", "TEEs (AWS Nitro)", "Memory allocators", "FTXUI", "Lock-free queues"] },
];

export const commendations = [
  { title: "1st place", event: "Craft Winter Challenge 2025", note: "GitCraft" },
  { title: "Winner", event: "VeChain Global Hackathon", note: "ResQ" },
  { title: "1st place, Oasis track", event: "AKINDO New Delhi Buildathon", note: "SentiOasis" },
  { title: "UniDAO track winner", event: "StackTooDeep 2.0", note: "CryptoConnect" },
  { title: "Expert · 1742", event: "Codeforces", note: "Best rank 337" },
  { title: "3★ · 1713", event: "CodeChef", note: "Best rank 55" },
];
