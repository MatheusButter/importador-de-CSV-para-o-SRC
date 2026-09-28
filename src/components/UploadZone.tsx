import React, { useRef, useState } from 'react';
import { UploadCloud, FileSpreadsheet, Sparkles, Download, CheckCircle2, AlertTriangle, Trash2 } from 'lucide-react';
import { FileMetadata } from '../types';
import { downloadSampleOdsSpreadsheet } from '../utils/csvConverter';

interface UploadZoneProps {
  onFileSelected: (file: File) => void;
  onLoadSample: () => void;
  onClearAll: () => void;
  onStartBuildingTable: () => void;
  isLoading: boolean;
  metadata: FileMetadata | null;
  errorMessage: string | null;
}

export const UploadZone: React.FC<UploadZoneProps> = ({
  onFileSelected,
  onLoadSample,
  onClearAll,
  onStartBuildingTable,
  isLoading,
  metadata,
  errorMessage,
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
      const file = e.dataTransfer.files[0];
      onFileSelected(file);
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
    <div className="space-y-3">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragOver
            ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20'
            : metadata
            ? 'border-emerald-300 bg-emerald-50/20 hover:bg-emerald-50/30'
            : 'border-neutral-300 bg-white hover:border-neutral-400 hover:bg-neutral-50/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".ods,.xlsx,.xls,.csv"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center max-w-lg mx-auto">
          {isLoading ? (
            <div className="py-4">
              <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm font-medium text-neutral-700">Lendo e mapeando planilha .ODS...</p>
              <p className="text-xs text-neutral-400 mt-1">Padronizando CPFs e datas</p>
            </div>
          ) : metadata ? (
            <div className="w-full">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-neutral-900 truncate">
                {metadata.filename}
              </h3>
              <div className="flex items-center justify-center gap-2 text-xs text-neutral-500 mt-1 font-mono tabular-nums">
                <span>{metadata.totalRows} registros</span>
                <span>·</span>
                <span>Aba: "{metadata.sheetName}"</span>
                <span>·</span>
                <span>{formatFileSize(metadata.fileSize)}</span>
              </div>
              <p className="text-xs text-emerald-600 font-medium mt-2">
                Clique ou arraste outro arquivo para substituir
              </p>
              <div className="mt-3 flex items-center justify-center">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClearAll();
                  }}
                  className="px-3 py-1 bg-white hover:bg-red-50 text-red-600 hover:text-red-700 border border-red-200 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Limpar esta planilha e dados</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-neutral-100 text-neutral-600 flex items-center justify-center mb-3">
                <UploadCloud className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-neutral-900">
                Arraste sua planilha <span className="text-emerald-700">.ODS</span> aqui, ou clique para selecionar
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                Suporta planilhas OpenDocument (<strong className="font-semibold text-neutral-700">.ods</strong> do LibreOffice / Calc), Excel (.xlsx, .xls) e CSV.
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-neutral-500">
                <span className="px-2 py-0.5 bg-neutral-100 rounded text-neutral-600 font-mono text-[11px]">.ODS</span>
                <span className="px-2 py-0.5 bg-neutral-100 rounded text-neutral-600 font-mono text-[11px]">.XLSX</span>
                <span className="px-2 py-0.5 bg-neutral-100 rounded text-neutral-600 font-mono text-[11px]">.CSV</span>
              </div>
            </>
          )}
        </div>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Auxiliary actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1 text-xs text-neutral-500">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onStartBuildingTable}
            type="button"
            className="text-emerald-700 hover:text-emerald-800 font-semibold inline-flex items-center gap-1.5 cursor-pointer bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-md transition-colors"
          >
            <span>+ Construir tabela do zero no app</span>
          </button>

          <button
            onClick={onLoadSample}
            type="button"
            className="text-neutral-600 hover:text-neutral-800 font-medium underline inline-flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-amber-500" />
            Carregar dados de exemplo (38 linhas)
          </button>
        </div>

        <button
          onClick={downloadSampleOdsSpreadsheet}
          type="button"
          className="text-neutral-600 hover:text-neutral-900 flex items-center gap-1.5 cursor-pointer hover:underline"
        >
          <Download className="w-3 h-3 text-neutral-400" />
          <span>Baixar planilha modelo .ODS vazia</span>
        </button>
      </div>
    </div>
  );
};
