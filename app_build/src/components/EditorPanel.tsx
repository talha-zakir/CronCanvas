import React from 'react';

export type InputFormat = 'json' | 'yaml' | 'csv';

interface EditorPanelProps {
  value: string;
  onChange: (val: string) => void;
  format: InputFormat;
  onFormatChange: (format: InputFormat) => void;
  error: string | null;
}

const SAMPLES = {
  json: `{
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
}`,
  yaml: `projectName: JSONWeaver
status: Production Ready
meta:
  version: 1.0.0
  zeroCostHosting: true
  security:
    privacyFirst: true
    dataRetention: None (Local Thread)
supportedFormats:
  - JSON
  - YAML
  - CSV
libraries:
  canvas: "@xyflow/react"
  layout: Dagre.js
  parser: js-yaml & PapaParse`,
  csv: `id,libraryName,type,purpose,license
1,@xyflow/react,Visualization,Interactive Node-Link Canvas,MIT
2,Dagre.js,Layout Engine,Directed Acyclic Coordinates,BSD-3-Clause
3,js-yaml,YAML Parser,Convert YAML strings to JS,MIT
4,PapaParse,CSV Parser,Parse Tabular files to Array,MIT`
};

export const EditorPanel: React.FC<EditorPanelProps> = ({
  value,
  onChange,
  format,
  onFormatChange,
  error,
}) => {
  const loadSample = () => {
    onChange(SAMPLES[format]);
  };

  return (
    <div className="w-full h-full flex flex-col bg-white border-r border-slate-200">
      {/* Header bar */}
      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-violet-400"></div>
          <h2 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Data Weaver Editor</h2>
        </div>
        <button
          onClick={loadSample}
          className="text-xs text-violet-700 bg-violet-50 border border-violet-100 hover:bg-violet-100/70 transition px-2.5 py-1 rounded-lg font-medium"
        >
          Load Sample
        </button>
      </div>

      {/* Format Selector Tab Selector */}
      <div className="flex bg-slate-50/50 border-b border-slate-100 text-xs flex-shrink-0">
        {(['json', 'yaml', 'csv'] as InputFormat[]).map((fmt) => (
          <button
            key={fmt}
            onClick={() => {
              onFormatChange(fmt);
              onChange(SAMPLES[fmt]);
            }}
            className={`flex-1 py-2.5 font-bold transition uppercase tracking-wider border-b-2 ${
              format === fmt
                ? 'border-violet-500 bg-white text-slate-800'
                : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-100/20'
            }`}
          >
            {fmt}
          </button>
        ))}
      </div>

      {/* Textarea Code Input area */}
      <div className="flex-1 relative min-h-0 bg-slate-50/30">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-full bg-transparent text-slate-700 font-mono text-xs p-4 outline-none resize-none focus:bg-white transition-colors custom-scrollbar selection:bg-violet-100"
          placeholder={`Paste your raw ${format.toUpperCase()} here...`}
          spellCheck={false}
        />
      </div>

      {/* Syntax Error Visualizer Panel */}
      <div className="flex-shrink-0">
        {error ? (
          <div className="bg-rose-50 border-t border-rose-100 text-rose-700 p-3 text-xs font-mono flex items-start gap-2 select-all">
            <span className="text-rose-600 font-bold">⚠️ Error:</span>
            <span className="break-all">{error}</span>
          </div>
        ) : (
          <div className="bg-emerald-50/60 border-t border-emerald-100/80 text-emerald-700 p-3 text-xs font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Parsing Successful • Secure Local Thread</span>
          </div>
        )}
      </div>
    </div>
  );
};
