import React from 'react';
import { X, CheckCircle2, AlertCircle, FileSpreadsheet, HelpCircle } from 'lucide-react';
import { TARGET_COLUMNS } from '../types';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl my-8 flex flex-col overflow-hidden border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-900">
                Guia de Importação & Padronização de Planilhas
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Como garantir 100% de aceitação no sistema acadêmico / de destino
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-6 text-xs text-neutral-700 overflow-y-auto max-h-[75vh]">
          {/* Section 1 */}
          <div>
            <h4 className="text-sm font-bold text-neutral-900 mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              1. Por que este conversor é necessário?
            </h4>
            <p className="leading-relaxed text-neutral-600">
              Muitos sistemas de cadastro institucional (como SUAP, SIGAA, Plataformas de Extensão, Certificados ou portais do MEC) rejeitam planilhas <strong className="font-semibold text-neutral-800">.ODS</strong> ou <strong className="font-semibold text-neutral-800">.XLSX</strong> brutas porque exigem:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-neutral-600">
              <li>Cabeçalhos com grafia e maiúsculas/minúsculas estritas (ex: <code className="bg-neutral-100 px-1 py-0.5 rounded text-neutral-800 font-mono">"Carga horária"</code> em vez de "Carga Horária").</li>
              <li>CPF sem caracteres especiais como pontos e traços (<code className="bg-neutral-100 px-1 py-0.5 rounded text-neutral-800 font-mono">12498210743</code> em vez de <code className="bg-neutral-100 px-1 py-0.5 rounded text-neutral-800 font-mono">124.982.107-43</code>).</li>
              <li>Preservação do zero à esquerda no CPF de pessoas com numeração iniciada em zero (ex: <code className="bg-neutral-100 px-1 py-0.5 rounded text-neutral-800 font-mono">09873421755</code>).</li>
              <li>Todas as colunas envolvidas entre aspas duplas <code className="bg-neutral-100 px-1 py-0.5 rounded text-neutral-800 font-mono">"..."</code> separadas por tabulação ou ponto e vírgula.</li>
            </ul>
          </div>

          {/* Section 2: Table of exact headers */}
          <div>
            <h4 className="text-sm font-bold text-neutral-900 mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              2. Mapeamento dos Cabeçalhos Exigidos
            </h4>
            <div className="border border-neutral-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-neutral-100 text-neutral-700 font-semibold border-b border-neutral-200">
                  <tr>
                    <th className="py-2 px-3">Coluna Original na Imagem</th>
                    <th className="py-2 px-3 text-emerald-800">Cabeçalho de Destino</th>
                    <th className="py-2 px-3">Formatação Aplicada</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 font-mono text-[11px]">
                  {TARGET_COLUMNS.map((col) => (
                    <tr key={col.key}>
                      <td className="py-2 px-3 text-neutral-600 font-sans">{col.sampleInputHeader}</td>
                      <td className="py-2 px-3 text-emerald-700 font-bold bg-emerald-50/50">"{col.targetHeader}"</td>
                      <td className="py-2 px-3 text-neutral-600 font-sans">{col.formatDescription}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Tips */}
          <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200 space-y-2">
            <h4 className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-blue-600" />
              Dicas de Compatibilidade
            </h4>
            <p className="text-neutral-600 leading-relaxed">
              <strong>Se o sistema acusar erro de delimitador:</strong> Alterne a opção "Separador de Colunas" entre <code className="font-mono bg-neutral-200 px-1 py-0.2 rounded">Tabulação (\t)</code> (padrão do exemplo enviado) e <code className="font-mono bg-neutral-200 px-1 py-0.2 rounded">Ponto e vírgula (;)</code>.
            </p>
            <p className="text-neutral-600 leading-relaxed">
              <strong>Se você abrir no Excel e os acentos ficarem estranhos:</strong> Marque a opção <code className="font-mono bg-neutral-200 px-1 py-0.2 rounded">Adicionar UTF-8 BOM</code> antes de baixar o arquivo.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
