"use client"

import { useCallback, useMemo } from "react"
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  type Node,
  type Edge,
  MarkerType,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"

const nodeBase: Partial<Node> = {
  style: {
    background: "rgba(3, 0, 20, 0.9)",
    color: "#e0f2fe",
    border: "1px solid rgba(103, 232, 249, 0.45)",
    borderRadius: 999,
    fontSize: 11,
    letterSpacing: "0.08em",
    padding: "6px 12px",
    boxShadow: "0 0 16px rgba(103, 232, 249, 0.25)",
  },
}

export default function SkillConstellation() {
  const { nodes, edges } = useMemo(() => {
    const nodes: Node[] = [
      { id: "krish", position: { x: 280, y: 180 }, data: { label: "KRISH" }, ...nodeBase, style: { ...nodeBase.style, borderColor: "#c084fc", color: "#f5d0fe" } },
      { id: "python", position: { x: 40, y: 40 }, data: { label: "Python" }, ...nodeBase },
      { id: "ts", position: { x: 520, y: 40 }, data: { label: "TypeScript" }, ...nodeBase },
      { id: "cpp", position: { x: 280, y: 0 }, data: { label: "C++" }, ...nodeBase },
      { id: "torch", position: { x: 0, y: 180 }, data: { label: "PyTorch" }, ...nodeBase },
      { id: "react", position: { x: 560, y: 180 }, data: { label: "React / Next" }, ...nodeBase },
      { id: "k8s", position: { x: 80, y: 320 }, data: { label: "K8s + EKS" }, ...nodeBase },
      { id: "aws", position: { x: 240, y: 340 }, data: { label: "AWS / Bedrock" }, ...nodeBase },
      { id: "fastapi", position: { x: 420, y: 320 }, data: { label: "FastAPI" }, ...nodeBase },
      { id: "flow", position: { x: 580, y: 300 }, data: { label: "React Flow" }, ...nodeBase },
      { id: "sel", position: { x: 140, y: 80 }, data: { label: "Selenium" }, ...nodeBase },
      { id: "echo", position: { x: 120, y: 420 }, data: { label: "EchoStar" }, style: { ...nodeBase.style, borderColor: "#fbbf24", color: "#fde68a" } },
      { id: "bio", position: { x: 0, y: 280 }, data: { label: "BioSight" }, style: { ...nodeBase.style, borderColor: "#fb7185", color: "#fecdd3" } },
      { id: "map", position: { x: 500, y: 400 }, data: { label: "MapScrib.ai" }, style: { ...nodeBase.style, borderColor: "#60a5fa", color: "#bfdbfe" } },
      { id: "safe", position: { x: 640, y: 120 }, data: { label: "SafeWay" }, style: { ...nodeBase.style, borderColor: "#4ade80", color: "#bbf7d0" } },
      { id: "eyes", position: { x: 40, y: 120 }, data: { label: "Eyes Now" }, style: { ...nodeBase.style, borderColor: "#2dd4bf", color: "#ccfbf1" } },
    ]

    const paint = (color: string): Partial<Edge> => ({
      style: { stroke: color, strokeWidth: 1.2 },
      markerEnd: { type: MarkerType.ArrowClosed, color, width: 14, height: 14 },
    })

    const edges: Edge[] = [
      { id: "e1", source: "krish", target: "python", ...paint("#67e8f9") },
      { id: "e2", source: "krish", target: "ts", ...paint("#67e8f9") },
      { id: "e3", source: "krish", target: "cpp", ...paint("#67e8f9") },
      { id: "e4", source: "python", target: "torch", ...paint("#c084fc") },
      { id: "e5", source: "python", target: "sel", ...paint("#2dd4bf") },
      { id: "e6", source: "sel", target: "eyes", ...paint("#2dd4bf") },
      { id: "e7", source: "torch", target: "bio", ...paint("#fb7185") },
      { id: "e8", source: "ts", target: "react", ...paint("#60a5fa") },
      { id: "e9", source: "react", target: "safe", ...paint("#4ade80") },
      { id: "e10", source: "react", target: "flow", ...paint("#818cf8") },
      { id: "e11", source: "flow", target: "map", ...paint("#60a5fa") },
      { id: "e12", source: "python", target: "fastapi", ...paint("#38bdf8") },
      { id: "e13", source: "fastapi", target: "map", ...paint("#60a5fa") },
      { id: "e14", source: "fastapi", target: "bio", ...paint("#fb7185") },
      { id: "e15", source: "krish", target: "k8s", ...paint("#fbbf24") },
      { id: "e16", source: "k8s", target: "aws", ...paint("#fbbf24") },
      { id: "e17", source: "aws", target: "echo", ...paint("#fbbf24") },
    ]

    return { nodes, edges }
  }, [])

  const onInit = useCallback((instance: { fitView: (o?: object) => void }) => {
    instance.fitView({ padding: 0.2 })
  }, [])

  return (
    <div className="xyflow-dark h-[340px] w-full overflow-hidden rounded-sm border border-cyan-400/20 bg-[#050018]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onInit={onInit}
        fitView
        panOnDrag
        zoomOnScroll
        nodesDraggable
        proOptions={{ hideAttribution: true }}
        colorMode="dark"
        minZoom={0.45}
        maxZoom={1.6}
      >
        <Background variant={BackgroundVariant.Dots} gap={18} size={1} color="#1e293b" />
      </ReactFlow>
    </div>
  )
}
