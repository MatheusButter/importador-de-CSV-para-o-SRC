import React from 'react';
import { ExportSettings, StandardRecord } from '../types';
import { Download, Eye, AlertCircle } from 'lucide-react';
import { generateCsvString, downloadFile, isValidCpf } from '../utils/csvConverter';

interface ExportPanelProps {
  records: StandardRecord[];
  settings: ExportSettings;
  onUpdateSettings: (newSettings: Partial<ExportSettings>) => void;
  onOpenRawPreview: () => void;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({
  records,
  settings,
  onUpdateSettings,
  onOpenRawPreview,
}) => {
  // Check how many invalid CPFs exist before export
  const invalidCpfCount = records.filter((r) => r.cpf && !isValidCpf(r.cpf)).length;
  const missingCpfCount = records.filter((r) => !r.cpf || r.cpf.trim() === '').length;

  const handleDownload = () => {
    const csvContent = generateCsvString(records, settings);
    let finalFilename = settings.filename.trim() || 'dados_convertidos.csv';
    if (!finalFilename.endsWith('.csv')) {
      finalFilename += '.csv';
    }
    const mimeType = 'text/csv;charset=utf-8;';
    downloadFile(csvContent, finalFilename, mimeType);
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-4">
      {/* Header and status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-150">
        <div>
          <h3 className="text-sm font-semibold text-neutral-900 flex items-center gap-2">
            <span>Baixar Arquivo Formatado</span>
            <span className="text-[11px] font-normal text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Padrão exato com cabeçalhos exigidos
            </span>
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Arquivo pronto para upload com delimitador por tabulação e aspas duplas em todos os campos.
          </p>
        </div>

        <button
          onClick={onOpenRawPreview}
          className="self-start sm:self-center px-3 py-1.5 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Inspecionar Código CSV</span>
        </button>
      </div>

      {/* Warnings if any CPFs are bad */}
      {(invalidCpfCount > 0 || missingCpfCount > 0) && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-semibold">Atenção aos dados antes de exportar:</span>
            <p className="text-amber-800">
              {invalidCpfCount > 0 && `${invalidCpfCount} linha(s) com CPF inválido. `}
              {missingCpfCount > 0 && `${missingCpfCount} linha(s) sem CPF. `}
              As linhas problemáticas estão destacadas em amarelo na tabela para você corrigir diretamente.
            </p>
          </div>
        </div>
      )}

      {/* Simplified download panel - only filename selection and Download button */}
      <div className="flex flex-col md:flex-row items-stretch md:items-end justify-between gap-4 pt-1">
        {/* Filename Input */}
        <div className="flex-1 max-w-lg space-y-1.5">
          <label className="text-xs font-semibold text-neutral-800 block">
            Nome do arquivo de saída (.csv):
          </label>
          <div className="relative">
            <input
              type="text"
              value={settings.filename}
              onChange={(e) => onUpdateSettings({ filename: e.target.value })}
              placeholder="dados_convertidos_sistema.csv"
              className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs font-mono text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <p className="text-[11px] text-neutral-500">
            Formatação: <code className="font-mono bg-neutral-100 px-1 py-0.5 rounded text-neutral-700">"Nome"	"Nascimento"	"CPF"	"Email"	"Carga horária"	"Início"	"Fim"</code>
          </p>
        </div>

        {/* Action Button: only Download CSV */}
        <div className="flex items-center">
          <button
            onClick={handleDownload}
            className="w-full md:w-auto px-6 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow"
          >
            <Download className="w-4 h-4" />
            <span>Baixar Arquivo .CSV</span>
          </button>
        </div>
      </div>
    </div>
  );
};
