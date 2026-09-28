import React, { useState } from 'react';
import { X, Copy, Check, Download } from 'lucide-react';
import { StandardRecord, ExportSettings } from '../types';
import { generateCsvString, downloadFile } from '../utils/csvConverter';

interface RawPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: StandardRecord[];
  settings: ExportSettings;
}

export const RawPreviewModal: React.FC<RawPreviewModalProps> = ({
  isOpen,
  onClose,
  records,
  settings,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const rawCsv = generateCsvString(records, settings);
  const lines = rawCsv.split(settings.lineEnding === 'crlf' ? '\r\n' : '\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(rawCsv);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    downloadFile(rawCsv, settings.filename || 'dados_convertidos.csv');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900">
              Arquivo CSV Formatado para o Sistema de Destino
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5 font-mono tabular-nums">
              {lines.length} linhas · {rawCsv.length} caracteres · Delimitador:{' '}
              {settings.delimiter === 'tab'
                ? 'Tabulação (\\t)'
                : settings.delimiter === 'semicolon'
                ? 'Ponto e vírgula (;)'
                : 'Vírgula (,)'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 text-xs font-medium text-neutral-700 bg-white border border-neutral-300 hover:bg-neutral-50 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Copiar Tudo</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="px-3 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar CSV</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors ml-2 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content - Code Inspector */}
        <div className="flex-1 overflow-auto bg-neutral-950 text-neutral-100 font-mono text-xs p-4 selection:bg-emerald-900 selection:text-white">
          <table className="w-full border-collapse">
            <tbody>
              {lines.map((line, idx) => (
                <tr
                  key={idx}
                  className={`hover:bg-neutral-900/80 ${
                    idx === 0 ? 'bg-neutral-900 text-emerald-400 font-semibold' : ''
                  }`}
                >
                  <td className="py-0.5 pr-4 pl-2 text-right select-none text-neutral-600 w-12 tabular-nums">
                    {idx + 1}
                  </td>
                  <td className="py-0.5 whitespace-pre leading-relaxed break-all">
                    {line}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between text-xs text-neutral-600">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Primeira linha:</span>
            <code className="bg-neutral-200 px-1.5 py-0.5 rounded text-[11px] text-neutral-800">
              "Nome"	"Nascimento"	"CPF"	"Email"	"Carga horária"	"Início"	"Fim"
            </code>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-100 cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
