"use client";
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface GraphData {
  nodes: { id: string; group: number }[];
  links: { source: string; target: string }[];
}

export default function SwarmGraph({ data }: { data: GraphData }) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || !data.nodes || !data.links || !svgRef.current) return;

    const width = 800;
    const height = 400;

    // Clear any existing SVG content before re-drawing
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .style("width", "100%")
      .style("height", "auto")
      .style("background-color", "rgba(15, 23, 42, 0.5)") // slate-900/50
      .style("border-radius", "0.75rem")
      .call(d3.zoom<SVGSVGElement, unknown>().on("zoom", (event) => {
        container.attr("transform", event.transform);
      }));

    const container = svg.append("g");

    // Copy data so D3 doesn't mutate React state
    const nodes = data.nodes.map(d => ({ ...d }));
    const links = data.links.map(d => ({ ...d }));

    // Setup Physics Force Simulation
    const simulation = d3.forceSimulation(nodes as d3.SimulationNodeDatum[])
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(50))
      .force("charge", d3.forceManyBody().strength(-150))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(15));

    // Draw Lines (Edges)
    const link = container.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#475569") // slate-600
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 1.5);

    // Draw Nodes
    const node = container.append("g")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", (d: any) => d.group === 1 ? 8 : 5) // Make high-risk nodes larger
      .attr("fill", (d: any) => d.group === 1 ? "#ef4444" : "#6366f1") // Red for risk, Indigo for normal
      .attr("stroke", "#0f172a") // border matching background
      .attr("stroke-width", 1.5)
      // FIX: Use <any, any> and cast the entire drag behavior "as any" to bypass strict SVG type limits
      .call(d3.drag<any, any>()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x; 
          d.fy = d.y;
        })
        .on("drag", (event, d) => { 
          d.fx = event.x; 
          d.fy = event.y; 
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null; 
          d.fy = null;
        }) as any
      );

    // Add Tooltips (Node IDs appear on hover)
    node.append("title").text((d: any) => `Node ID: ${d.id}`);

    // Update positions on every physics tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("cx", (d: any) => d.x)
        .attr("cy", (d: any) => d.y);
    });

  }, [data]);

  return (
    // FIX: Added h-[450px] to force the container to have a height
    <div className="w-full h-[450px] border border-slate-800 rounded-xl overflow-hidden shadow-2xl relative bg-slate-900/50">
      <div className="absolute top-4 left-4 z-10 bg-slate-900/80 px-3 py-1 rounded-md text-xs font-mono text-slate-300 border border-slate-700">
        🔴 Hub/High-Risk Node &nbsp;&nbsp; 🔵 Standard Node &nbsp;&nbsp; 🖱️ Scroll to Zoom / Drag to Move
      </div>
      {/* FIX: Added w-full h-full to the SVG */}
      <svg ref={svgRef} className="w-full h-full"></svg>
    </div>
  );
}