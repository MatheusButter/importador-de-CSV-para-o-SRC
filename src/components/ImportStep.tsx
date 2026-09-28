import React, { useRef, useState } from 'react';
import { FileMetadata } from '../types';
import { downloadSampleOdsSpreadsheet } from '../utils/csvConverter';

interface ImportStepProps {
  onFileSelected: (file: File) => void;
  onClearAll: () => void;
  onStartBuildingTable: () => void;
  onNextStep: () => void;
  isLoading: boolean;
  metadata: FileMetadata | null;
  errorMessage: string | null;
  recordCount: number;
}

export const ImportStep: React.FC<ImportStepProps> = ({
  onFileSelected,
  onClearAll,
  onStartBuildingTable,
  onNextStep,
  isLoading,
  metadata,
  errorMessage,
  recordCount,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelected(e.target.files[0]);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="flex flex-col w-full max-w-[960px] mx-auto space-y-6">
      {/* Title & Engine status */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-[#006948] font-mono text-[11px] uppercase tracking-wider mb-1 font-semibold">
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            <span>Etapa 01 de 03 • Preparação de Ingestão</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#131b2e] tracking-tight">
            Importação de Arquivo de Planilha
          </h1>
          <p className="text-sm text-[#3d4a42] mt-1">
            Envie ou substitua a planilha de dados (<span className="font-mono text-[#006948] font-semibold">.ods</span>, <span className="font-mono text-[#131b2e]">.xlsx</span> ou <span className="font-mono text-[#131b2e]">.xls</span>) gerada para os certificados e registros acadêmicos do Ifes.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#eaedff] px-3.5 py-1.5 rounded-xl shadow-xs self-start md:self-auto shrink-0 border border-[#bccac0]/25">
          <div className="w-2.5 h-2.5 rounded-full bg-[#006948] animate-pulse"></div>
          <span className="text-xs text-[#3d4a42] font-medium font-mono">
            Motor de Análise: <strong className="text-[#131b2e]">RFC 4180 / LibreOffice V9</strong>
          </span>
        </div>
      </div>

      {/* Main Upload Box */}
      <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-md border border-[#bccac0]/30 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#006948]/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-[#006948]/5 rounded-full blur-3xl pointer-events-none"></div>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 group ${
            isDragOver
              ? 'border-[#006948] bg-[#f2f3ff]'
              : metadata
              ? 'border-[#00855d] bg-[#f5fff7]'
              : 'border-[#006948]/40 hover:border-[#006948] bg-[#f2f3ff]/60 hover:bg-[#f2f3ff]'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".ods,.xlsx,.xls,.csv"
            onChange={handleFileChange}
            className="hidden"
          />

          {isLoading ? (
            <div className="py-6 flex flex-col items-center">
              <div className="w-12 h-12 border-3 border-[#006948] border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-sm font-semibold text-[#131b2e]">Analisando estrutura de colunas...</p>
              <p className="text-xs text-[#3d4a42] mt-1 font-mono">Higienizando CPFs e datas</p>
            </div>
          ) : metadata ? (
            <div className="w-full flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-[#85f8c4] text-[#002114] flex items-center justify-center mb-3 shadow-sm">
                <span className="material-symbols-outlined text-[36px]">verified</span>
              </div>
              <h2 className="text-lg font-bold text-[#131b2e] truncate max-w-md">
                {metadata.filename}
              </h2>
              <div className="flex items-center gap-2 text-xs text-[#3d4a42] mt-1 font-mono">
                <span>{recordCount} registros</span>
                <span>•</span>
                <span>Aba: "{metadata.sheetName}"</span>
                <span>•</span>
                <span>{formatFileSize(metadata.fileSize)}</span>
              </div>
              <p className="text-xs text-[#006948] font-semibold mt-2">
                Planilha lida com sucesso! Clique ou arraste outro arquivo para substituir
              </p>
              <div className="mt-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClearAll();
                  }}
                  className="px-3 py-1.5 bg-white text-[#ba1a1a] hover:bg-[#ffdad6] border border-[#ffdad6] rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                  <span>Limpar esta planilha</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="w-20 h-20 rounded-2xl bg-[#00855d] text-[#f5fff7] flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[42px]">cloud_upload</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#131b2e] mb-1">
                Arraste e solte sua planilha aqui ou clique para selecionar
              </h2>
              <p className="text-sm text-[#3d4a42] max-w-[560px] mb-6">
                Envie os arquivos acadêmicos oficiais para processamento e conferência automática de bolsistas ou participantes.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#006948] hover:bg-[#00855d] text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">folder_open</span>
                  <span>Selecionar Arquivo do Computador</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onStartBuildingTable();
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white hover:bg-[#85f8c4]/30 border-2 border-[#006948] text-[#006948] font-semibold text-sm shadow-xs hover:shadow-sm transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">edit_document</span>
                  <span>Criar Planilha no Sistema</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-[#3d4a42]">
                <span className="font-semibold text-[#6d7a72] uppercase tracking-wider text-[10px] mr-1">
                  Formatos Suportados:
                </span>
                <span className="bg-white px-2.5 py-1 rounded-lg border border-[#bccac0]/30 text-[#006948] font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">verified</span> .ODS (LibreOffice)
                </span>
                <span className="bg-white px-2.5 py-1 rounded-lg border border-[#bccac0]/30 text-[#131b2e] flex items-center gap-1 font-mono">
                  <span className="material-symbols-outlined text-[14px]">description</span> .XLSX / .XLS
                </span>
                <span className="bg-white px-2.5 py-1 rounded-lg border border-[#bccac0]/30 text-[#3d4a42] font-mono">
                  Até 25 MB
                </span>
              </div>
            </>
          )}
        </div>

        {/* Quick action bar */}
        <div className="mt-6 pt-4 border-t border-[#bccac0]/20 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={onStartBuildingTable}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#85f8c4]/60 hover:bg-[#85f8c4] text-[#002114] font-semibold text-xs shadow-xs transition-all border border-[#006948]/30 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] text-[#006948]">add_box</span>
            <span>Criar Planilha do Zero no Sistema</span>
            <span className="bg-white text-[#006948] text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded border border-[#006948]/30">
              Novo
            </span>
          </button>

          <button
            type="button"
            onClick={downloadSampleOdsSpreadsheet}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] font-semibold text-xs shadow-xs transition-colors border border-[#bccac0]/25 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] text-[#006948]">file_download</span>
            <span>Baixar modelo (.ods)</span>
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2 p-3 bg-[#ffdad6] border border-[#ba1a1a]/30 text-[#93000a] rounded-lg text-xs">
          <span className="material-symbols-outlined text-[18px]">warning</span>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Banner de preenchimento interativo */}
      <div className="bg-gradient-to-r from-[#85f8c4]/30 to-[#f2f3ff] rounded-xl p-4 sm:p-5 border border-[#006948]/30 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#006948] text-white flex items-center justify-center shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-[20px]">table_chart</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#131b2e]">Prefere preencher direto no navegador?</h3>
            <p className="text-xs text-[#3d4a42]">
              Crie ou insira dados de discentes e participantes em nossa planilha interativa sem precisar subir nenhum arquivo prévio.
            </p>
          </div>
        </div>

        <button
          onClick={onStartBuildingTable}
          type="button"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#006948] hover:bg-[#00855d] text-white font-semibold text-xs shadow-xs transition-all shrink-0 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">edit_square</span>
          <span>Abrir Editor de Planilha</span>
        </button>
      </div>

      {/* 3 Value propositions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-[#bccac0]/25 shadow-xs flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#85f8c4] text-[#002114] flex items-center justify-center shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-[20px]">verified</span>
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#131b2e]">Formato Recomendado</h4>
            <p className="text-xs text-[#3d4a42] mt-0.5 leading-relaxed">
              Padrão aberto ODF .ODS otimizado para LibreOffice Calc oficial dos campi Ifes.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#bccac0]/25 shadow-xs flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#c9e6ff] text-[#001e2f] flex items-center justify-center shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-[20px]">security</span>
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#131b2e]">UTF-8 Automático</h4>
            <p className="text-xs text-[#3d4a42] mt-0.5 leading-relaxed">
              Detecção e sanitização sem perda de acentuação gráfica nem corrupção de CPFs.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#bccac0]/25 shadow-xs flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#eaedff] text-[#006948] flex items-center justify-center shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-[20px]">table_rows</span>
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#131b2e]">Mapeamento Inteligente</h4>
            <p className="text-xs text-[#3d4a42] mt-0.5 leading-relaxed">
              Associação automática das 7 colunas obrigatórias do Sistema de Registro Acadêmico.
            </p>
          </div>
        </div>
      </div>

      {/* Forward Action Footer */}
      <div className="bg-white rounded-xl p-5 shadow-xs border border-[#bccac0]/25 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#eaedff] text-[#3d4a42] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]">info</span>
          </div>
          <p className="text-xs text-[#3d4a42]">
            {recordCount > 0
              ? `Você tem ${recordCount} registros prontos para conferência na Etapa 2.`
              : 'Após selecionar o arquivo ou criar a planilha, avance para validar os dados dos discentes.'}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-end">
          <button
            onClick={onNextStep}
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#006948] hover:bg-[#00855d] text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow cursor-pointer"
            type="button"
          >
            <span>Avançar para Verificação e Edição</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
