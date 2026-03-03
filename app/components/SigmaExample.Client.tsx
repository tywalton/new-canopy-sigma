import React, { useEffect, useRef, useState } from "react";

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

const mockDocs = {
  theme1_1: [
    { id: 1, title: "Snake River Basin EIS", year: 2021, agency: "Bureau of Reclamation", pages: 412, status: "Final" },
    { id: 2, title: "Columbia River Flow Management EIS", year: 2020, agency: "Army Corps of Engineers", pages: 318, status: "Final" },
    { id: 3, title: "Colorado River Interim Guidelines EIS", year: 2019, agency: "Bureau of Reclamation", pages: 554, status: "Final" },
  ],
  theme1_2: [
    { id: 4, title: "Central Valley Groundwater Sustainability EIS", year: 2022, agency: "EPA", pages: 289, status: "Draft" },
    { id: 5, title: "Ogallala Aquifer Resource Management EIS", year: 2021, agency: "USDA", pages: 376, status: "Final" },
  ],
  theme1_3: [
    { id: 6, title: "Mississippi Delta Wetland Restoration EIS", year: 2022, agency: "Army Corps of Engineers", pages: 501, status: "Final" },
    { id: 7, title: "Everglades Restoration EIS", year: 2020, agency: "NPS", pages: 623, status: "Final" },
    { id: 8, title: "Chesapeake Bay Wetlands EIS", year: 2019, agency: "EPA", pages: 298, status: "Final" },
    { id: 9, title: "Pacific Coast Tidal Wetlands EIS", year: 2023, agency: "USFWS", pages: 187, status: "Draft" },
  ],
  theme2_1: [
    { id: 10, title: "Greater Yellowstone Ecosystem EIS", year: 2021, agency: "NPS", pages: 734, status: "Final" },
    { id: 11, title: "Arctic National Wildlife Refuge EIS", year: 2020, agency: "BLM", pages: 1200, status: "Final" },
  ],
  theme2_2: [
    { id: 12, title: "Northern Spotted Owl Critical Habitat EIS", year: 2022, agency: "USFWS", pages: 445, status: "Final" },
    { id: 13, title: "Gray Wolf Reintroduction EIS", year: 2021, agency: "USFWS", pages: 312, status: "Final" },
    { id: 14, title: "Pacific Salmon Recovery EIS", year: 2020, agency: "NOAA", pages: 589, status: "Final" },
  ],
  theme3_1: [
    { id: 15, title: "Desert Sunlight Solar Farm EIS", year: 2022, agency: "BLM", pages: 267, status: "Final" },
    { id: 16, title: "Cape Wind Offshore EIS", year: 2021, agency: "BOEM", pages: 398, status: "Final" },
  ],
  theme3_2: [
    { id: 17, title: "Keystone XL Pipeline EIS", year: 2020, agency: "DOS", pages: 2000, status: "Final" },
    { id: 18, title: "Appalachian Coal Mining EIS", year: 2019, agency: "OSMRE", pages: 445, status: "Final" },
    { id: 19, title: "Gulf of Mexico Offshore Drilling EIS", year: 2022, agency: "BOEM", pages: 612, status: "Draft" },
  ],
  theme3_3: [
    { id: 20, title: "Yucca Mountain Nuclear Repository EIS", year: 2021, agency: "DOE", pages: 8000, status: "Final" },
  ],
  theme3_4: [
    { id: 21, title: "Western Grid Expansion EIS", year: 2022, agency: "DOE", pages: 334, status: "Draft" },
    { id: 22, title: "Transmission Line Corridor EIS", year: 2021, agency: "BLM", pages: 278, status: "Final" },
  ],
  theme4_1: [
    { id: 23, title: "I-70 Mountain Corridor EIS", year: 2021, agency: "FHWA", pages: 567, status: "Final" },
    { id: 24, title: "Border Wall Infrastructure EIS", year: 2020, agency: "DHS", pages: 423, status: "Final" },
    { id: 25, title: "Pacific Coast Highway Expansion EIS", year: 2022, agency: "Caltrans", pages: 312, status: "Draft" },
  ],
  theme4_2: [
    { id: 26, title: "California High Speed Rail EIS", year: 2022, agency: "FRA", pages: 1100, status: "Final" },
    { id: 27, title: "Northeast Corridor Improvement EIS", year: 2021, agency: "Amtrak", pages: 678, status: "Final" },
  ],
  theme4_3: [
    { id: 28, title: "LAX Runway Expansion EIS", year: 2021, agency: "FAA", pages: 489, status: "Final" },
    { id: 29, title: "Denver International Airport EIS", year: 2020, agency: "FAA", pages: 356, status: "Final" },
  ],
  theme5_1: [
    { id: 30, title: "SF Bay Area Housing Development EIS", year: 2022, agency: "HUD", pages: 234, status: "Draft" },
    { id: 31, title: "Affordable Housing Initiative EIS", year: 2021, agency: "HUD", pages: 189, status: "Final" },
  ],
  theme5_2: [
    { id: 32, title: "Portland Metro Urban Growth EIS", year: 2021, agency: "EPA", pages: 312, status: "Final" },
    { id: 33, title: "Las Vegas Valley Expansion EIS", year: 2022, agency: "BLM", pages: 445, status: "Draft" },
    { id: 34, title: "Phoenix Urban Sprawl EIS", year: 2020, agency: "EPA", pages: 378, status: "Final" },
  ],
  theme6_1: [
    { id: 35, title: "National GHG Emissions Reduction EIS", year: 2022, agency: "EPA", pages: 567, status: "Final" },
    { id: 36, title: "Industrial Emissions Standards EIS", year: 2021, agency: "EPA", pages: 423, status: "Final" },
  ],
  theme6_2: [
    { id: 37, title: "Stratospheric Aerosol Injection Study EIS", year: 2023, agency: "NOAA", pages: 178, status: "Draft" },
  ],
  theme6_3: [
    { id: 38, title: "Wildfire Risk Management EIS", year: 2022, agency: "USFS", pages: 489, status: "Final" },
    { id: 39, title: "Coastal Flood Resilience EIS", year: 2021, agency: "FEMA", pages: 345, status: "Final" },
    { id: 40, title: "Drought Contingency Plan EIS", year: 2020, agency: "Bureau of Reclamation", pages: 278, status: "Final" },
  ],
  theme6_4: [
    { id: 41, title: "National Forest Carbon Sequestration EIS", year: 2022, agency: "USFS", pages: 312, status: "Draft" },
    { id: 42, title: "Coastal Blue Carbon EIS", year: 2021, agency: "NOAA", pages: 234, status: "Final" },
  ],
  theme7_1: [
    { id: 43, title: "Pebble Mine EIS", year: 2020, agency: "Army Corps of Engineers", pages: 2000, status: "Final" },
    { id: 44, title: "Twin Metals Minnesota Mine EIS", year: 2022, agency: "BLM", pages: 1100, status: "Draft" },
  ],
  theme7_2: [
    { id: 45, title: "Chemical Plant Expansion EIS", year: 2021, agency: "EPA", pages: 345, status: "Final" },
    { id: 46, title: "Steel Mill Modernization EIS", year: 2022, agency: "EPA", pages: 289, status: "Final" },
    { id: 47, title: "Semiconductor Fab EIS", year: 2023, agency: "DOC", pages: 212, status: "Draft" },
  ],
  theme7_3: [
    { id: 48, title: "National Waste Management EIS", year: 2021, agency: "EPA", pages: 456, status: "Final" },
    { id: 49, title: "Superfund Site Remediation EIS", year: 2020, agency: "EPA", pages: 378, status: "Final" },
  ],
  theme8_1: [
    { id: 50, title: "Bears Ears Monument Land Use EIS", year: 2021, agency: "BLM", pages: 789, status: "Final" },
    { id: 51, title: "Tongass National Forest Land Use EIS", year: 2020, agency: "USFS", pages: 934, status: "Final" },
  ],
  theme8_2: [
    { id: 52, title: "Federal Water Rights Adjudication EIS", year: 2022, agency: "Bureau of Reclamation", pages: 512, status: "Draft" },
    { id: 53, title: "Grazing Rights Management EIS", year: 2021, agency: "BLM", pages: 345, status: "Final" },
  ],
  theme9_1: [
    { id: 54, title: "National Environmental Policy Act Reform EIS", year: 2022, agency: "CEQ", pages: 289, status: "Final" },
    { id: 55, title: "Clean Water Act Jurisdiction EIS", year: 2021, agency: "EPA", pages: 445, status: "Final" },
    { id: 56, title: "Endangered Species Act Regulations EIS", year: 2020, agency: "USFWS", pages: 378, status: "Final" },
  ],
  theme9_2: [
    { id: 57, title: "State Environmental Review Process EIS", year: 2022, agency: "State EPA", pages: 212, status: "Draft" },
    { id: 58, title: "Municipal Permitting Reform EIS", year: 2021, agency: "HUD", pages: 178, status: "Final" },
  ],
  theme9_3: [
    { id: 59, title: "Paris Agreement Implementation EIS", year: 2021, agency: "DOS", pages: 567, status: "Final" },
    { id: 60, title: "US-Canada Boundary Waters EIS", year: 2020, agency: "DOS", pages: 423, status: "Final" },
  ],
  theme9_4: [
    { id: 61, title: "Environmental Enforcement Program EIS", year: 2022, agency: "EPA", pages: 234, status: "Final" },
    { id: 62, title: "Federal Lands Compliance EIS", year: 2021, agency: "DOI", pages: 312, status: "Draft" },
  ],
  theme10_1: [
    { id: 63, title: "Standing Rock Sioux Tribal Lands EIS", year: 2021, agency: "Army Corps of Engineers", pages: 678, status: "Final" },
    { id: 64, title: "Native Hawaiian Land Rights EIS", year: 2020, agency: "DOI", pages: 445, status: "Final" },
  ],
  theme10_2: [
    { id: 65, title: "Sacred Sites Protection EIS", year: 2022, agency: "NPS", pages: 289, status: "Draft" },
    { id: 66, title: "Traditional Cultural Properties EIS", year: 2021, agency: "NPS", pages: 234, status: "Final" },
  ],
  theme10_3: [
    { id: 67, title: "Tribal Water Rights EIS", year: 2022, agency: "Bureau of Reclamation", pages: 512, status: "Final" },
    { id: 68, title: "Native Sovereignty and Resource Management EIS", year: 2021, agency: "BIA", pages: 623, status: "Final" },
    { id: 69, title: "Alaska Native Claims EIS", year: 2020, agency: "BLM", pages: 789, status: "Final" },
  ],
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

function DocPanel({ selectedSubnode, onClose }) {
  const docs = mockDocs[selectedSubnode.id] || [];
  const theme = themes.find((t) => t.subnodes.some((s) => s.id === selectedSubnode.id));
  const color = theme ? themeColors[theme.id] : "#6366f1";

  return (
    <div style={{
      width: "300px",
      height: "100%",
      background: "#fff",
      borderLeft: `3px solid ${color}`,
      display: "flex",
      flexDirection: "column",
      fontFamily: "'Georgia', serif",
      boxShadow: "-4px 0 20px rgba(0,0,0,0.06)",
      animation: "slideIn 0.2s ease-out",
      flexShrink: 0,
    }}>
      <style>{`
        @keyframes slideIn { from { transform: translateX(16px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .doc-card:hover { background: #f8fafc !important; }
      `}</style>

      {/* Header */}
      <div style={{ padding: "18px 16px 14px", borderBottom: "1px solid #f1f5f9" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ flex: 1, marginRight: "8px" }}>
            <div style={{ fontSize: "10px", fontFamily: "monospace", letterSpacing: "0.08em", color: color, textTransform: "uppercase", marginBottom: "4px" }}>
              {theme?.label}
            </div>
            <div style={{ fontSize: "15px", fontWeight: "600", color: "#0f172a", lineHeight: 1.3 }}>
              {selectedSubnode.label}
            </div>
          </div>
          <button onClick={onClose} style={{
            border: "none", background: "#f1f5f9", cursor: "pointer",
            width: "26px", height: "26px", borderRadius: "6px",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#64748b", fontSize: "13px", flexShrink: 0,
          }}>✕</button>
        </div>
        <div style={{ marginTop: "10px", fontSize: "11px", color: "#94a3b8", fontFamily: "monospace" }}>
          {docs.length} document{docs.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Doc list */}
      <div style={{ flex: 1, overflowY: "auto", padding: "10px" }}>
        {docs.map((doc) => (
          <div key={doc.id} className="doc-card" style={{
            padding: "12px", marginBottom: "7px", borderRadius: "7px",
            border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer",
            transition: "background 0.12s",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "7px" }}>
              <span style={{
                fontSize: "10px", fontFamily: "monospace", padding: "2px 6px",
                borderRadius: "4px", fontWeight: "600",
                background: doc.status === "Final" ? "#dcfce7" : "#fef9c3",
                color: doc.status === "Final" ? "#166534" : "#854d0e",
              }}>
                {doc.status}
              </span>
              <span style={{ fontSize: "11px", color: "#94a3b8", fontFamily: "monospace" }}>{doc.year}</span>
            </div>
            <div style={{ fontSize: "12px", fontWeight: "600", color: "#1e293b", lineHeight: 1.4, marginBottom: "7px" }}>
              {doc.title}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#94a3b8" }}>
              <span>{doc.agency}</span>
              <span>{doc.pages.toLocaleString()} pp.</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SigmaExample({ ...rest }) {
  const containerRef = useRef(null);
  const [selectedSubnode, setSelectedSubnode] = useState(null);

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

      renderer = new Sigma(graph, containerRef.current, { renderEdgeLabels: false });

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
          const a = originalNodeAttrs[theme.id];
          graph.setNodeAttribute(theme.id, "color", a.color);
          graph.setNodeAttribute(theme.id, "size", a.size);
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

      // Click subnode → open doc panel
      renderer.on("clickNode", ({ node }) => {
        const parentTheme = themes.find((t) => t.subnodes.some((s) => s.id === node));
        if (!parentTheme) return;
        const subnode = parentTheme.subnodes.find((s) => s.id === node);
        if (subnode) setSelectedSubnode((prev) => prev?.id === subnode.id ? null : subnode);
      });
    };

    void run();
    return () => { renderer?.kill?.(); };
  }, []);

  return (
    <div style={{ display: "flex", width: "100%", height: "100%", minHeight: "400px" }} {...rest}>
      <div ref={containerRef} style={{ flex: 1, height: "100%" }} />
      {selectedSubnode && (
        <DocPanel selectedSubnode={selectedSubnode} onClose={() => setSelectedSubnode(null)} />
      )}
    </div>
  );
}
