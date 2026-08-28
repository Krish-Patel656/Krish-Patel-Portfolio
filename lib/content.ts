export type SectorType =
  | "about"
  | "education"
  | "experience"
  | "project"
  | "skills"
  | "contact"

export interface Sector {
  id: string
  name: string
  callsign: string
  type: SectorType
  position: [number, number, number]
  color: string
  emissive: string
  size: number
  shape:
    | "station"
    | "rings"
    | "iris"
    | "nebula"
    | "campus"
    | "road"
    | "cell"
    | "graph"
    | "cluster"
    | "beacon"
  subtitle: string
  location?: string
  period?: string
  tags?: string[]
  bullets?: string[]
  stats?: { label: string; value: string }[]
  hidden?: boolean
}

export const HUD_GROUPS: { id: string; label: string; types: SectorType[] }[] = [
  { id: "experience", label: "EXPERIENCE", types: ["experience"] },
  { id: "projects", label: "PROJECTS", types: ["project"] },
  { id: "skills", label: "SKILLS", types: ["skills"] },
  { id: "stations", label: "STATIONS", types: ["about", "education", "contact"] },
]

export const PROFILE = {
  name: "Krish Patel",
  role: "Computer Science · AI / SWE",
  school: "The University of Texas at Dallas",
  graduation: "May 2028",
  gpa: "3.948",
  location: "Allen, Texas",
  email: "krish.patel.060506@gmail.com",
  phone: "469-500-7261",
  linkedin: "https://linkedin.com/in/krish-patel-8a172232a",
  github: "https://github.com/Krish-Patel656",
  summary:
    "CS student at UTD building agentic AI for satellite-scale infrastructure, healthcare automation, and open-source campus tools. Hunting internships in AI, research, and software engineering.",
}

export const SECTORS: Sector[] = [
  {
    id: "command",
    name: "Command Deck",
    callsign: "KP-ORIGIN",
    type: "about",
    position: [0, 0, -10],
    color: "#67e8f9",
    emissive: "#0891b2",
    size: 1.95,
    shape: "station",
    subtitle: "Who is flying this thing",
    location: "Allen, TX → Richardson, TX",
    tags: ["AI", "Systems", "Full-stack"],
    bullets: [
      "Computer Science student at UT Dallas with a 3.948 GPA, Dean's List (Fall 2024 & 2025), and an Academic Excellence Scholarship.",
      "I build things that remove grind: agentic incident response at EchoStar, insurance-verification robots at Eyes Now, and campus APIs at Nebula Labs.",
      "Stack gravity well: Python, TypeScript, C++, PyTorch, Kubernetes, AWS. Happiest when a model, an API, and a messy real-world system have to agree.",
      "Looking for internships in artificial intelligence, research, or software engineering — especially where the blast radius of a good idea is large.",
    ],
    stats: [
      { label: "GPA", value: "3.948" },
      { label: "Grad", value: "2028" },
      { label: "Focus", value: "AI + SWE" },
    ],
  },
  {
    id: "utd",
    name: "UTD Station",
    callsign: "EDU-COMET",
    type: "education",
    position: [22, 0, -8],
    color: "#fb923c",
    emissive: "#c2410c",
    size: 2.15,
    shape: "campus",
    subtitle: "B.S. Computer Science",
    location: "Richardson, TX",
    period: "Expected May 2028",
    tags: ["Dean's List", "Academic Excellence Scholarship"],
    bullets: [
      "Bachelor of Science in Computer Science · GPA 3.948",
      "Dean's List — Fall 2024 & Fall 2025",
      "Academic Excellence Scholarship",
      "Coursework: Data Structures, Software Engineering, Linear Algebra, Computer Architecture, Unix/Linux",
    ],
    stats: [
      { label: "GPA", value: "3.948" },
      { label: "Year", value: "Junior track" },
      { label: "Honors", value: "Dean's List ×2" },
    ],
  },
  {
    id: "echostar",
    name: "EchoStar",
    callsign: "SAT-RING",
    type: "experience",
    position: [-24, 0, -6],
    color: "#fbbf24",
    emissive: "#b45309",
    size: 2.45,
    shape: "rings",
    subtitle: "Core Automation & AI Software Engineer Intern",
    location: "Littleton, CO",
    period: "Jun 2026 – Aug 2026",
    tags: ["Amazon EKS", "Bedrock", "RAG", "Kubernetes", "ChatOps"],
    bullets: [
      "Built an agentic AI troubleshooting platform on Amazon EKS + Amazon Bedrock to investigate Kubernetes incidents across multiple clusters.",
      "Shipped RAG pipelines with Amazon Titan Embeddings and vector databases over historical logs, docs, and infra data.",
      "Wired ChatOps to Kubernetes automation — ~50% estimated MTTR drop across 50+ incident types.",
    ],
    stats: [
      { label: "MTTR", value: "−50%" },
      { label: "Incidents", value: "50+" },
      { label: "Stack", value: "EKS · Bedrock" },
    ],
  },
  {
    id: "eyesnow",
    name: "Eyes Now",
    callsign: "MED-IRIS",
    type: "experience",
    position: [-20, 0, 18],
    color: "#2dd4bf",
    emissive: "#0f766e",
    size: 2.15,
    shape: "iris",
    subtitle: "Software AI Automation Intern",
    location: "Remote",
    period: "Dec 2025 – Present",
    tags: ["Python", "Selenium", "REST", "Chrome Ext", "Healthcare"],
    bullets: [
      "Python + Selenium + REST automation for insurance eligibility across 10,000+ patient records and multiple payers.",
      "Cut manual verification ~80% and erased 500+ hours of repetitive work per year.",
      "Browser + network automation with Chrome extensions and cloud-hosted services to drop error rates in daily ops.",
    ],
    stats: [
      { label: "Records", value: "10k+" },
      { label: "Time saved", value: "−80%" },
      { label: "Hours/yr", value: "500+" },
    ],
  },
  {
    id: "nebula",
    name: "Nebula Labs",
    callsign: "OS-PULSAR",
    type: "experience",
    position: [22, 0, 16],
    color: "#c084fc",
    emissive: "#6d28d9",
    size: 2.2,
    shape: "nebula",
    subtitle: "API Engineer",
    location: "Richardson, TX",
    period: "Aug 2025 – Present",
    tags: ["Open Source", "REST APIs", "Campus tools"],
    bullets: [
      "Open-source tools used by thousands of UTD students — accessibility, reliability, and campus UX.",
      "REST API features that unclog data flow and kill manual processing across student-facing apps.",
      "Code reviews and refactors to keep the constellation readable.",
    ],
    stats: [
      { label: "Users", value: "Thousands" },
      { label: "Org", value: "UTD OSS" },
      { label: "Role", value: "APIs" },
    ],
  },
  {
    id: "safeway",
    name: "SafeWay",
    callsign: "PRJ-ROUTE",
    type: "project",
    position: [14, 0, -26],
    color: "#4ade80",
    emissive: "#15803d",
    size: 1.9,
    shape: "road",
    subtitle: "Safer routes, mapped",
    period: "Jan 2026 – Jun 2026",
    tags: ["React Native", "JavaScript", "Maps", "UI/UX"],
    bullets: [
      "Mobile app scoring safety on 1,000+ road segments so drivers can pick the less cursed path.",
      "Interactive geospatial maps with 3+ live route visualizations.",
      "Mobile UI tuned for thumbs, not Figma-desktop LARPing.",
    ],
    stats: [
      { label: "Segments", value: "1,000+" },
      { label: "Routes", value: "3+" },
      { label: "Platform", value: "RN" },
    ],
  },
  {
    id: "biosight",
    name: "BioSight",
    callsign: "PRJ-CELL",
    type: "project",
    position: [-14, 0, -28],
    color: "#fb7185",
    emissive: "#be123c",
    size: 1.95,
    shape: "cell",
    subtitle: "Oral cancer detection · 95% accuracy",
    period: "Feb 2026 – Present",
    tags: ["PyTorch", "FastAPI", "React", "Grad-CAM", "CV"],
    bullets: [
      "PyTorch CNN pipeline for oral cancer detection on histopathology images — 95% accuracy.",
      "Architecture bake-offs + preprocessing to squeeze diagnostic performance.",
      "FastAPI + React app: upload, prediction, confidence, Grad-CAM heatmaps.",
    ],
    stats: [
      { label: "Accuracy", value: "95%" },
      { label: "Domain", value: "Med CV" },
      { label: "XAI", value: "Grad-CAM" },
    ],
  },
  {
    id: "mapscrib",
    name: "MapScrib.ai",
    callsign: "PRJ-GRAPH",
    type: "project",
    position: [0, 0, -38],
    color: "#60a5fa",
    emissive: "#1d4ed8",
    size: 2.0,
    shape: "graph",
    subtitle: "AI knowledge graphs you can wander",
    period: "March 2026",
    tags: ["Next.js", "FastAPI", "React Flow", "Gemini", "PostgreSQL", "Docker"],
    bullets: [
      "Personalized knowledge graphs with progress tracking across 100+ topics.",
      "React Flow UI for prerequisite learning and live concept analytics.",
      "Gemini + YouTube transcript pipelines: explanations, auto-grading, targeted clips — 100+ hours of video, 90%+ topic match.",
    ],
    stats: [
      { label: "Topics", value: "100+" },
      { label: "Video", value: "100+ hrs" },
      { label: "Match", value: "90%+" },
    ],
  },
  {
    id: "skills",
    name: "Constellation",
    callsign: "SKL-MESH",
    type: "skills",
    position: [32, 0, 4],
    color: "#a5b4fc",
    emissive: "#4338ca",
    size: 2.25,
    shape: "cluster",
    subtitle: "Languages, frameworks, infra, libraries",
    tags: ["C++", "Python", "TypeScript", "PyTorch", "K8s", "AWS"],
  },
  {
    id: "contact",
    name: "Deep Space Relay",
    callsign: "TX-EARTH",
    type: "contact",
    position: [0, 0, 26],
    color: "#f472b6",
    emissive: "#9d174d",
    size: 1.75,
    shape: "beacon",
    subtitle: "Open a channel",
    location: "Allen, Texas",
    tags: ["Internships", "AI", "Research", "SWE"],
    bullets: [
      "Open to internships in AI, research, and software engineering.",
      "Fastest path: email or LinkedIn. GitHub for the receipts.",
    ],
  },
  {
    id: "funfacts",
    name: "Black Box",
    callsign: "Ø-SIGNAL",
    type: "about",
    hidden: true,
    position: [38, 0, -30],
    color: "#e2e8f0",
    emissive: "#64748b",
    size: 1.35,
    shape: "beacon",
    subtitle: "Unlisted telemetry · fun facts",
    tags: ["Easter egg", "Dean's List", "FastF1"],
    bullets: [
      "GPA 3.948 and Dean's List twice before junior year even officially starts.",
      "The email timestamp 060506 is baked into the nav computer. Yes, that's a birthday.",
      "Keeps FastF1 in the library list for a reason — race telemetry and ML are the same hobby in different jackets.",
      "Built campus tools at Nebula Labs while also shipping healthcare automation and satellite-scale incident AI. Parallel orbits.",
      "Allen, Texas origin. Richardson / Littleton / Remote as mission sites.",
    ],
    stats: [
      { label: "Class", value: "2028" },
      { label: "List", value: "Dean's ×2" },
      { label: "Home", value: "Allen, TX" },
    ],
  },
]

export const SKILL_GROUPS = [
  {
    id: "languages",
    label: "Languages",
    items: [
      "C++",
      "Java",
      "Python",
      "JavaScript",
      "TypeScript",
      "Go",
      "SQL",
      "MATLAB",
      "R",
      "Bash",
      "Assembly",
      "HTML/CSS",
    ],
  },
  {
    id: "frameworks",
    label: "Frameworks",
    items: ["FastAPI", "Flask", "Django", "React", "Node.js", "Next.js"],
  },
  {
    id: "infra",
    label: "Infrastructure",
    items: [
      "Docker",
      "Kubernetes",
      "Git",
      "AWS",
      "Cloudflare",
      "MySQL",
      "PostgreSQL",
      "Linux",
      "OAuth2",
      "Terraform",
      "Postman",
      "Figma",
    ],
  },
  {
    id: "libs",
    label: "Libraries",
    items: [
      "PyTorch",
      "TensorFlow",
      "scikit-learn",
      "OpenCV",
      "Pydantic",
      "Selenium",
      "FastF1",
      "Pandas",
      "NumPy",
      "Matplotlib",
    ],
  },
]
