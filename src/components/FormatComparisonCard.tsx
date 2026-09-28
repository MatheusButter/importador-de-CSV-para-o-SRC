import React, { useState } from 'react';
import { ArrowRight, ChevronDown, ChevronUp, Check, Info } from 'lucide-react';
import { TARGET_COLUMNS } from '../types';

export const FormatComparisonCard: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-4 sm:p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100">
        <div className="flex items-start gap-2.5">
          <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md mt-0.5">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-neutral-900">
              Regra de Padronização para o Sistema de Destino
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Transformação automática da planilha .ODS para o formato CSV exigido
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-neutral-600 hover:text-neutral-900 flex items-center gap-1 font-medium self-start sm:self-center cursor-pointer"
        >
          <span>{isExpanded ? 'Ocultar detalhes' : 'Ver mapeamento de colunas'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Quick summary badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 text-xs">
        <div className="bg-neutral-50 border border-neutral-150 rounded-lg p-2.5">
          <div className="text-neutral-500 font-medium">1. Cabeçalhos Exatos</div>
          <div className="text-neutral-900 font-mono text-[11px] mt-1 truncate font-medium">
            "Nome" · "Nascimento" · "CPF" · "Email" · "Carga horária" · "Início" · "Fim"
          </div>
        </div>

        <div className="bg-neutral-50 border border-neutral-150 rounded-lg p-2.5">
          <div className="text-neutral-500 font-medium">2. Limpeza de CPF</div>
          <div className="text-neutral-800 font-mono text-[11px] mt-1 flex items-center gap-1.5">
            <span className="text-neutral-400 line-through">124.982.107-43</span>
            <ArrowRight className="w-3 h-3 text-emerald-600 shrink-0" />
            <span className="font-semibold text-emerald-700">12498210743</span>
          </div>
        </div>

        <div className="bg-neutral-50 border border-neutral-150 rounded-lg p-2.5">
          <div className="text-neutral-500 font-medium">3. Delimitador & Aspas</div>
          <div className="text-neutral-800 font-mono text-[11px] mt-1 flex items-center gap-1">
            <Check className="w-3 h-3 text-emerald-600 shrink-0" />
            <span>Tabulação (\t) com aspas duplas ("...")</span>
          </div>
        </div>
      </div>

      {/* Expanded Table Comparison */}
      {isExpanded && (
        <div className="mt-4 pt-3 border-t border-neutral-100 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 text-neutral-500 font-medium bg-neutral-50/50">
                <th className="py-2 px-3">Coluna Original na Imagem (.ODS)</th>
                <th className="py-2 px-2 text-center w-8"></th>
                <th className="py-2 px-3 font-semibold text-neutral-900">Cabeçalho Destino no CSV</th>
                <th className="py-2 px-3">Regra de Conversão / Exemplo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-mono text-[11px]">
              {TARGET_COLUMNS.map((col) => (
                <tr key={col.key} className="hover:bg-neutral-50/60 transition-colors">
                  <td className="py-2 px-3 text-neutral-600 font-medium">
                    {col.sampleInputHeader}
                  </td>
                  <td className="py-2 px-2 text-center text-neutral-400">
                    <ArrowRight className="w-3 h-3 mx-auto text-neutral-400" />
                  </td>
                  <td className="py-2 px-3 text-emerald-700 font-bold bg-emerald-50/30">
                    "{col.targetHeader}"
                  </td>
                  <td className="py-2 px-3 text-neutral-600 font-sans text-xs">
                    {col.formatDescription}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
