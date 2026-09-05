import { SECTORS, type SectorType } from "./content"

export type WorldCreature = {
  id: string
  name: string
  species: string
  category: "PROJECT" | "EXPERIENCE" | "SKILL" | "PROFILE"
  sectorType: SectorType
  color: number
  accent: number
  x: number
  y: number
  sectorId: string
  ability: string
}

const creatureDesigns: Omit<WorldCreature, "sectorType">[] = [
  {
    id: "kubernox",
    name: "Kubernox",
    species: "Cluster Guardian",
    category: "EXPERIENCE",
    color: 0xfbbf24,
    accent: 0x7c2d12,
    x: 1450,
    y: 270,
    sectorId: "echostar",
    ability: "Root Cause",
  },
  {
    id: "verifeye",
    name: "Verifeye",
    species: "Automation Seer",
    category: "EXPERIENCE",
    color: 0x2dd4bf,
    accent: 0x134e4a,
    x: 1610,
    y: 470,
    sectorId: "eyesnow",
    ability: "Eligibility Scan",
  },
  {
    id: "nebulyn",
    name: "Nebulyn",
    species: "Open-source Sprite",
    category: "EXPERIENCE",
    color: 0xc084fc,
    accent: 0x581c87,
    x: 1320,
    y: 510,
    sectorId: "nebula",
    ability: "API Pulse",
  },
  {
    id: "routeon",
    name: "Routeon",
    species: "Pathfinder",
    category: "PROJECT",
    color: 0x4ade80,
    accent: 0x14532d,
    x: 270,
    y: 260,
    sectorId: "safeway",
    ability: "Safe Passage",
  },
  {
    id: "histovue",
    name: "Histovue",
    species: "Vision Cell",
    category: "PROJECT",
    color: 0xfb7185,
    accent: 0x881337,
    x: 470,
    y: 470,
    sectorId: "biosight",
    ability: "Grad-CAM",
  },
  {
    id: "graphling",
    name: "Graphling",
    species: "Knowledge Weaver",
    category: "PROJECT",
    color: 0x60a5fa,
    accent: 0x1e3a8a,
    x: 660,
    y: 245,
    sectorId: "mapscrib",
    ability: "Concept Link",
  },
  {
    id: "stackit",
    name: "Stackit",
    species: "Toolbox Mimic",
    category: "SKILL",
    color: 0xa5b4fc,
    accent: 0x312e81,
    x: 1510,
    y: 980,
    sectorId: "skills",
    ability: "Full Stack",
  },
  {
    id: "cometling",
    name: "Cometling",
    species: "Scholar Comet",
    category: "PROFILE",
    color: 0xfb923c,
    accent: 0x7c2d12,
    x: 790,
    y: 1000,
    sectorId: "utd",
    ability: "Dean's Spark",
  },
  {
    id: "originbit",
    name: "Originbit",
    species: "Builder Core",
    category: "PROFILE",
    color: 0x67e8f9,
    accent: 0x164e63,
    x: 330,
    y: 940,
    sectorId: "command",
    ability: "Ship It",
  },
  {
    id: "signalix",
    name: "Signalix",
    species: "Relay Fox",
    category: "PROFILE",
    color: 0xf472b6,
    accent: 0x831843,
    x: 1050,
    y: 700,
    sectorId: "contact",
    ability: "Open Channel",
  },
]

export const WORLD_CREATURES: WorldCreature[] = creatureDesigns.map((creature) => {
  const sector = SECTORS.find((item) => item.id === creature.sectorId)
  return {
    ...creature,
    sectorType: sector?.type ?? "about",
  }
})

export function getCreatureSector(creature: WorldCreature) {
  return SECTORS.find((sector) => sector.id === creature.sectorId)
}
