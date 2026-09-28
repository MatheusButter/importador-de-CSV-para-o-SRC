import React, { useState } from 'react';
import { Header, StepType } from './components/Header';
import { ImportStep } from './components/ImportStep';
import { VerificationStep } from './components/VerificationStep';
import { ExportStep } from './components/ExportStep';
import { SrcTutorialStep } from './components/SrcTutorialStep';
import { HelpModal } from './components/HelpModal';
import { CreateRecordModal } from './components/CreateRecordModal';
import {
  StandardRecord,
  ColumnMapping,
  FileMetadata,
  ExportSettings,
  TargetFieldKey,
} from './types';
import { SAMPLE_INPUT_RECORDS } from './utils/sampleData';
import { parseSpreadsheetFile, downloadFile, generateCsvString } from './utils/csvConverter';

export default function App() {
  const [currentStep, setCurrentStep] = useState<StepType>('importacao');

  // Empty initial state
  const [records, setRecords] = useState<StandardRecord[]>([]);
  const [metadata, setMetadata] = useState<FileMetadata | null>(null);
  const [sourceHeaders, setSourceHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<ColumnMapping>({});

  const [exportSettings, setExportSettings] = useState<ExportSettings>({
    delimiter: 'tab',
    quoteStyle: 'all',
    lineEnding: 'crlf',
    cleanCpf: true,
    standardizeDates: true,
    filename: 'dados_convertidos_sistema.csv',
    addBom: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // File Upload Handler
  const handleFileSelected = async (file: File) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await parseSpreadsheetFile(file);
      setMetadata(result.metadata);
      setSourceHeaders(result.headers);
      setMapping(result.mapping);
      setRecords(result.records);
      // Auto advance to verification when file is parsed
      setCurrentStep('verificacao');
    } catch (err: any) {
      console.error('Erro ao ler planilha:', err);
      setErrorMessage(
        err.message || 'Falha ao processar a planilha. Verifique se o arquivo .ods ou .xlsx é válido.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Reset/Load Sample Data
  const handleLoadSample = () => {
    setRecords(SAMPLE_INPUT_RECORDS);
    setMetadata({
      filename: 'exemplo_participantes.ods',
      sheetName: 'Planilha1',
      availableSheets: ['Planilha1'],
      totalRows: SAMPLE_INPUT_RECORDS.length,
      totalColumns: 7,
      fileSize: 42100,
    });
    setSourceHeaders([
      'Nome Completo',
      'Data de Nascimento',
      'CPF',
      'Email',
      'Carga Horária',
      'Data Início',
      'Data Fim',
    ]);
    setMapping({
      'Nome Completo': 'nome',
      'Data de Nascimento': 'nascimento',
      'CPF': 'cpf',
      'Email': 'email',
      'Carga Horária': 'cargaHoraria',
      'Data Início': 'inicio',
      'Data Fim': 'fim',
    });
    setErrorMessage(null);
    setCurrentStep('verificacao');
  };

  // Clear all loaded data and state
  const handleClearAll = () => {
    setRecords([]);
    setMetadata(null);
    setSourceHeaders([]);
    setMapping({});
    setErrorMessage(null);
    setCurrentStep('importacao');
  };

  // Update Mapping
  const handleUpdateMapping = (sourceHeader: string, targetKey: TargetFieldKey | 'ignore') => {
    const newMapping = { ...mapping, [sourceHeader]: targetKey };
    setMapping(newMapping);

    setRecords((prev) =>
      prev.map((rec) => {
        const updated = { ...rec };
        if (targetKey !== 'ignore' && rec._original && rec._original[sourceHeader] !== undefined) {
          const val = rec._original[sourceHeader];
          if (targetKey === 'nome') updated.nome = String(val ?? '').trim();
          if (targetKey === 'nascimento') updated.nascimento = String(val ?? '').trim();
          if (targetKey === 'cpf') updated.cpf = String(val ?? '').replace(/\D/g, '');
          if (targetKey === 'email') updated.email = String(val ?? '').trim();
          if (targetKey === 'cargaHoraria') updated.cargaHoraria = String(val ?? '').trim();
          if (targetKey === 'inicio') updated.inicio = String(val ?? '').trim();
          if (targetKey === 'fim') updated.fim = String(val ?? '').trim();
        }
        return updated;
      })
    );
  };

  // Update Record cell
  const handleUpdateRecord = (id: string, updatedFields: Partial<StandardRecord>) => {
    setRecords((prev) =>
      prev.map((rec) => (rec._id === id ? { ...rec, ...updatedFields } : rec))
    );
  };

  // Delete Record
  const handleDeleteRecord = (id: string) => {
    setRecords((prev) => prev.filter((rec) => rec._id !== id));
  };

  // Start building table from scratch: navigate to Step 2 with canonical headers ready
  const handleStartBuildingTable = () => {
    if (sourceHeaders.length === 0) {
      setSourceHeaders([
        'Nome',
        'Nascimento',
        'CPF',
        'Email',
        'Carga horária',
        'Início',
        'Fim',
      ]);
      setMapping({
        'Nome': 'nome',
        'Nascimento': 'nascimento',
        'CPF': 'cpf',
        'Email': 'email',
        'Carga horária': 'cargaHoraria',
        'Início': 'inicio',
        'Fim': 'fim',
      });
    }
    // Navigate straight to Step 2 so user builds and edits their table there
    setCurrentStep('verificacao');
  };

  // Add Record modal
  const handleOpenAddRecord = () => {
    setIsCreateModalOpen(true);
  };

  const handleAddNewRecord = (newRec: StandardRecord) => {
    setRecords((prev) => [newRec, ...prev]);
    setCurrentStep('verificacao');
  };

  // Direct download handler for step 4
  const handleDirectDownload = () => {
    const csvContent = generateCsvString(records, exportSettings);
    let finalFilename = exportSettings.filename.trim() || 'dados_convertidos_sistema.csv';
    if (!finalFilename.endsWith('.csv')) {
      finalFilename += '.csv';
    }
    downloadFile(csvContent, finalFilename, 'text/csv;charset=utf-8;');
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e] flex flex-col font-sans">
      {/* Top Header with 4-step tabs */}
      <Header
        currentStep={currentStep}
        onNavigateStep={setCurrentStep}
        onClearAll={handleClearAll}
        onOpenHelp={() => setIsHelpOpen(true)}
        recordCount={records.length}
      />

      {/* Main Container separated by Steps */}
      <main className="flex-1 w-full pt-28 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1280px] mx-auto">
          {currentStep === 'importacao' && (
            <ImportStep
              onFileSelected={handleFileSelected}
              onClearAll={handleClearAll}
              onStartBuildingTable={handleStartBuildingTable}
              onNextStep={() => setCurrentStep('verificacao')}
              isLoading={isLoading}
              metadata={metadata}
              errorMessage={errorMessage}
              recordCount={records.length}
            />
          )}

          {currentStep === 'verificacao' && (
            <VerificationStep
              records={records}
              sourceHeaders={sourceHeaders}
              mapping={mapping}
              onUpdateMapping={handleUpdateMapping}
              onUpdateRecord={handleUpdateRecord}
              onDeleteRecord={handleDeleteRecord}
              onAddRecord={handleOpenAddRecord}
              onClearAll={handleClearAll}
              onPrevStep={() => setCurrentStep('importacao')}
              onNextStep={() => setCurrentStep('exportacao')}
            />
          )}

          {currentStep === 'exportacao' && (
            <ExportStep
              records={records}
              settings={exportSettings}
              onUpdateSettings={(newSettings) =>
                setExportSettings((prev) => ({ ...prev, ...newSettings }))
              }
              onPrevStep={() => setCurrentStep('verificacao')}
              onGoToTutorial={() => setCurrentStep('tutorial_src')}
              onNewConversion={handleClearAll}
            />
          )}

          {currentStep === 'tutorial_src' && (
            <SrcTutorialStep
              onBackToExport={() => setCurrentStep('exportacao')}
              onRedownload={handleDirectDownload}
              filename={exportSettings.filename}
            />
          )}
        </div>
      </main>

      {/* Footer Institucional */}
      <footer className="w-full bg-white border-t border-[#bccac0]/25 py-6 text-xs text-[#3d4a42]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3">
          <div>
            <p className="font-semibold text-[#131b2e]">Instituto Federal do Espírito Santo — Ifes</p>
            <p className="text-[#6d7a72] font-mono text-[11px] mt-0.5">
              Sistema de Registro e Conversão de Dados Acadêmicos (SRC)
            </p>
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px] text-[#6d7a72]">
            <span className="flex items-center gap-1 text-[#006948] font-semibold">
              <span className="material-symbols-outlined text-[15px]">verified</span>
              Padronização RFC 4180 (UTF-8)
            </span>
            <span>•</span>
            <span>Compatível com LibreOffice Calc e MS Excel</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CreateRecordModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onAdd={handleAddNewRecord}
      />

      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
}
