/**
 * This is a minimal example of Sigma. You can use it as a base to write new
 * examples, or reproducible test cases for new issues, for instance.
 */

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
        {id: "theme2", label: "Environmental Impacts on Wildlife and Natural Areas", count: 20},
        {id: "theme3", label: "Energy Systems and Power Infrastructure", count: 30},
        {id: "theme4", label: "Transportation Infrastructure and Mobility", count: 40},
        {id: "theme5", label: "Urban Development, Renewal, and Demolition", count: 50},
      ];

      const graph = new Graph();
themes.forEach((theme, i) => {
  const next = themes[(i + 1) % themes.length];
  graph.addEdge(theme.id, next.id, { size: 2, color: "#a5b4fc" });
});

      graph.addEdge("theme1", "theme2", {
        size: 5,
        color: "purple",
      });

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
