import React from 'react';
import { ColumnMapping, TargetFieldKey, TARGET_COLUMNS } from '../types';
import { CheckCircle2, SlidersHorizontal, ArrowRight } from 'lucide-react';

interface MappingInspectorProps {
  sourceHeaders: string[];
  mapping: ColumnMapping;
  onUpdateMapping: (sourceHeader: string, targetKey: TargetFieldKey | 'ignore') => void;
}

export const MappingInspector: React.FC<MappingInspectorProps> = ({
  sourceHeaders,
  mapping,
  onUpdateMapping,
}) => {
  // Count how many target columns are satisfied
  const mappedTargets = new Set(Object.values(mapping).filter((v) => v !== 'ignore'));
  const mappedCount = mappedTargets.size;
  const isAllMapped = mappedCount >= TARGET_COLUMNS.length;

  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-150">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-neutral-600" />
          <h3 className="text-sm font-semibold text-neutral-900">
            Mapeamento de Colunas Detectado
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {isAllMapped ? (
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Todas as 7 colunas obrigatórias mapeadas</span>
            </div>
          ) : (
            <div className="text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md font-medium">
              {mappedCount} de {TARGET_COLUMNS.length} colunas associadas
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
        {sourceHeaders.map((header) => {
          const currentTarget = mapping[header] || 'ignore';
          const targetDef = TARGET_COLUMNS.find((t) => t.key === currentTarget);

          return (
            <div
              key={header}
              className={`p-2.5 rounded-lg border text-xs transition-colors ${
                currentTarget !== 'ignore'
                  ? 'border-emerald-200 bg-emerald-50/30'
                  : 'border-neutral-200 bg-neutral-50/50'
              }`}
            >
              <div className="text-neutral-500 font-medium truncate mb-1" title={header}>
                Planilha: <strong className="text-neutral-800 font-semibold">{header}</strong>
              </div>

              <div className="flex items-center gap-1.5 mt-2">
                <ArrowRight className="w-3 h-3 text-neutral-400 shrink-0" />
                <select
                  value={currentTarget}
                  onChange={(e) =>
                    onUpdateMapping(header, e.target.value as TargetFieldKey | 'ignore')
                  }
                  className="w-full bg-white border border-neutral-200 rounded px-2 py-1 text-xs text-neutral-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="ignore">-- Ignorar esta coluna --</option>
                  {TARGET_COLUMNS.map((col) => (
                    <option key={col.key} value={col.key}>
                      → "{col.targetHeader}" ({col.description})
                    </option>
                  ))}
                </select>
              </div>

              {targetDef && (
                <div className="mt-1.5 text-[10px] text-emerald-700 font-mono flex items-center justify-between">
                  <span>Destino: "{targetDef.targetHeader}"</span>
                  <span className="text-neutral-400 font-sans">OK</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
