import React, { useEffect, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  Panel,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { domToPng } from 'modern-screenshot';

import type { GraphNode, GraphEdge } from '../utils/parser';
import { CustomNode } from './CustomNode';

const nodeTypes = {
  customNode: CustomNode,
};

const BACKGROUND_PRESETS = [
  { name: 'Slate', value: '#f1f5f9', dotColor: '#cbd5e1', previewBg: '#f1f5f9', border: '#cbd5e1' },
  { name: 'Cream', value: '#fdfbf7', dotColor: '#e7e5e4', previewBg: '#fdfbf7', border: '#e7e5e4' },
  { name: 'Sage', value: '#f4f7f5', dotColor: '#cbdad0', previewBg: '#f4f7f5', border: '#cbdad0' },
  { name: 'Lavender', value: '#faf5ff', dotColor: '#e9d5ff', previewBg: '#faf5ff', border: '#e9d5ff' },
  { name: 'Mint', value: '#f0fdf4', dotColor: '#bbf7d0', previewBg: '#f0fdf4', border: '#bbf7d0' },
];

interface GraphCanvasProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  searchQuery: string;
}

export const GraphCanvas: React.FC<GraphCanvasProps> = ({
  nodes: initialNodes,
  edges: initialEdges,
  searchQuery,
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { fitView, getViewport, setViewport } = useReactFlow();
  
  // Default background color set to Slate preset
  const [activeTheme, setActiveTheme] = useState(BACKGROUND_PRESETS[0]);

  // Hover dimming removed per user request

  // Sync state whenever the parent computed elements change or when search occurs
  useEffect(() => {
    const nodesWithDirection = initialNodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        searchQuery,
      }
    }));
    setNodes(nodesWithDirection);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, searchQuery, setNodes, setEdges]);

  // PNG Canvas Snapshot Export Logic using modern-screenshot
  const onExportPng = () => {
    // We capture the entire .react-flow container to ensure all styles, background patterns,
    // and layout boundaries are fully preserved.
    const flowElement = document.querySelector('.react-flow') as HTMLElement;
    if (flowElement) {
      if (nodes.length === 0) return;

      // Save the current viewport so we can restore it after capture
      const originalViewport = getViewport();

      const prepareAndCapture = async () => {
        // Use the SAME padding as the on-screen preview so export matches exactly
        fitView({ padding: 0.3 });
        // Wait for React Flow to complete the layout render cycle
        await new Promise((resolve) => setTimeout(resolve, 200));

        // Inject physical width/height attributes to all SVGs to prevent them from collapsing to 0x0
        const originalSvgAttrs = new Map<SVGElement, { width: string | null; height: string | null }>();
        const svgElements = Array.from(flowElement.querySelectorAll('svg'));
        svgElements.forEach((svg) => {
          originalSvgAttrs.set(svg, {
            width: svg.getAttribute('width'),
            height: svg.getAttribute('height'),
          });
          const rect = svg.getBoundingClientRect();
          svg.setAttribute('width', String(rect.width || flowElement.offsetWidth));
          svg.setAttribute('height', String(rect.height || flowElement.offsetHeight));
        });

        // Fetch Google Fonts CSS so modern-screenshot can embed the actual font data.
        // The Google Fonts CSS endpoint is CORS-enabled, so fetch() works fine.
        // Without this, the export falls back to system fonts (the cross-origin <link>
        // stylesheet can't be read via cssRules due to SecurityError).
        let fontCssText = '';
        try {
          const fontUrl = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap';
          const resp = await fetch(fontUrl);
          if (resp.ok) {
            fontCssText = await resp.text();
          }
        } catch (e) {
          console.warn('Could not fetch Google Fonts CSS for export, using system fallback', e);
        }

        try {
          const dataUrl = await domToPng(flowElement, {
            backgroundColor: activeTheme.value,
            filter: (node) => {
              // Filter out UI controls and widgets we don't want in the final image
              if (
                node instanceof HTMLElement &&
                (node.getAttribute('data-export-ignore') === 'true' ||
                 node.classList.contains('react-flow__controls') ||
                 node.classList.contains('react-flow__panel') ||
                 node.classList.contains('react-flow__attribution'))
              ) {
                return false;
              }
              return true;
            },
            scale: 2, // Double density for high-res clarity
            // Embed the fetched Google Fonts so the export uses the same typefaces as the preview
            font: fontCssText
              ? { cssText: fontCssText, preferredFormat: 'woff2' }
              : undefined,
          });

          // Trigger download
          const a = document.createElement('a');
          a.setAttribute('download', 'json-weaver-high-res.png');
          a.setAttribute('href', dataUrl);
          a.click();
        } finally {
          // Restore original SVG attributes
          originalSvgAttrs.forEach((attrs, svg) => {
            if (attrs.width === null) {
              svg.removeAttribute('width');
            } else {
              svg.setAttribute('width', attrs.width);
            }
            if (attrs.height === null) {
              svg.removeAttribute('height');
            } else {
              svg.setAttribute('height', attrs.height);
            }
          });

          // Restore original viewport
          setViewport(originalViewport);
        }
      };

      prepareAndCapture().catch((error) => {
        console.error('Failed to export graph diagram to PNG', error);
      });
    }
  };

  return (
    <div 
      className="w-full h-full relative transition-colors duration-500" 
      style={{ backgroundColor: activeTheme.value }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.1}
        maxZoom={2.0}
        proOptions={{ hideAttribution: true }}
        defaultEdgeOptions={{
          style: { stroke: '#94a3b8', strokeWidth: 2 },
        }}
      >
        <Background color={activeTheme.dotColor} gap={16} size={1} />
        
        {/* Customized Controls Panel - Light Theme */}
        <Controls 
          data-export-ignore="true"
          className="!bg-white !border-slate-200 !rounded-xl !shadow-lg [&_button]:!bg-white [&_button]:!border-slate-100 [&_button]:!text-slate-600 [&_button:hover]:!bg-slate-50 [&_svg]:!fill-slate-500" 
        />
        


        {/* Dynamic Options & Theme Toolbar Panel */}
        <Panel 
          data-export-ignore="true"
          position="top-right" 
          className="flex flex-col gap-2.5 bg-white/95 border border-slate-200/80 backdrop-blur p-3 rounded-xl shadow-md min-w-[280px]"
        >


          {/* Theme Customization */}
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-500 text-xs font-bold select-none">Background Theme</span>
            <div className="flex gap-1.5 items-center">
              {BACKGROUND_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => setActiveTheme(preset)}
                  className={`w-4 h-4 rounded-full border transition-all ${
                    activeTheme.name === preset.name
                      ? 'ring-2 ring-violet-500 ring-offset-1 scale-110'
                      : 'hover:scale-105'
                  }`}
                  style={{
                    backgroundColor: preset.previewBg,
                    borderColor: preset.border,
                  }}
                  title={`${preset.name} Background`}
                />
              ))}
            </div>
          </div>

          <div className="border-t border-slate-100 my-0.5"></div>

          {/* Export Actions */}
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-500 text-xs font-bold select-none">Export Snapshot</span>
            <button
              onClick={onExportPng}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-violet-700 bg-violet-50 hover:bg-violet-100 hover:text-violet-800 border border-violet-100 transition-all select-none w-full text-center active:scale-95"
              title="Download snapshot as PNG Image"
            >
              📷 Download PNG Image
            </button>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
};
