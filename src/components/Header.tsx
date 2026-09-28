import React from 'react';
import { downloadSampleOdsSpreadsheet } from '../utils/csvConverter';

export type StepType = 'importacao' | 'verificacao' | 'exportacao' | 'tutorial_src';

interface HeaderProps {
  currentStep: StepType;
  onNavigateStep: (step: StepType) => void;
  onClearAll: () => void;
  onOpenHelp: () => void;
  recordCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentStep,
  onNavigateStep,
  onClearAll,
  onOpenHelp,
  recordCount,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-[0_1px_8px_rgba(19,27,46,0.06)] border-b border-[#bccac0]/30">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-between pt-3 pb-0">
        {/* Top bar row */}
        <div className="flex items-center justify-between w-full pb-2">
          {/* Brand & Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#006948] text-white flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[20px]">table_chart</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-[#131b2e] tracking-tight">
                  Conversor ODS / XLS para CSV
                </span>
                <span className="text-[11px] font-mono font-medium bg-[#eaedff] text-[#3d4a42] px-2 py-0.5 rounded border border-[#bccac0]/30 hidden sm:inline-block">
                  v2.4 SRC • Ifes
                </span>
              </div>
              <span className="text-[11px] text-[#3d4a42] hidden sm:block">
                Instituto Federal do Espírito Santo — Sistema de Certificados e Registros
              </span>
            </div>
          </div>

          {/* Top Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onOpenHelp}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#3d4a42] hover:bg-[#f2f3ff] hover:text-[#131b2e] transition-colors cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">menu_book</span>
              <span className="hidden sm:inline">Guia de Cabeçalhos</span>
            </button>

            <button
              onClick={downloadSampleOdsSpreadsheet}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#3d4a42] hover:bg-[#f2f3ff] hover:text-[#131b2e] transition-colors cursor-pointer"
              type="button"
              title="Baixar planilha modelo .ODS vazia ou preenchida para testes"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span className="hidden md:inline">Baixar Modelo .ODS</span>
            </button>

            {recordCount > 0 && (
              <button
                onClick={onClearAll}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#ba1a1a] hover:bg-[#ffdad6] hover:text-[#93000a] transition-colors cursor-pointer"
                type="button"
                title="Limpar todos os dados carregados"
              >
                <span className="material-symbols-outlined text-[16px]">delete_sweep</span>
                <span>Limpar Tudo</span>
              </button>
            )}

            <div className="h-5 w-px bg-[#bccac0]/40 hidden sm:block"></div>

            <a
              href="https://src.ifes.edu.br"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1 text-xs text-[#006591] hover:text-[#004c6e] font-medium transition-colors"
            >
              <span className="material-symbols-outlined text-[15px]">open_in_new</span>
              <span>Portal SRC</span>
            </a>
          </div>
        </div>

        {/* Step Tabs Navigation */}
        <nav className="flex items-center gap-4 sm:gap-8 w-full border-t border-[#bccac0]/20 -mb-px overflow-x-auto text-xs sm:text-sm">
          <button
            onClick={() => onNavigateStep('importacao')}
            className={`py-2.5 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              currentStep === 'importacao'
                ? 'text-[#006948] border-b-2 border-[#006948] font-bold'
                : 'text-[#3d4a42] hover:text-[#131b2e] font-medium'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">upload_file</span>
            <span>1. Importar Planilha</span>
          </button>

          <button
            onClick={() => onNavigateStep('verificacao')}
            className={`py-2.5 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              currentStep === 'verificacao'
                ? 'text-[#006948] border-b-2 border-[#006948] font-bold'
                : 'text-[#3d4a42] hover:text-[#131b2e] font-medium'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">fact_check</span>
            <span>2. Verificar & Editar</span>
            {recordCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-[#eaedff] text-[#006948] font-bold">
                {recordCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onNavigateStep('exportacao')}
            className={`py-2.5 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              currentStep === 'exportacao'
                ? 'text-[#006948] border-b-2 border-[#006948] font-bold'
                : 'text-[#3d4a42] hover:text-[#131b2e] font-medium'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">file_download</span>
            <span>3. Exportar SRC</span>
          </button>

          <button
            onClick={() => onNavigateStep('tutorial_src')}
            className={`py-2.5 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              currentStep === 'tutorial_src'
                ? 'text-[#006948] border-b-2 border-[#006948] font-bold'
                : 'text-[#3d4a42] hover:text-[#131b2e] font-medium'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">menu_book</span>
            <span>4. Guia Passo a Passo SRC</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] uppercase font-bold bg-[#85f8c4] text-[#002114]">
              Ilustrado
            </span>
          </button>
        </nav>
      </div>
    </header>
  );
};
