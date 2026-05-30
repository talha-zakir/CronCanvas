import yaml from 'js-yaml';
import Papa from 'papaparse';
import type { Node, Edge } from '@xyflow/react';

export interface Property {
  key: string;
  value: any;
  isPrimitive: boolean;
  path: string; // Programmatic JSON Path (e.g., $.meta.version)
  childNodeId?: string; // The ID of the child node this property connects to
}

export interface NodeData extends Record<string, unknown> {
  title: string;
  type: 'object' | 'array' | 'root';
  properties: Property[];
  collapsedNodeIds?: string[]; // The list of all currently collapsed node IDs
  onToggleCollapse?: (nodeId: string) => void;
  searchQuery?: string;
}

export type GraphNode = Node<NodeData, 'customNode'>;
export type GraphEdge = Edge;

// Parses JSON, YAML, or CSV text into a native JS structure
export function parseInput(text: string, format: 'json' | 'yaml' | 'csv'): any {
  const trimmed = text.trim();
  if (!trimmed) return null;

  switch (format) {
    case 'json':
      return JSON.parse(trimmed);
    case 'yaml':
      const parsedYaml = yaml.load(trimmed);
      if (typeof parsedYaml !== 'object' || parsedYaml === null) {
        throw new Error('YAML must parse to an object or array.');
      }
      return parsedYaml;
    case 'csv':
      const result = Papa.parse(trimmed, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
      });
      if (result.errors && result.errors.length > 0) {
        throw new Error(result.errors[0].message);
      }
      return result.data;
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
}

// Helper to check if a value is primitive (not an object/array, and not null)
function isPrimitive(val: any): boolean {
  if (val === null || val === undefined) return true;
  return typeof val !== 'object';
}

// Converts a JS object/array recursively into a node-link diagram
export function convertToGraph(
  data: any,
  collapsedNodeIds: string[] = [],
  onToggleCollapse?: (nodeId: string) => void
): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  let counter = 0;

  // Track parent -> child node IDs to exclude connections from collapsed parents
  const hiddenNodeIds = new Set<string>();

  function traverse(
    current: any,
    title: string,
    parentId: string | null = null,
    parentKey: string = '',
    currentPath: string = '$'
  ): string {
    const nodeId = `node_${counter++}`;
    
    let nodeType: 'object' | 'array' | 'root' = 'object';
    if (parentId === null) {
      nodeType = 'root';
    } else if (Array.isArray(current)) {
      nodeType = 'array';
    }

    // Hide node if its parent is hidden or if it was collapsed by the parent button
    if (parentId && (hiddenNodeIds.has(parentId) || collapsedNodeIds.includes(nodeId))) {
      hiddenNodeIds.add(nodeId);
    }

    const properties: Property[] = [];
    
    // Create the Node
    const node: GraphNode = {
      id: nodeId,
      type: 'customNode',
      position: { x: 0, y: 0 }, // Will be computed by dagre
      data: {
        title: title || (Array.isArray(current) ? 'Array' : 'Object'),
        type: nodeType,
        properties,
        collapsedNodeIds,
        onToggleCollapse,
      },
    };
    nodes.push(node);

    // If parent exists, connect parent -> current node using smoothstep edges
    if (parentId) {
      edges.push({
        id: `edge_${parentId}_to_${nodeId}`,
        source: parentId,
        target: nodeId,
        sourceHandle: parentKey,
        type: 'smoothstep', // Orthogonal step-connector line (same as JSON Crack template)
      });
    }

    if (current && typeof current === 'object') {
      if (Array.isArray(current)) {
        current.forEach((item, index) => {
          const itemKey = `[${index}]`;
          const itemPath = `${currentPath}[${index}]`;
          if (isPrimitive(item)) {
            properties.push({
              key: itemKey,
              value: item,
              isPrimitive: true,
              path: itemPath,
            });
          } else {
            // Recurse first to obtain child node ID
            const childId = traverse(item, itemKey, nodeId, itemKey, itemPath);
            properties.push({
              key: itemKey,
              // Format node values showing key length or item count
              value: Array.isArray(item) ? `[${item.length} items]` : `{${Object.keys(item as object).length} keys}`,
              isPrimitive: false,
              path: itemPath,
              childNodeId: childId,
            });
          }
        });
      } else {
        Object.entries(current).forEach(([key, value]) => {
          const itemPath = currentPath === '$' ? `$.${key}` : `${currentPath}.${key}`;
          if (isPrimitive(value)) {
            properties.push({
              key,
              value,
              isPrimitive: true,
              path: itemPath,
            });
          } else {
            // Recurse first to obtain child node ID
            const childId = traverse(value, key, nodeId, key, itemPath);
            properties.push({
              key: key,
              // Format node values showing key length or item count
              value: Array.isArray(value) ? `[${value.length} items]` : `{${Object.keys(value as object).length} keys}`,
              isPrimitive: false,
              path: itemPath,
              childNodeId: childId,
            });
          }
        });
      }
    } else {
      // Fallback for primitive at root
      properties.push({
        key: 'Value',
        value: current,
        isPrimitive: true,
        path: currentPath,
      });
    }

    return nodeId;
  }

  if (data !== undefined && data !== null) {
    traverse(data, 'Root');
  }

  // Filter out collapsed descendant nodes and edges
  const visibleNodes = nodes.filter(n => !hiddenNodeIds.has(n.id));
  const visibleEdges = edges.filter(e => !hiddenNodeIds.has(e.source) && !hiddenNodeIds.has(e.target));

  return { nodes: visibleNodes, edges: visibleEdges };
}
