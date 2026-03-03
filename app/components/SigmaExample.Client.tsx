import React, { useEffect, useRef } from "react";

const GRAPH_CDN_URL = "https://esm.sh/graphology@0.25.4?bundle";
const SIGMA_CDN_URL = "https://esm.sh/sigma@3.0.0?bundle";

export default function SigmaExample({ ...rest }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let renderer;

    const run = async () => {
      const { default: Graph } = await import(GRAPH_CDN_URL);
      const { default: Sigma } = await import(SIGMA_CDN_URL);

      const themes = [
        { id: "theme1", label: "Water Systems", count: 100 },
        { id: "theme2", label: "Wildlife and Natural Areas", count: 120 },
        { id: "theme3", label: "Energy Systems", count: 130 },
        { id: "theme4", label: "Transportation Infrastructure", count: 140 },
        { id: "theme5", label: "Urban Development", count: 150 },
        { id: "theme6", label: "Climate and Weather Modification", count: 130 },
        { id: "theme7", label: "Industrial Production and Materials", count: 130 },
        { id: "theme8", label: "Place Based Development Conflicts", count: 130 },
        { id: "theme9", label: "Governance and Institutional Control", count: 150 },
        { id: "theme10", label: "Indigenous Narratives and Sovereignty", count: 130 },
      ];

      const themeColors = {
        theme1: "#0ea5e9",
        theme2: "#22c55e",
        theme3: "#f97316",
        theme4: "#6366f1",
        theme5: "#e11d48",
        theme6: "#38bdf8",
        theme7: "#64748b",
        theme8: "#a16207",
        theme9: "#0f766e",
        theme10: "#7c3aed",
      };

      const fixedPositions = {
        theme1: { x: -0.6, y: 0.4 },
        theme2: { x: -0.4, y: 0.7 },
        theme6: { x: -0.2, y: 0.4 },
        theme3: { x: 0.0, y: 0.1 },
        theme4: { x: 0.3, y: 0.3 },
        theme7: { x: 0.3, y: -0.1 },
        theme5: { x: 0.6, y: 0.2 },
        theme9: { x: 0.6, y: -0.2 },
        theme8: { x: 0.2, y: -0.4 },
        theme10: { x: -0.3, y: -0.5 },
      };

      const graph = new Graph();

      // Main nodes
      themes.forEach((theme) => {
        graph.addNode(theme.id, {
          label: theme.label,
          size: Math.sqrt(theme.count) * 2,
          color: themeColors[theme.id],
          x: fixedPositions[theme.id].x,
          y: fixedPositions[theme.id].y,
        });
      });

      // Edges between main nodes
      themes.forEach((themeA, i) => {
        themes.forEach((themeB, j) => {
          if (i < j) {
            graph.addEdge(themeA.id, themeB.id, {
              size: 1,
              color: "#d1d5db",
            });
          }
        });
      });

      // Transportation subnodes
      const transportSubnodes = [
        { id: "theme4_road", label: "Road Transport" },
        { id: "theme4_rail", label: "Rail Transport" },
        { id: "theme4_air", label: "Air Transport" },
      ];

      const center = fixedPositions.theme4;

      // Track subnode edge keys so we can hide/show them reliably
      const subEdgeKeys = [];

      transportSubnodes.forEach((sub, i) => {
        graph.addNode(sub.id, {
          label: sub.label,
          size: 10,
          color: themeColors.theme4,
          x: center.x + Math.cos((2 * Math.PI * i) / 3) * 0.12,
          y: center.y + Math.sin((2 * Math.PI * i) / 3) * 0.12,
          hidden: true,
        });

        // Edge from theme4 parent to each subnode
        const edgeKey = graph.addEdge("theme4", sub.id, {
          color: "#6366f1",
          size: 1,
          hidden: true,
        });
        subEdgeKeys.push(edgeKey);

        // Edges from each subnode to all other theme nodes (replacing theme4's connections)
        themes.forEach((theme) => {
          if (theme.id !== "theme4") {
            const key = graph.addEdge(sub.id, theme.id, {
              color: "#d1d5db",
              size: 1,
              hidden: true,
            });
            subEdgeKeys.push(key);
          }
        });
      });

      // Edges between subnodes themselves
      transportSubnodes.forEach((subA, i) => {
        transportSubnodes.forEach((subB, j) => {
          if (i < j) {
            const key = graph.addEdge(subA.id, subB.id, {
              color: "#6366f1",
              size: 1,
              hidden: true,
            });
            subEdgeKeys.push(key);
          }
        });
      });

      renderer = new Sigma(graph, containerRef.current, {
        renderEdgeLabels: false,
      });

      // Collect edges connecting theme4 to other theme nodes (not subnodes)
      const theme4MainEdgeKeys = graph.edges("theme4").filter((key) => {
        const target = graph.opposite("theme4", key);
        return !transportSubnodes.some((s) => s.id === target);
      });

      let transportExpanded = false;

      renderer.on("clickNode", ({ node }) => {
        const isTransportNode = node === "theme4" || transportSubnodes.some((s) => s.id === node);
        if (!isTransportNode) return;

        if (!transportExpanded) {
          // Expand: hide parent node + its main edges, show subnodes + sub edges
          transportExpanded = true;
          graph.setNodeAttribute("theme4", "hidden", true);
          theme4MainEdgeKeys.forEach((key) => graph.setEdgeAttribute(key, "hidden", true));
          transportSubnodes.forEach((sub) => graph.setNodeAttribute(sub.id, "hidden", false));
          subEdgeKeys.forEach((key) => graph.setEdgeAttribute(key, "hidden", false));
        } else {
          // Collapse: restore parent node + its main edges, hide subnodes + sub edges
          transportExpanded = false;
          graph.setNodeAttribute("theme4", "hidden", false);
          theme4MainEdgeKeys.forEach((key) => graph.setEdgeAttribute(key, "hidden", false));
          transportSubnodes.forEach((sub) => graph.setNodeAttribute(sub.id, "hidden", true));
          subEdgeKeys.forEach((key) => graph.setEdgeAttribute(key, "hidden", true));
        }
      });
    };

    void run();

    return () => {
      renderer?.kill?.();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", minHeight: "400px", height: "100%" }}
      {...rest}
    />
  );
}
