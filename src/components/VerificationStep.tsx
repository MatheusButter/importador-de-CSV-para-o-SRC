import React from 'react';
import { DataGrid } from './DataGrid';
import { StandardRecord, ColumnMapping, TargetFieldKey } from '../types';
import { isValidCpf } from '../utils/csvConverter';

interface VerificationStepProps {
  records: StandardRecord[];
  sourceHeaders?: string[];
  mapping?: ColumnMapping;
  onUpdateMapping?: (sourceHeader: string, targetKey: TargetFieldKey | 'ignore') => void;
  onUpdateRecord: (id: string, updatedFields: Partial<StandardRecord>) => void;
  onDeleteRecord: (id: string) => void;
  onAddRecord: () => void;
  onClearAll: () => void;
  onPrevStep: () => void;
  onNextStep: () => void;
}

export const VerificationStep: React.FC<VerificationStepProps> = ({
  records,
  onUpdateRecord,
  onDeleteRecord,
  onAddRecord,
  onClearAll,
  onPrevStep,
  onNextStep,
}) => {
  // Stats
  const totalCount = records.length;
  const invalidCount = records.filter((r) => !r.cpf || !isValidCpf(r.cpf)).length;
  const validCount = totalCount - invalidCount;

  return (
    <div className="flex flex-col w-full space-y-6">
      {/* Stepper Indicator */}
      <div className="w-full bg-white p-4 sm:p-5 rounded-xl shadow-xs border border-[#bccac0]/25 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Step 1 */}
        <button
          onClick={onPrevStep}
          className="flex items-center gap-3 w-full md:w-auto hover:opacity-80 transition-opacity cursor-pointer text-left"
        >
          <div className="w-8 h-8 rounded-full bg-[#00855d] text-white flex items-center justify-center shadow-xs">
            <span className="material-symbols-outlined text-[18px]">check</span>
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-[10px] text-[#006948] font-bold uppercase tracking-wider">Passo 1</span>
            <span className="text-sm font-semibold text-[#131b2e] line-through opacity-70">Importar Planilha</span>
          </div>
        </button>

        <div className="hidden sm:block w-12 h-0.5 bg-[#00855d]/40 rounded-full"></div>

        {/* Step 2 (Active) */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-8 h-8 rounded-full bg-[#006948] text-white flex items-center justify-center shadow-md ring-4 ring-[#85f8c4]/40 font-bold text-xs font-mono">
            2
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-[10px] text-[#006948] font-bold uppercase tracking-wider">Passo 2 (Ativo)</span>
            <span className="text-sm font-bold text-[#131b2e]">Verificar & Editar</span>
          </div>
        </div>

        <div className="hidden sm:block w-12 h-0.5 bg-[#eaedff] rounded-full"></div>

        {/* Step 3 */}
        <button
          onClick={onNextStep}
          className="flex items-center gap-3 w-full md:w-auto opacity-70 hover:opacity-100 transition-opacity cursor-pointer text-left"
        >
          <div className="w-8 h-8 rounded-full bg-[#eaedff] text-[#3d4a42] flex items-center justify-center font-mono text-xs font-bold">
            3
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-[10px] text-[#3d4a42] uppercase tracking-wider">Passo 3</span>
            <span className="text-sm text-[#3d4a42] font-semibold">Exportar SRC</span>
          </div>
        </button>
      </div>

      {/* Header & KPI Counters */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 text-[#006948] font-mono text-[11px] font-bold uppercase tracking-widest">
            <span className="material-symbols-outlined text-[18px]">fact_check</span>
            <span>Auditoria e Higienização de Registros</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#131b2e] tracking-tight">
            Verificar &amp; Editar Informações
          </h1>
          <p className="text-sm text-[#3d4a42] mt-1">
            Conferência semântica e validação de padrões acadêmicos do Ifes antes da conversão final.
          </p>
        </div>

        {/* Quick Metrics Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="bg-white px-3.5 py-2 rounded-lg shadow-xs border border-[#bccac0]/25 flex flex-col">
            <span className="text-[11px] text-[#3d4a42] font-mono">Total Carregado</span>
            <span className="text-sm font-bold text-[#131b2e] flex items-center gap-1.5 mt-0.5 font-mono">
              <span className="w-2 h-2 rounded-full bg-[#006591]"></span>
              {totalCount} registros
            </span>
          </div>

          <div className="bg-white px-3.5 py-2 rounded-lg shadow-xs border border-[#bccac0]/25 flex flex-col">
            <span className="text-[11px] text-[#3d4a42] font-mono">Conformidade</span>
            <span className="text-sm font-bold text-[#006948] flex items-center gap-1.5 mt-0.5 font-mono">
              <span className="w-2 h-2 rounded-full bg-[#006948]"></span>
              {validCount} validados
            </span>
          </div>

          <div className="bg-white px-3.5 py-2 rounded-lg shadow-xs border border-[#bccac0]/25 flex flex-col">
            <span className="text-[11px] text-[#3d4a42] font-mono">Inconsistências</span>
            <span className={`text-sm font-bold flex items-center gap-1.5 mt-0.5 font-mono ${invalidCount > 0 ? 'text-[#ba1a1a]' : 'text-[#131b2e]'}`}>
              <span className={`w-2 h-2 rounded-full ${invalidCount > 0 ? 'bg-[#ba1a1a]' : 'bg-[#6d7a72]'}`}></span>
              {invalidCount} erros
            </span>
          </div>

          <div className="bg-white px-3.5 py-2 rounded-lg shadow-xs border border-[#bccac0]/25 flex flex-col">
            <span className="text-[11px] text-[#3d4a42] font-mono">Esquema Alvo</span>
            <span className="text-sm font-bold text-[#006591] flex items-center gap-1.5 mt-0.5 font-mono">
              <span className="w-2 h-2 rounded-full bg-[#39b8fd]"></span>
              7 colunas oficiais
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Data Grid Section */}
      <section className="space-y-3">
        <DataGrid
          records={records}
          onUpdateRecord={onUpdateRecord}
          onDeleteRecord={onDeleteRecord}
          onAddRecord={onAddRecord}
          onClearAll={onClearAll}
        />
      </section>

      {/* Bottom Step Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <button
          onClick={onPrevStep}
          className="w-full sm:w-auto px-6 py-3 bg-white text-[#131b2e] font-semibold text-sm rounded-xl shadow-xs border border-[#bccac0]/30 hover:bg-[#f2f3ff] transition-all flex items-center justify-center gap-2 cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Voltar para Importação (Passo 1)</span>
        </button>

        <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-[11px] font-mono text-[#006948] font-bold">PRONTO PARA CONVERSÃO</span>
            <span className="text-xs text-[#3d4a42]">Codificação UTF-8 • Tabulação SRC</span>
          </div>

          <button
            onClick={onNextStep}
            className="w-full sm:w-auto px-8 py-3 bg-[#006948] hover:bg-[#00855d] text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer"
            type="button"
          >
            <span>Avançar para Exportação SRC</span>
            <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
