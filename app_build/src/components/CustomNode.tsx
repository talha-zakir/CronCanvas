import React from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeData } from '../utils/parser';

interface CustomNodeProps {
  data: NodeData & { searchQuery?: string };
}

// Generates consistent, beautiful pastel colors dynamically based on the node's title
const getPastelColorTheme = (str: string, nodeType: string) => {
  if (nodeType === 'root') {
    // Force a premium warm rose theme for root
    return {
      cardBorder: 'border-rose-200 hover:border-rose-300 shadow-rose-50/30',
      headerBg: 'bg-rose-100/60 border-b border-rose-200 text-rose-800',
      badgeClass: 'bg-rose-200/50 text-rose-700 border border-rose-200/30',
    };
  }

  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % 4;
  
  const themes = [
    { // Lavender / Purple
      cardBorder: 'border-purple-200 hover:border-purple-300 shadow-purple-50/30',
      headerBg: 'bg-purple-100/60 border-b border-purple-200 text-purple-800',
      badgeClass: 'bg-purple-200/50 text-purple-700 border border-purple-200/30',
    },
    { // Sky / Blue
      cardBorder: 'border-sky-200 hover:border-sky-300 shadow-sky-50/30',
      headerBg: 'bg-sky-100/60 border-b border-sky-200 text-sky-800',
      badgeClass: 'bg-sky-200/50 text-sky-700 border border-sky-200/30',
    },
    { // Emerald / Green
      cardBorder: 'border-emerald-200 hover:border-emerald-300 shadow-emerald-50/30',
      headerBg: 'bg-emerald-100/60 border-b border-emerald-200 text-emerald-800',
      badgeClass: 'bg-emerald-200/50 text-emerald-700 border border-emerald-200/30',
    },
    { // Amber / Orange / Cream
      cardBorder: 'border-amber-200 hover:border-amber-300 shadow-amber-50/30',
      headerBg: 'bg-amber-100/60 border-b border-amber-200 text-amber-800',
      badgeClass: 'bg-amber-200/50 text-amber-700 border border-amber-200/30',
    }
  ];
  return themes[index];
};

export const CustomNode: React.FC<CustomNodeProps> = ({ data }) => {
  const isHorizontal = true;
  const targetPosition = Position.Left;
  const sourcePosition = Position.Right;

  // Search Match Evaluation logic
  const query = data.searchQuery?.trim().toLowerCase();
  const isTitleMatch = query ? data.title.toLowerCase().includes(query) : false;
  
  const matchingRowIndexes = new Set<number>();
  let hasRowMatch = false;

  if (query) {
    data.properties.forEach((prop, idx) => {
      const keyStr = String(prop.key).toLowerCase();
      const valStr = String(prop.value).toLowerCase();
      if (keyStr.includes(query) || valStr.includes(query)) {
        matchingRowIndexes.add(idx);
        hasRowMatch = true;
      }
    });
  }

  const isMatchedNode = isTitleMatch || hasRowMatch;

  // Fetch color theme dynamically based on node title hash
  const theme = getPastelColorTheme(data.title, data.type);
  const cardBorder = isMatchedNode 
    ? 'border-violet-400 ring-2 ring-violet-500/80 shadow-violet-100/80' 
    : theme.cardBorder;

  const getValColor = (val: any) => {
    if (typeof val === 'number') return 'text-amber-600 font-semibold font-mono';
    if (typeof val === 'boolean') return 'text-teal-600 font-semibold font-mono';
    if (val === null) return 'text-rose-500 font-medium italic';
    return 'text-slate-700 font-sans';
  };

  // Helper to detect hex color code
  const isColorHex = (val: any) => {
    return typeof val === 'string' && /^#[0-9A-F]{3,8}$/i.test(val.trim());
  };

  // Generates small premium data-type icon badges
  const getTypeIcon = (val: any, isPrimitive: boolean) => {
    const baseClass = "w-4 h-4 rounded flex items-center justify-center text-[9px] font-black font-mono flex-shrink-0 shadow-sm border border-black/5 ";
    
    if (isPrimitive && isColorHex(val)) {
      return (
        <div 
          className={baseClass + "bg-transparent ring-1 ring-inset ring-black/10"} 
          style={{ backgroundColor: String(val).trim() }} 
          title="Color (Hex)" 
        />
      );
    }

    if (!isPrimitive) {
      if (typeof val === 'string' && val.startsWith('[')) {
        return <div className={baseClass + "bg-sky-100 text-sky-600"} title="Array">[]</div>;
      }
      return <div className={baseClass + "bg-orange-100 text-orange-600"} title="Object">{'{}'}</div>;
    }
    if (typeof val === 'number') {
      return <div className={baseClass + "bg-amber-100 text-amber-600"} title="Number">#</div>;
    }
    if (typeof val === 'boolean') {
      return <div className={baseClass + "bg-teal-100 text-teal-600 text-[10px]"} title="Boolean">✓</div>;
    }
    if (val === null) {
      return <div className={baseClass + "bg-rose-100 text-rose-600 text-[8px]"} title="Null">∅</div>;
    }
    return <div className={baseClass + "bg-indigo-100 text-indigo-500"} title="String">Aa</div>;
  };

  return (
    <div className={`bg-white/95 border rounded-xl shadow-md overflow-hidden min-w-[260px] backdrop-blur-sm transition-all duration-300 hover:shadow-xl whitespace-nowrap ${cardBorder}`}>
      {/* Input Handle - Made perfectly flush (0x0) for clean line snaps */}
      {data.type !== 'root' && (
        <Handle
          type="target"
          position={targetPosition}
          className="opacity-0"
          style={{
            width: '6px',
            height: '6px',
            left: isHorizontal ? '-3px' : '50%',
            top: isHorizontal ? '50%' : '-3px',
            transform: isHorizontal ? 'translateY(-50%)' : 'translateX(-50%)',
          }}
        />
      )}

      {/* Node Header */}
      <div className={`px-3 py-2 flex items-center justify-between ${theme.headerBg}`}>
        <div className="flex items-center gap-1.5 min-w-0 flex-1 mr-2 select-none">
          <span 
            className={`font-bold text-slate-800 text-xs font-sans ${isTitleMatch ? 'bg-amber-100 px-1 rounded border border-amber-200/50 animate-pulse' : ''}`} 
            title={data.title}
          >
            {data.title}
          </span>
        </div>
        <span className={`text-[9px] font-extrabold tracking-wider px-2 py-0.5 rounded-full uppercase select-none ${theme.badgeClass}`}>
          {data.type}
        </span>
      </div>

      {/* Node Content / Properties List */}
      <div className="p-0 bg-white">
        {data.properties.length === 0 ? (
          <div className="text-slate-400 text-xs italic px-3 py-2">Empty</div>
        ) : (
          <table className="w-full text-left text-xs border-collapse whitespace-nowrap">
            <tbody>
              {data.properties.map((prop, idx) => {
                const isRowMatch = matchingRowIndexes.has(idx);
                const isChildCollapsed = prop.childNodeId 
                  ? data.collapsedNodeIds?.includes(prop.childNodeId) 
                  : false;

                const hexColor = isColorHex(prop.value) ? String(prop.value).trim() : null;

                return (
                  <tr 
                    key={`${prop.key}-${idx}`} 
                    title={prop.path}
                    className={`transition-colors border-b border-slate-100 cursor-help relative ${
                      isRowMatch 
                        ? 'bg-amber-100/70 hover:bg-amber-200/50 font-medium' 
                        : 'hover:bg-slate-50/40 text-slate-700'
                    }`}
                  >
                    {/* Key Column - Blue text with vertical divider */}
                    <td className="py-2 px-3 font-semibold font-mono text-blue-500 border-r border-slate-100/70 align-middle select-all w-[45%] bg-slate-50/10">
                      <div className="flex items-center justify-between gap-1.5 w-full">
                        <div className="flex items-center gap-1.5 min-w-0">
                          {getTypeIcon(prop.value, prop.isPrimitive)}
                          <span>{prop.key}</span>
                        </div>
                        {data.onToggleCollapse && prop.childNodeId && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (data.onToggleCollapse) {
                                data.onToggleCollapse(prop.childNodeId!);
                              }
                            }}
                            className="text-[9px] text-slate-500 hover:text-slate-800 w-3.5 h-3.5 rounded bg-slate-100 hover:bg-slate-200 border border-slate-200/40 flex items-center justify-center font-bold font-mono transition-all active:scale-90 select-none cursor-pointer flex-shrink-0"
                            title={isChildCollapsed ? "Expand sub-branch" : "Collapse sub-branch"}
                          >
                            {isChildCollapsed ? '+' : '−'}
                          </button>
                        )}
                      </div>
                    </td>
                    
                    {/* Value Column */}
                    <td className="py-2 px-3 align-middle select-all relative pr-6 w-[60%]">
                      {prop.isPrimitive ? (
                        hexColor ? (
                          // Hex Color Preview block next to code
                          <div className="flex items-center gap-1.5">
                            <span 
                              className="w-3.5 h-3.5 rounded-md border border-slate-300/80 inline-block shadow-sm" 
                              style={{ backgroundColor: hexColor }} 
                            />
                            <span className="text-slate-700 font-mono text-xs font-medium">{hexColor}</span>
                          </div>
                        ) : (
                          <span className={getValColor(prop.value)}>
                            {typeof prop.value === 'string' ? `"${prop.value}"` : String(prop.value)}
                          </span>
                        )
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-blue-600 bg-blue-50/80 border border-blue-100 px-2 py-0.5 rounded-lg font-bold select-none">
                            {prop.value}
                          </span>
                          
                          {/* Output Connection Socket - Made perfectly flush for line snaps */}
                          {!isChildCollapsed && (
                            <Handle
                              type="source"
                              position={sourcePosition}
                              id={prop.key}
                              className="opacity-0"
                              style={{
                                width: '6px',
                                height: '6px',
                                top: isHorizontal ? '50%' : 'auto',
                                bottom: isHorizontal ? 'auto' : '-3px',
                                right: isHorizontal ? '-3px' : '50%',
                                left: 'auto',
                                transform: isHorizontal ? 'translateY(-50%)' : 'translateX(-50%)',
                                position: 'absolute',
                              }}
                            />
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
