import dagre from 'dagre';
import type { GraphNode, GraphEdge } from './parser';

export function getLayoutedElements(
  nodes: GraphNode[],
  edges: GraphEdge[]
): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const nodeWidth = 320;
  
  // Set layout direction and separation parameters
  dagreGraph.setGraph({
    rankdir: 'LR',
    nodesep: 40,
    ranksep: 80,
  });

  // 1. Add nodes to dagre
  nodes.forEach((node) => {
    // Parent card sizes remain constant (collapsing only hides the downstream child nodes)
    const rowCount = node.data.properties.length;
    const computedHeight = 45 + rowCount * 28 + 10; // title (45px) + rows (28px each, single-line) + padding (10px)
    const nodeHeight = Math.max(65, computedHeight);

    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  // 2. Add edges to dagre
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // 3. Compute layout coordinates
  dagre.layout(dagreGraph);

  // 4. Map computed coordinates back to React Flow nodes
  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    
    // Shift coordinate space so that React Flow registers positioning correctly
    const rowCount = node.data.properties.length;
    const computedHeight = 45 + rowCount * 28 + 10;
    const nodeHeight = Math.max(65, computedHeight);

    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
}
