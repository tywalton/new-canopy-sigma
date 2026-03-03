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
  {
    id: "theme1", label: "Water Systems", count: 100,
    subnodes: [
      { id: "theme1_1", label: "Rivers & Streams" },
      { id: "theme1_2", label: "Groundwater" },
      { id: "theme1_3", label: "Wetlands" },
    ],
  },
  {
    id: "theme2", label: "Wildlife and Natural Areas", count: 120,
    subnodes: [
      { id: "theme2_1", label: "Protected Areas" },
      { id: "theme2_2", label: "Endangered Species" },
    ],
  },
  {
    id: "theme3", label: "Energy Systems", count: 130,
    subnodes: [
      { id: "theme3_1", label: "Renewables" },
      { id: "theme3_2", label: "Fossil Fuels" },
      { id: "theme3_3", label: "Nuclear" },
      { id: "theme3_4", label: "Grid Infrastructure" },
    ],
  },
  {
    id: "theme4", label: "Transportation Infrastructure", count: 140,
    subnodes: [
      { id: "theme4_1", label: "Road Transport" },
      { id: "theme4_2", label: "Rail Transport" },
      { id: "theme4_3", label: "Air Transport" },
    ],
  },
  {
    id: "theme5", label: "Urban Development", count: 150,
    subnodes: [
      { id: "theme5_1", label: "Housing" },
      { id: "theme5_2", label: "Zoning" },
    ],
  },
  {
    id: "theme6", label: "Climate and Weather Modification", count: 130,
    subnodes: [
      { id: "theme6_1", label: "Emissions" },
      { id: "theme6_2", label: "Geoengineering" },
      { id: "theme6_3", label: "Extreme Events" },
      { id: "theme6_4", label: "Carbon Sinks" },
    ],
  },
  {
    id: "theme7", label: "Industrial Production and Materials", count: 130,
    subnodes: [
      { id: "theme7_1", label: "Mining" },
      { id: "theme7_2", label: "Manufacturing" },
      { id: "theme7_3", label: "Waste" },
    ],
  },
  {
    id: "theme8", label: "Place Based Development Conflicts", count: 130,
    subnodes: [
      { id: "theme8_1", label: "Land Use" },
      { id: "theme8_2", label: "Resource Rights" },
    ],
  },
  {
    id: "theme9", label: "Governance and Institutional Control", count: 150,
    subnodes: [
      { id: "theme9_1", label: "Federal Policy" },
      { id: "theme9_2", label: "Local Policy" },
      { id: "theme9_3", label: "International Agreements" },
      { id: "theme9_4", label: "Enforcement" },
    ],
  },
  {
    id: "theme10", label: "Indigenous Narratives and Sovereignty", count: 130,
    subnodes: [
      { id: "theme10_1", label: "Land Rights" },
      { id: "theme10_2", label: "Cultural Preservation" },
      { id: "theme10_3", label: "Self-Governance" },
    ],
  },
];

const fixedPositions = {
  theme1:  { x: -0.6, y:  0.4 },
  theme2:  { x: -0.4, y:  0.7 },
  theme6:  { x: -0.2, y:  0.4 },
  theme3:  { x:  0.0, y:  0.1 },
  theme4:  { x:  0.3, y:  0.3 },
  theme7:  { x:  0.3, y: -0.1 },
  theme5:  { x:  0.6, y:  0.2 },
  theme9:  { x:  0.6, y: -0.2 },
  theme8:  { x:  0.2, y: -0.4 },
  theme10: { x: -0.3, y: -0.5 },
};

export default function SigmaExample({ ...rest }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let renderer;

    const run = async () => {
      const { default: Graph } = await import(GRAPH_CDN_URL);
      const { default: Sigma } = await import(SIGMA_CDN_URL);

      const graph = new Graph();

      // Add main theme nodes
      themes.forEach((theme) => {
        graph.addNode(theme.id, {
          label: theme.label,
          size: Math.sqrt(theme.count) * 2,
          color: themeColors[theme.id],
          x: fixedPositions[theme.id].x,
          y: fixedPositions[theme.id].y,
        });
      });

      // Add edges between all main nodes
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

      // Per-theme state
      const themeState = {};

      themes.forEach((theme) => {
        const center = fixedPositions[theme.id];
        const subs = theme.subnodes;
        const subEdgeKeys = [];

        // Add subnode graph nodes
        subs.forEach((sub, i) => {
          graph.addNode(sub.id, {
            label: sub.label,
            size: 8,
            color: themeColors[theme.id],
            x: center.x + Math.cos((2 * Math.PI * i) / subs.length) * 0.12,
            y: center.y + Math.sin((2 * Math.PI * i) / subs.length) * 0.12,
            hidden: true,
          });

          // Edge: parent → subnode
          const parentEdgeKey = graph.addEdge(theme.id, sub.id, {
            color: themeColors[theme.id],
            size: 1.5,
            hidden: true,
          });
          subEdgeKeys.push(parentEdgeKey);

          // Edges: subnode → all other theme nodes
          themes.forEach((other) => {
            if (other.id !== theme.id) {
              const key = graph.addEdge(sub.id, other.id, {
                color: "#d1d5db",
                size: 1,
                hidden: true,
              });
              subEdgeKeys.push(key);
            }
          });
        });

        // Edges between subnodes themselves
        subs.forEach((subA, i) => {
          subs.forEach((subB, j) => {
            if (i < j) {
              const key = graph.addEdge(subA.id, subB.id, {
                color: themeColors[theme.id],
                size: 1,
                hidden: true,
              });
              subEdgeKeys.push(key);
            }
          });
        });

        themeState[theme.id] = {
          subnodes: subs,
          subEdgeKeys,
          expanded: false,
          mainEdgeKeys: [],
        };
      });

      renderer = new Sigma(graph, containerRef.current, {
        renderEdgeLabels: false,
      });

      // Collect each theme's main edges after renderer is created
      themes.forEach((theme) => {
        const state = themeState[theme.id];
        const subIds = new Set(state.subnodes.map((s) => s.id));
        state.mainEdgeKeys = graph.edges(theme.id).filter((key) => {
          const neighbor = graph.opposite(theme.id, key);
          return !subIds.has(neighbor);
        });
      });

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

      // EXPAND_ZOOM: camera ratio below this threshold = zoomed in enough to expand
      // Sigma's ratio is inverted: smaller ratio = more zoomed in
      const EXPAND_ZOOM_RATIO = 1 / 2.5;
      // Max graph-coordinate distance from camera center to a node to trigger expand
      const PROXIMITY = 0.35;

      renderer.getCamera().on("updated", () => {
        const camera = renderer.getCamera();
        const { ratio } = camera.getState();

        const zoomedIn = ratio < EXPAND_ZOOM_RATIO;

        if (!zoomedIn) {
          themes.forEach((theme) => collapseTheme(theme));
          return;
        }

        // Convert the viewport center to graph coordinates
        const containerWidth = containerRef.current.offsetWidth;
        const containerHeight = containerRef.current.offsetHeight;
        const graphCenter = renderer.viewportToGraph({
          x: containerWidth / 2,
          y: containerHeight / 2,
        });

        // Find the closest main theme node to the graph-space center
        let closest = null;
        let closestDist = Infinity;

        themes.forEach((theme) => {
          const pos = fixedPositions[theme.id];
          const dx = pos.x - graphCenter.x;
          const dy = pos.y - graphCenter.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < closestDist) {
            closestDist = dist;
            closest = theme;
          }
        });

        if (!closest || closestDist > PROXIMITY) {
          themes.forEach((theme) => collapseTheme(theme));
          return;
        }

        // Expand the closest node, collapse all others
        themes.forEach((theme) => {
          if (theme.id === closest.id) expandTheme(theme);
          else collapseTheme(theme);
        });
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
