import React, { useEffect, useRef } from "react";

const GRAPH_CDN_URL = "https://esm.sh/graphology@0.25.4?bundle";
const SIGMA_CDN_URL = "https://esm.sh/sigma@3.0.0?bundle";

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

const themes = [
  { id: "theme1", label: "Water Systems", count: 100, subnodes: [{ id: "theme1_1", label: "Rivers & Streams" }, { id: "theme1_2", label: "Groundwater" }, { id: "theme1_3", label: "Wetlands" }] },
  { id: "theme2", label: "Wildlife and Natural Areas", count: 120, subnodes: [{ id: "theme2_1", label: "Protected Areas" }, { id: "theme2_2", label: "Endangered Species" }] },
  { id: "theme3", label: "Energy Systems", count: 130, subnodes: [{ id: "theme3_1", label: "Renewables" }, { id: "theme3_2", label: "Fossil Fuels" }, { id: "theme3_3", label: "Nuclear" }, { id: "theme3_4", label: "Grid Infrastructure" }] },
  { id: "theme4", label: "Transportation Infrastructure", count: 140, subnodes: [{ id: "theme4_1", label: "Road Transport" }, { id: "theme4_2", label: "Rail Transport" }, { id: "theme4_3", label: "Air Transport" }] },
  { id: "theme5", label: "Urban Development", count: 150, subnodes: [{ id: "theme5_1", label: "Housing" }, { id: "theme5_2", label: "Zoning" }] },
  { id: "theme6", label: "Climate and Weather Modification", count: 130, subnodes: [{ id: "theme6_1", label: "Emissions" }, { id: "theme6_2", label: "Geoengineering" }, { id: "theme6_3", label: "Extreme Events" }, { id: "theme6_4", label: "Carbon Sinks" }] },
  { id: "theme7", label: "Industrial Production and Materials", count: 130, subnodes: [{ id: "theme7_1", label: "Mining" }, { id: "theme7_2", label: "Manufacturing" }, { id: "theme7_3", label: "Waste" }] },
  { id: "theme8", label: "Place Based Development Conflicts", count: 130, subnodes: [{ id: "theme8_1", label: "Land Use" }, { id: "theme8_2", label: "Resource Rights" }] },
  { id: "theme9", label: "Governance and Institutional Control", count: 150, subnodes: [{ id: "theme9_1", label: "Federal Policy" }, { id: "theme9_2", label: "Local Policy" }, { id: "theme9_3", label: "International Agreements" }, { id: "theme9_4", label: "Enforcement" }] },
  { id: "theme10", label: "Indigenous Narratives and Sovereignty", count: 130, subnodes: [{ id: "theme10_1", label: "Land Rights" }, { id: "theme10_2", label: "Cultural Preservation" }, { id: "theme10_3", label: "Self-Governance" }] },
];

const fixedPositions = {
  theme1:  { x: -0.4, y:  0.3 },
  theme2:  { x: -0.8, y: -0.1 },
  theme6:  { x: -0.2, y:  0.4 },
  theme3:  { x:  0.0, y:  0.1 },
  theme4:  { x:  0.3, y:  0.3 },
  theme7:  { x:  0.3, y: -0.1 },
  theme5:  { x:  0.6, y:  0.2 },
  theme9:  { x:  0.6, y: -0.2 },
  theme8:  { x:  0.2, y: -0.4 },
  theme10: { x: -0.3, y: -0.5 },
};

if (typeof document !== "undefined" && !document.getElementById("sigma-font")) {
  const link = document.createElement("link");
  link.id = "sigma-font";
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap";
  document.head.appendChild(link);
}

export default function SigmaExample({ ...rest }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    let renderer;

    const run = async () => {
      const { default: Graph } = await import(GRAPH_CDN_URL);
      const { default: Sigma } = await import(SIGMA_CDN_URL);

      const graph = new Graph();

      themes.forEach((theme) => {
        graph.addNode(theme.id, {
          label: theme.label,
          size: Math.sqrt(theme.count) * 2,
          color: themeColors[theme.id],
          x: fixedPositions[theme.id].x,
          y: fixedPositions[theme.id].y,
        });
      });

      themes.forEach((themeA, i) => {
        themes.forEach((themeB, j) => {
          if (i < j) graph.addEdge(themeA.id, themeB.id, { size: 1, color: "#d1d5db" });
        });
      });

      const themeState = {};

      themes.forEach((theme) => {
        const center = fixedPositions[theme.id];
        const subs = theme.subnodes;
        const subEdgeKeys = [];

        subs.forEach((sub, i) => {
          graph.addNode(sub.id, {
            label: sub.label, size: 8, color: themeColors[theme.id],
            x: center.x + Math.cos((2 * Math.PI * i) / subs.length) * 0.12,
            y: center.y + Math.sin((2 * Math.PI * i) / subs.length) * 0.12,
            hidden: true,
          });
          subEdgeKeys.push(graph.addEdge(theme.id, sub.id, { color: themeColors[theme.id], size: 1.5, hidden: true }));
          themes.forEach((other) => {
            if (other.id !== theme.id)
              subEdgeKeys.push(graph.addEdge(sub.id, other.id, { color: "#d1d5db", size: 1, hidden: true }));
          });
        });

        subs.forEach((subA, i) => {
          subs.forEach((subB, j) => {
            if (i < j) subEdgeKeys.push(graph.addEdge(subA.id, subB.id, { color: themeColors[theme.id], size: 1, hidden: true }));
          });
        });

        themeState[theme.id] = { subnodes: subs, subEdgeKeys, expanded: false, mainEdgeKeys: [] };
      });

      renderer = new Sigma(graph, containerRef.current, {
        renderEdgeLabels: false,
        labelFont: "DM Sans, sans-serif",
        labelWeight: "600",
        labelColor: { color: "#1e293b" },
        labelBackgroundColor: "rgba(255,255,255,0.85)",
        labelPadding: 4,
        labelRenderedSizeThreshold: 1,
        // Scale label size with zoom: bigger as you zoom in
        labelSizeRatio: 3,
        zoomToSizeRatioFunction: (x) => x,
      });

      themes.forEach((theme) => {
        const state = themeState[theme.id];
        const subIds = new Set(state.subnodes.map((s) => s.id));
        state.mainEdgeKeys = graph.edges(theme.id).filter((key) => !subIds.has(graph.opposite(theme.id, key)));
      });

      const FADED_NODE_COLOR = "#cbd5e1";
      const FADED_EDGE_COLOR = "#e2e8f0";
      const FADED_NODE_SIZE_FACTOR = 0.85;

      const originalNodeAttrs = {};
      themes.forEach((theme) => {
        originalNodeAttrs[theme.id] = { color: themeColors[theme.id], size: Math.sqrt(theme.count) * 2 };
        theme.subnodes.forEach((sub) => { originalNodeAttrs[sub.id] = { color: themeColors[theme.id], size: 8 }; });
      });
      const originalEdgeAttrs = {};
      graph.edges().forEach((key) => {
        originalEdgeAttrs[key] = { color: graph.getEdgeAttribute(key, "color"), size: graph.getEdgeAttribute(key, "size") };
      });

      const resetAllVisuals = () => {
        themes.forEach((theme) => {
          graph.setNodeAttribute(theme.id, "color", originalNodeAttrs[theme.id].color);
          graph.setNodeAttribute(theme.id, "size", originalNodeAttrs[theme.id].size);
          theme.subnodes.forEach((sub) => {
            graph.setNodeAttribute(sub.id, "color", originalNodeAttrs[sub.id].color);
            graph.setNodeAttribute(sub.id, "size", originalNodeAttrs[sub.id].size);
          });
        });
        graph.edges().forEach((key) => {
          graph.setEdgeAttribute(key, "color", originalEdgeAttrs[key].color);
          graph.setEdgeAttribute(key, "size", originalEdgeAttrs[key].size);
        });
      };

      const applyFocusVisuals = (focusedTheme) => {
        const focusedState = themeState[focusedTheme.id];
        const activeNodeIds = new Set(focusedState.expanded ? focusedState.subnodes.map((s) => s.id) : [focusedTheme.id]);
        const activeEdgeKeys = new Set();
        activeNodeIds.forEach((nodeId) => {
          graph.edges(nodeId).forEach((key) => { if (!graph.getEdgeAttribute(key, "hidden")) activeEdgeKeys.add(key); });
        });
        themes.forEach((theme) => {
          if (!activeNodeIds.has(theme.id)) {
            graph.setNodeAttribute(theme.id, "color", FADED_NODE_COLOR);
            graph.setNodeAttribute(theme.id, "size", originalNodeAttrs[theme.id].size * FADED_NODE_SIZE_FACTOR);
          }
          theme.subnodes.forEach((sub) => {
            if (!activeNodeIds.has(sub.id)) {
              graph.setNodeAttribute(sub.id, "color", FADED_NODE_COLOR);
              graph.setNodeAttribute(sub.id, "size", originalNodeAttrs[sub.id].size * FADED_NODE_SIZE_FACTOR);
            }
          });
        });
        graph.edges().forEach((key) => {
          if (graph.getEdgeAttribute(key, "hidden")) return;
          if (activeEdgeKeys.has(key)) {
            graph.setEdgeAttribute(key, "color", themeColors[focusedTheme.id] + "99");
            graph.setEdgeAttribute(key, "size", 1.8);
          } else {
            graph.setEdgeAttribute(key, "color", FADED_EDGE_COLOR);
            graph.setEdgeAttribute(key, "size", 0.5);
          }
        });
      };

      const expandTheme = (theme) => {
        const state = themeState[theme.id];
        if (state.expanded) return;
        state.expanded = true;
        graph.setNodeAttribute(theme.id, "hidden", true);
        state.mainEdgeKeys.forEach((key) => graph.setEdgeAttribute(key, "hidden", true));
        state.subnodes.forEach((sub) => graph.setNodeAttribute(sub.id, "hidden", false));
        state.subEdgeKeys.forEach((key) => graph.setEdgeAttribute(key, "hidden", false));
      };

      const collapseTheme = (theme) => {
        const state = themeState[theme.id];
        if (!state.expanded) return;
        state.expanded = false;
        graph.setNodeAttribute(theme.id, "hidden", false);
        state.mainEdgeKeys.forEach((key) => graph.setEdgeAttribute(key, "hidden", false));
        state.subnodes.forEach((sub) => graph.setNodeAttribute(sub.id, "hidden", true));
        state.subEdgeKeys.forEach((key) => graph.setEdgeAttribute(key, "hidden", true));
      };

      const EXPAND_ZOOM_RATIO = 1 / 2.5;
      const PROXIMITY = 0.35;

      renderer.getCamera().on("updated", () => {
        const camera = renderer.getCamera();
        const { ratio } = camera.getState();
        const zoomedIn = ratio < EXPAND_ZOOM_RATIO;

        if (!zoomedIn) {
          themes.forEach((theme) => collapseTheme(theme));
          resetAllVisuals();
          return;
        }

        const containerWidth = containerRef.current.offsetWidth;
        const containerHeight = containerRef.current.offsetHeight;
        const graphCenter = renderer.viewportToGraph({ x: containerWidth / 2, y: containerHeight / 2 });

        let closest = null;
        let closestDist = Infinity;
        themes.forEach((theme) => {
          const pos = fixedPositions[theme.id];
          const dx = pos.x - graphCenter.x;
          const dy = pos.y - graphCenter.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < closestDist) { closestDist = dist; closest = theme; }
        });

        if (!closest || closestDist > PROXIMITY) {
          themes.forEach((theme) => collapseTheme(theme));
          resetAllVisuals();
          return;
        }

        themes.forEach((theme) => {
          if (theme.id === closest.id) expandTheme(theme);
          else collapseTheme(theme);
        });
        resetAllVisuals();
        applyFocusVisuals(closest);
      });
    };

    void run();
    return () => { renderer?.kill?.(); };
  }, []);

  return (
    <div ref={containerRef} style={{ width: "100%", minHeight: "400px", height: "100%" }} {...rest} />
  );
}
