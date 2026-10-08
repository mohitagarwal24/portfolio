export type TrajectoryNode = {
  when: string;
  title: string;
  org: string;
  kind: "work" | "open-source" | "leadership" | "education" | "honor";
  detail: string;
};

export const trajectory: TrajectoryNode[] = [
  {
    when: "Summer 2027",
    title: "Incoming SDE Intern",
    org: "Microsoft",
    kind: "work",
    detail: "Software engineering internship, summer 2027.",
  },
  {
    when: "Jul – Aug 2026",
    title: "Contributor",
    org: "WasmEdge · CNCF",
    kind: "open-source",
    detail: "Two merged PRs to the CNCF WebAssembly runtime, in C++: a fix in the executor and new serializer tests.",
  },
  {
    when: "2026",
    title: "Finalist, IMC Prosperity 4",
    org: "Team Something_like_this",
    kind: "honor",
    detail: "Ranked #138 of ~22,000 teams worldwide in Mission 1 of IMC's algorithmic trading challenge.",
  },
  {
    when: "May 2025 – May 2026",
    title: "Joint Secretary",
    org: "onRec, IIT Roorkee",
    kind: "leadership",
    detail: "Led a team of 50+ and ran 10+ podcasts with guests like Harkirat Singh and Jarrod Kimber. Our audience grew 60%.",
  },
  {
    when: "Jun – Nov 2025",
    title: "Coordinator",
    org: "Placements & Internships Cell",
    kind: "leadership",
    detail: "Worked between 30+ recruiters and 500+ students, in a team of over 100.",
  },
  {
    when: "Feb – Mar 2025",
    title: "Contributor",
    org: "Oppia",
    kind: "open-source",
    detail: "Four merged PRs to the open learning platform, across the admin page, topic preview and CI.",
  },
  {
    when: "2023 – 2028",
    title: "BS-MS, Mathematics & Computing",
    org: "IIT Roorkee",
    kind: "education",
    detail: "CGPA 9.31. JEE Advanced AIR 1434. Reliance Foundation Scholar and INSPIRE-SHE fellow.",
  },
];
