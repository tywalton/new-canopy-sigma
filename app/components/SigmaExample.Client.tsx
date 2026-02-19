
import React, {useEffect, useRef} from "react";

const GRAPH_CDN_URL = "https://esm.sh/graphology@0.25.4?bundle";
const SIGMA_CDN_URL = "https://esm.sh/sigma@3.0.0?bundle";

export default function SigmaExample({...rest}) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let renderer;

    const run = async () => {
      const {default: Graph} = await import(GRAPH_CDN_URL);
      const {default: Sigma} = await import(SIGMA_CDN_URL);

      const themes = [
        {id: "theme1", label: "Water Systems", count: 10},
        {id: "theme2", label: "Impacts on Wildlife and Natural Areas", count: 20},
        {id: "theme3", label: "Energy Systems and Power Infrastructure", count: 30},
        {id: "theme4", label: "Transportation Infrastructure", count: 40},
        {id: "theme5", label: "Urban Development", count: 50},
      ];

      const graph = new Graph();

// define colors 
const themeColors = {
  theme1: "#0ea5e9", // water
  theme2: "#22c55e", // wildlife
  theme3: "#f97316", // energy
  theme4: "#6366f1", // transport
  theme5: "#e11d48", // urban
};

// add nodes      
themes.forEach((theme, i) => {
  if (!graph.hasNode(theme.id)) {
    graph.addNode(theme.id, {
      label: theme.label,
      size: Math.sqrt(theme.count) * 2,
      color: themeColors[theme.id], // ← key line
      x: Math.cos((2 * Math.PI * i) / themes.length),
      y: Math.sin((2 * Math.PI * i) / themes.length),
    });
  }
});

// add edges 
themes.forEach((source, i) => {
  themes.slice(i + 1).forEach((target) => {
    graph.addEdge(source.id, target.id, {
      size: 1,
      color: "#d1d5db",
    });
  });
});
      
// create render 
      renderer = new Sigma(graph, containerRef.current, {
        renderEdgeLabels: false,
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
      style={{width: "100%", minHeight: "400px", height: "100%"}}
      {...rest}
    />
  );
}
