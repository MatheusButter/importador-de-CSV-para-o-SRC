import React, { useState } from 'react';
import { ExportSettings, StandardRecord } from '../types';
import { generateCsvString, downloadFile } from '../utils/csvConverter';

interface ExportStepProps {
  records: StandardRecord[];
  settings: ExportSettings;
  onUpdateSettings: (newSettings: Partial<ExportSettings>) => void;
  onPrevStep: () => void;
  onGoToTutorial: () => void;
  onNewConversion: () => void;
}

export const ExportStep: React.FC<ExportStepProps> = ({
  records,
  settings,
  onUpdateSettings,
  onPrevStep,
  onGoToTutorial,
  onNewConversion,
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const [downloadSuccessToast, setDownloadSuccessToast] = useState(false);

  const rawCsvContent = React.useMemo(() => {
    return generateCsvString(records, settings);
  }, [records, settings]);

  const previewSnippet = React.useMemo(() => {
    return generateCsvString(records.slice(0, 5), settings);
  }, [records, settings]);

  const handleDownload = () => {
    let finalFilename = settings.filename.trim() || 'dados_convertidos_sistema.csv';
    if (!finalFilename.endsWith('.csv')) {
      finalFilename += '.csv';
    }
    const mimeType = 'text/csv;charset=utf-8;';
    downloadFile(rawCsvContent, finalFilename, mimeType);

    setDownloadSuccessToast(true);
    setTimeout(() => setDownloadSuccessToast(false), 4000);
  };

  const estimatedSizeKb = (new Blob([rawCsvContent]).size / 1024).toFixed(2);

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto space-y-6">
      {/* Stepper Status Bar */}
      <div className="bg-white p-4 rounded-xl shadow-xs border border-[#bccac0]/25 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#00855d] text-white flex items-center justify-center shadow-xs">
            <span className="material-symbols-outlined text-[18px]">done_all</span>
          </div>
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#6d7a72] block">Status do Fluxo SRC</span>
            <span className="text-sm font-bold text-[#131b2e]">Etapa Final de Validação e Saída</span>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto text-xs font-mono">
          <button
            onClick={onPrevStep}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f2f3ff] text-[#006948] font-semibold hover:bg-[#eaedff] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px]">check_circle</span>
            <span>2. Verificar</span>
          </button>
          <span className="material-symbols-outlined text-[#bccac0] text-[16px]">chevron_right</span>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#006948] text-white font-semibold shadow-xs">
            <span className="material-symbols-outlined text-[15px]">verified</span>
            <span>3. Exportar SRC</span>
            <span className="px-1.5 py-0.2 bg-[#85f8c4] text-[#002114] text-[10px] rounded uppercase font-bold">
              Ativo
            </span>
          </div>
        </div>
      </div>

      {/* Main Download Card */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#85f8c4] text-[#002114] font-mono text-[11px] mb-3 font-semibold">
          <span className="material-symbols-outlined text-[16px]">check_circle</span>
          <span>Etapa 3 de 3 • Conversão Concluída</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#131b2e] tracking-tight mb-2">
          Download do Arquivo Formatado
        </h1>
        <p className="text-sm text-[#3d4a42] max-w-xl mx-auto">
          Sua planilha foi processada e padronizada nos moldes exigidos pelo Sistema de Registro de Certificados (SRC/Ifes).
        </p>
      </div>

      <div className="bg-white p-6 sm:p-10 rounded-xl shadow-md border border-[#bccac0]/25 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-[#85f8c4] text-[#006948] flex items-center justify-center mb-4 shadow-sm">
          <span className="material-symbols-outlined text-[36px]">file_download_done</span>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#f2f3ff] rounded-lg text-[#006948] font-mono text-xs font-semibold mb-2">
          <span className="material-symbols-outlined text-[18px]">verified</span>
          <span>{records.length} discentes / participantes validados</span>
        </div>

        <h2 className="text-xl font-bold text-[#131b2e] mb-1">Pronto para Importação</h2>
        <p className="text-xs text-[#6d7a72] mb-6 font-mono">
          Codificação UTF-8 • Separador Tabular (\t) • Sem inconsistências
        </p>

        {/* Filename Input */}
        <div className="w-full max-w-lg mb-6 bg-[#f2f3ff] p-4 rounded-xl text-left border border-[#bccac0]/20">
          <label className="block font-mono text-[10px] font-semibold text-[#6d7a72] uppercase tracking-wider mb-1.5">
            Nome do arquivo para download
          </label>
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-[#bccac0]/30 focus-within:ring-2 focus-within:ring-[#006948]/20">
            <span className="material-symbols-outlined text-[#6d7a72] text-[18px]">draft</span>
            <input
              type="text"
              value={settings.filename}
              onChange={(e) => onUpdateSettings({ filename: e.target.value })}
              placeholder="dados_convertidos_sistema.csv"
              className="w-full bg-transparent font-mono text-xs text-[#131b2e] focus:outline-none"
            />
          </div>
          <div className="flex items-center justify-between mt-2 font-mono text-[11px] text-[#6d7a72]">
            <span>Tamanho: ~{estimatedSizeKb} KB</span>
            <span>Formato: CSV (RFC 4180)</span>
          </div>
        </div>

        {/* Primary Download Button */}
        <div className="w-full max-w-lg flex flex-col gap-3 mb-2">
          <button
            onClick={handleDownload}
            type="button"
            className="w-full flex items-center justify-center gap-3 bg-[#006948] hover:bg-[#00855d] text-white py-3.5 px-6 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[22px]">download</span>
            <span>Baixar Arquivo CSV Formatado (.csv)</span>
          </button>

          <div className="flex items-center justify-center gap-4 mt-1">
            <button
              onClick={() => setShowPreview(!showPreview)}
              type="button"
              className="inline-flex items-center gap-1.5 text-[#3d4a42] hover:text-[#131b2e] font-mono text-xs py-1.5 px-3 rounded-lg hover:bg-[#f2f3ff] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">code</span>
              <span>{showPreview ? 'Ocultar Código CSV' : 'Inspecionar Código CSV'}</span>
              <span className={`material-symbols-outlined text-[15px] transition-transform duration-200 ${showPreview ? 'rotate-180' : ''}`}>
                expand_more
              </span>
            </button>
          </div>
        </div>

        {/* Preview Panel Toggle */}
        {showPreview && (
          <div className="w-full max-w-lg mt-3 bg-[#283044] text-[#eef0ff] p-4 rounded-xl font-mono text-[11px] text-left overflow-x-auto shadow-inner border border-[#6d7a72]/30">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#6d7a72]/20">
              <span className="text-[#68dba9] font-semibold">Prévia (5 de {records.length} linhas)</span>
              <span className="text-[#bccac0] text-[10px]">UTF-8 / CRLF</span>
            </div>
            <pre className="leading-relaxed select-all whitespace-pre overflow-x-auto">
              {previewSnippet}
            </pre>
          </div>
        )}

        {/* Feedback toast */}
        {downloadSuccessToast && (
          <div className="w-full max-w-lg mt-3 p-3 rounded-lg bg-[#85f8c4]/30 text-[#002114] text-xs font-semibold flex items-center justify-center gap-2 border border-[#006948]/30 animate-in fade-in">
            <span className="material-symbols-outlined text-[18px] text-[#006948]">check_circle</span>
            <span>Download de "{settings.filename}" concluído com sucesso!</span>
          </div>
        )}
      </div>

      {/* Direct Banner to Step 4 Tutorial */}
      <div className="bg-gradient-to-r from-[#006591]/10 via-white to-[#006948]/10 rounded-xl p-5 border border-[#006591]/30 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#006591] text-white flex items-center justify-center shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-[26px]">menu_book</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#131b2e]">E agora? Como subir o arquivo no SRC?</h3>
              <span className="bg-[#85f8c4] text-[#002114] text-[10px] font-bold font-mono px-2 py-0.5 rounded uppercase">
                Guia Ilustrado
              </span>
            </div>
            <p className="text-xs text-[#3d4a42] mt-0.5">
              Consulte nosso passo a passo com os 6 prints reais da tela do SRC para carregar seus discentes em 2 minutos.
            </p>
          </div>
        </div>

        <button
          onClick={onGoToTutorial}
          type="button"
          className="px-5 py-2.5 bg-[#006591] hover:bg-[#004c6e] text-white rounded-lg font-bold text-xs shadow-xs hover:shadow transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <span>Abrir Guia Passo a Passo</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </div>

      {/* Bottom Nav actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium">
        <button
          onClick={onPrevStep}
          type="button"
          className="flex items-center gap-2 text-[#3d4a42] hover:text-[#131b2e] py-2 px-3 rounded-lg hover:bg-white transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Voltar para Verificação (Passo 2)</span>
        </button>

        <button
          onClick={onNewConversion}
          type="button"
          className="flex items-center gap-2 text-[#3d4a42] hover:text-[#131b2e] py-2 px-3 rounded-lg hover:bg-white transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">restart_alt</span>
          <span>Iniciar Nova Conversão</span>
        </button>
      </div>
    </div>
  );
};
