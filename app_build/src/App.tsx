import React, { useState, useEffect, useRef } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { EditorPanel } from './components/EditorPanel';
import type { InputFormat } from './components/EditorPanel';
import { GraphCanvas } from './components/GraphCanvas';
import { parseInput, convertToGraph } from './utils/parser';
import type { GraphNode, GraphEdge } from './utils/parser';
import { getLayoutedElements } from './utils/layout';

const INITIAL_JSON = `{
  "projectName": "JSONWeaver",
  "status": "Production Ready",
  "meta": {
    "version": "1.0.0",
    "zeroCostHosting": true,
    "security": {
      "privacyFirst": true,
      "dataRetention": "None (Local Thread)"
    }
  },
  "supportedFormats": ["JSON", "YAML", "CSV"],
  "libraries": {
    "canvas": "@xyflow/react",
    "layout": "Dagre.js",
    "parser": "js-yaml & PapaParse"
  }
}`;

function App() {
  const [inputText, setInputText] = useState<string>(INITIAL_JSON);
  const [format, setFormat] = useState<InputFormat>('json');

  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Search, Collapsed Node IDs, and sharing feedback states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [collapsedNodeIds, setCollapsedNodeIds] = useState<string[]>([]);
  const [shareStatus, setShareStatus] = useState<string | null>(null);

  // 1. Draggable Split Panel Logic
  const [leftWidth, setLeftWidth] = useState<number>(35); // Initial 35% width
  const isDragging = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const newWidth = (e.clientX / window.innerWidth) * 100;
      if (newWidth >= 15 && newWidth <= 85) {
        setLeftWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      if (isDragging.current) {
        isDragging.current = false;
        document.body.style.cursor = 'default';
        document.body.style.userSelect = 'auto'; // Re-enable text selection
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent text selection during drag
    isDragging.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none'; // Disable text selection across document
  };

  // 2. URL Hash Reconstruction on Mount
  useEffect(() => {
    const hash = window.location.hash.substring(1);
    if (hash) {
      try {
        const decoded = decodeURIComponent(escape(atob(hash)));
        const separatorIdx = decoded.indexOf('|');
        if (separatorIdx !== -1) {
          const fmt = decoded.substring(0, separatorIdx) as InputFormat;
          const text = decoded.substring(separatorIdx + 1);
          if (['json', 'yaml', 'csv'].includes(fmt)) {
            setFormat(fmt);
            setInputText(text);
          }
        }
      } catch (e) {
        console.error('Failed to restore state from URL hash', e);
      }
    }
  }, []);

  // 2. Toggle Node Branch Collapse Toggler handler
  const handleToggleCollapse = (nodeId: string) => {
    setCollapsedNodeIds((prev) =>
      prev.includes(nodeId) ? prev.filter((id) => id !== nodeId) : [...prev, nodeId]
    );
  };

  // Reset collapses on input edits or format switches to avoid ID conflicts
  const handleInputChange = (text: string) => {
    setInputText(text);
    setCollapsedNodeIds([]);
  };

  const handleFormatChange = (fmt: InputFormat) => {
    setFormat(fmt);
    setCollapsedNodeIds([]);
  };

  // 3. Parse & Layout Compute Hook (now listens to collapsedNodeIds)
  useEffect(() => {
    try {
      const parsedData = parseInput(inputText, format);
      
      // Pass collapsed states and toggle callbacks directly to parser mapper
      const { nodes: rawNodes, edges: rawEdges } = convertToGraph(
        parsedData, 
        collapsedNodeIds, 
        handleToggleCollapse
      );
      
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        rawNodes,
        rawEdges
      );

      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
      setError(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to parse inputs.');
    }
  }, [inputText, format, collapsedNodeIds]);

  // 4. Share URL Hash Generator & Copy
  const handleShare = () => {
    try {
      const stateString = `${format}|${inputText}`;
      const hash = btoa(unescape(encodeURIComponent(stateString)));
      const shareUrl = `${window.location.origin}${window.location.pathname}#${hash}`;
      
      navigator.clipboard.writeText(shareUrl).then(() => {
        setShareStatus('Link Copied! 🔗');
        setTimeout(() => setShareStatus(null), 2500);
      });
    } catch (e) {
      console.error('Failed to generate share URL', e);
      setShareStatus('Generation failed');
      setTimeout(() => setShareStatus(null), 2000);
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-slate-50 text-slate-800 overflow-hidden">
      {/* Premium Top Navigation Bar */}
      <header className="h-14 border-b border-slate-200/80 bg-white flex items-center justify-between px-6 flex-shrink-0 select-none shadow-sm shadow-slate-100/50">
        <div className="flex items-center gap-2">
          {/* Logo element */}
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center font-bold text-white shadow-md shadow-violet-500/20 text-xs">
            JW
          </div>
          <span className="font-bold tracking-tight text-slate-800 text-sm">JSONWeaver</span>
          <span className="text-[9px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded border border-slate-200/50">
            v1.0.0
          </span>
        </div>

        {/* Live Diagram Search Bar */}
        <div className="flex-1 max-w-sm mx-6 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search keys, values, or node titles..."
            className="w-full text-xs bg-slate-100 hover:bg-slate-200/50 focus:bg-white text-slate-800 placeholder-slate-400 font-medium pl-8 pr-3 py-1.5 rounded-lg border border-slate-200/60 focus:border-violet-400 focus:outline-none focus:ring-1 focus:ring-violet-400/20 transition-all"
          />
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={2.5} 
            stroke="currentColor" 
            className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.637 10.637Z" />
          </svg>
        </div>

        <div className="flex items-center gap-3">
          {/* Share Button with Feedback Label */}
          <div className="relative">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-100 border border-slate-200/60 px-3 py-1.5 rounded-lg hover:bg-slate-200/50 active:scale-95 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5 text-slate-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
              </svg>
              Share Link
            </button>
            {shareStatus && (
              <span className="absolute -bottom-8 right-0 text-[10px] font-bold text-white bg-slate-800 px-2 py-0.5 rounded shadow-md whitespace-nowrap z-50">
                {shareStatus}
              </span>
            )}
          </div>

          {/* Privacy Shield */}
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-100/60 px-3 py-1.5 rounded-lg font-semibold">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
            </svg>
            <span>Local Secure</span>
          </div>
        </div>
      </header>

      {/* Main Workspace Split Panels */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 relative">
        {/* Editor */}
        <div 
          className="w-full md:w-auto h-[40%] md:h-full flex-shrink-0"
          style={{ width: window.innerWidth >= 768 ? `${leftWidth}%` : '100%' }}
        >
          <EditorPanel
            value={inputText}
            onChange={handleInputChange}
            format={format}
            onFormatChange={handleFormatChange}
            error={error}
          />
        </div>

        {/* Desktop Resizable Drag Handle */}
        <div 
          className="hidden md:flex flex-col justify-center items-center w-1.5 cursor-col-resize bg-slate-200/80 hover:bg-violet-400 active:bg-violet-500 transition-colors z-40"
          onMouseDown={handleMouseDown}
          title="Drag to resize panels"
        >
          <div className="w-0.5 h-12 bg-slate-400/50 rounded-full"></div>
        </div>

        {/* Viewer Flow Canvas */}
        <div className="flex-1 h-[60%] md:h-full relative overflow-hidden">
          <ReactFlowProvider>
            <GraphCanvas
              nodes={nodes}
              edges={edges}
              searchQuery={searchQuery}
            />
          </ReactFlowProvider>
        </div>
      </div>
    </div>
  );
}

export default App;
