import React, { useState, useMemo } from 'react';
import { StandardRecord, TARGET_COLUMNS } from '../types';
import { Search, Plus, Trash2, Edit2, AlertCircle, CheckCircle2, ShieldAlert, Sparkles, Filter, Wrench } from 'lucide-react';
import { isValidCpf, maskDateInput, formatToDateBr } from '../utils/csvConverter';
import { EditRecordModal } from './EditRecordModal';

interface DataGridProps {
  records: StandardRecord[];
  onUpdateRecord: (id: string, updatedFields: Partial<StandardRecord>) => void;
  onDeleteRecord: (id: string) => void;
  onAddRecord: () => void;
  onClearAll: () => void;
}

export const DataGrid: React.FC<DataGridProps> = ({
  records,
  onUpdateRecord,
  onDeleteRecord,
  onAddRecord,
  onClearAll,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterInvalidOnly, setFilterInvalidOnly] = useState(false);
  const [editingModalRecord, setEditingModalRecord] = useState<StandardRecord | null>(null);
  const [editingCell, setEditingCell] = useState<{ id: string; field: keyof StandardRecord } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [pageSize, setPageSize] = useState<number>(50);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Filter records
  const filteredRecords = useMemo(() => {
    let list = records;
    if (filterInvalidOnly) {
      list = list.filter((r) => !r.cpf || !isValidCpf(r.cpf));
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      list = list.filter(
        (r) =>
          r.nome.toLowerCase().includes(term) ||
          r.cpf.includes(term) ||
          r.email.toLowerCase().includes(term)
      );
    }
    return list;
  }, [records, searchTerm, filterInvalidOnly]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredRecords.length / pageSize) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRecords.slice(start, start + pageSize);
  }, [filteredRecords, currentPage, pageSize]);

  const handleStartEdit = (record: StandardRecord, field: keyof StandardRecord) => {
    setEditingCell({ id: record._id, field });
    setEditValue(String(record[field] ?? ''));
  };

  const handleSaveEdit = () => {
    if (!editingCell) return;
    let finalValue = editValue;
    if (editingCell.field === 'nascimento' || editingCell.field === 'inicio' || editingCell.field === 'fim') {
      finalValue = formatToDateBr(editValue);
    }
    onUpdateRecord(editingCell.id, { [editingCell.field]: finalValue });
    setEditingCell(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      setEditingCell(null);
    }
  };

  // Stats
  const invalidCpfCount = useMemo(() => {
    return records.filter((r) => !r.cpf || !isValidCpf(r.cpf)).length;
  }, [records]);

  return (
    <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-xs space-y-0">
      {/* Alert banner if invalid CPFs are detected */}
      {invalidCpfCount > 0 && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 text-xs text-amber-900">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>{invalidCpfCount} linha(s)</strong> com problema no CPF foram detectadas e estão <strong>destacadas na tabela</strong>.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterInvalidOnly(!filterInvalidOnly)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ${
                filterInvalidOnly
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white border border-amber-300 text-amber-900 hover:bg-amber-100'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>{filterInvalidOnly ? 'Mostrando apenas erros' : 'Filtrar apenas linhas com erro'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Table Toolbar */}
      <div className="p-3 sm:p-4 border-b border-neutral-200 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-neutral-50/50">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 sm:w-72 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Buscar por nome, CPF ou email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-white border border-neutral-300 rounded-lg pl-9 pr-3 py-1.5 text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div className="text-xs text-neutral-500 font-mono tabular-nums whitespace-nowrap">
            {filteredRecords.length} de {records.length} registros
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {filterInvalidOnly && (
            <button
              onClick={() => setFilterInvalidOnly(false)}
              className="px-2.5 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 bg-neutral-200/60 hover:bg-neutral-200 rounded-lg cursor-pointer"
            >
              Limpar filtro de erros
            </button>
          )}

          {records.length > 0 && (
            <button
              onClick={onClearAll}
              className="px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-xs"
              title="Apagar todos os registros da tabela"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-500" />
              <span>Limpar Tudo</span>
            </button>
          )}

          <button
            onClick={onAddRecord}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Construir / Adicionar Linha</span>
          </button>
        </div>
      </div>

      {/* High density Data Grid */}
      <div className="overflow-x-auto max-h-[520px] overflow-y-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="sticky top-0 z-10 bg-neutral-100/95 backdrop-blur-xs border-b border-neutral-200 text-neutral-700 font-semibold select-none">
            <tr>
              <th className="py-2.5 px-3 w-10 text-center text-neutral-400 font-mono text-[11px]">#</th>
              {TARGET_COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className={`py-2.5 px-3 whitespace-nowrap font-medium text-neutral-800 ${
                    col.key === 'cargaHoraria' ? 'text-right' : ''
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <span>"{col.targetHeader}"</span>
                  </div>
                </th>
              ))}
              <th className="py-2.5 px-3 w-28 text-center text-neutral-600">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {records.length === 0 ? (
              <tr>
                <td colSpan={TARGET_COLUMNS.length + 2} className="py-14 text-center text-neutral-500">
                  <div className="max-w-sm mx-auto space-y-3">
                    <p className="font-semibold text-neutral-800 text-sm">Sua tabela está vazia</p>
                    <p className="text-xs text-neutral-500">
                      Você pode <strong>construir sua tabela diretamente aqui</strong> adicionando linhas manuais, ou importar uma planilha .ODS no topo.
                    </p>
                    <button
                      onClick={onAddRecord}
                      className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Começar a Construir Tabela</span>
                    </button>
                  </div>
                </td>
              </tr>
            ) : paginatedRecords.length === 0 ? (
              <tr>
                <td colSpan={TARGET_COLUMNS.length + 2} className="py-12 text-center text-neutral-500">
                  Nenhum registro encontrado para o termo pesquisado.
                </td>
              </tr>
            ) : (
              paginatedRecords.map((record, index) => {
                const rowIndex = (currentPage - 1) * pageSize + index + 1;
                const isCpfValid = isValidCpf(record.cpf);
                const hasCpfProblem = !record.cpf || !isCpfValid;

                return (
                  <tr
                    key={record._id}
                    className={`transition-colors group h-10 ${
                      hasCpfProblem
                        ? 'bg-amber-50/70 hover:bg-amber-100/70 border-l-4 border-l-amber-500 text-amber-950'
                        : 'hover:bg-neutral-50/80 text-neutral-700'
                    }`}
                  >
                    {/* Index */}
                    <td className="py-1.5 px-3 text-center font-mono text-[11px] text-neutral-400">
                      {rowIndex}
                    </td>

                    {/* Nome */}
                    <td
                      onClick={() => handleStartEdit(record, 'nome')}
                      className="py-1.5 px-3 font-medium text-neutral-900 cursor-pointer hover:bg-black/5 rounded"
                      title="Clique para editar"
                    >
                      {editingCell?.id === record._id && editingCell.field === 'nome' ? (
                        <input
                          autoFocus
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={handleSaveEdit}
                          onKeyDown={handleKeyDown}
                          className="w-full bg-white border border-emerald-500 rounded px-1.5 py-0.5 text-xs text-neutral-900 focus:outline-none"
                        />
                      ) : (
                        <div className="flex items-center justify-between gap-1">
                          <span className="truncate max-w-[220px]" title={record.nome}>
                            {record.nome || <em className="text-neutral-400 font-normal">Vazio</em>}
                          </span>
                          <Edit2 className="w-3 h-3 text-neutral-400 opacity-0 group-hover:opacity-100 shrink-0" />
                        </div>
                      )}
                    </td>

                    {/* Nascimento */}
                    <td
                      onClick={() => handleStartEdit(record, 'nascimento')}
                      className="py-1.5 px-3 font-mono tabular-nums text-neutral-700 cursor-pointer hover:bg-black/5 rounded"
                      title="Clique para editar"
                    >
                      {editingCell?.id === record._id && editingCell.field === 'nascimento' ? (
                        <input
                          autoFocus
                          type="text"
                          value={editValue}
                          placeholder="DD/MM/AAAA"
                          maxLength={10}
                          onChange={(e) => setEditValue(maskDateInput(e.target.value))}
                          onBlur={handleSaveEdit}
                          onKeyDown={handleKeyDown}
                          className="w-24 bg-white border border-emerald-500 rounded px-1.5 py-0.5 text-xs font-mono"
                        />
                      ) : (
                        <span>{record.nascimento || '-'}</span>
                      )}
                    </td>

                    {/* CPF - Destaque especial e botão de corrigir */}
                    <td
                      onClick={() => handleStartEdit(record, 'cpf')}
                      className={`py-1.5 px-3 font-mono tabular-nums cursor-pointer rounded ${
                        hasCpfProblem
                          ? 'bg-amber-100/60 hover:bg-amber-200/60 font-bold'
                          : 'hover:bg-black/5'
                      }`}
                      title={hasCpfProblem ? 'CPF Inválido! Clique para corrigir' : 'Clique para editar'}
                    >
                      {editingCell?.id === record._id && editingCell.field === 'cpf' ? (
                        <input
                          autoFocus
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={handleSaveEdit}
                          onKeyDown={handleKeyDown}
                          className="w-28 bg-white border border-emerald-500 rounded px-1.5 py-0.5 text-xs font-mono"
                        />
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className={`tracking-tight ${hasCpfProblem ? 'text-amber-950 font-bold' : 'text-neutral-900 font-semibold'}`}>
                            {record.cpf || <span className="text-red-600 font-normal italic">Sem CPF</span>}
                          </span>
                          {record.cpf && (
                            <span
                              title={isCpfValid ? 'CPF matematicamente válido' : 'Dígitos verificadores incorretos!'}
                            >
                              {isCpfValid ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              ) : (
                                <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                              )}
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Email */}
                    <td
                      onClick={() => handleStartEdit(record, 'email')}
                      className="py-1.5 px-3 font-mono text-[11px] text-neutral-600 cursor-pointer hover:bg-black/5 rounded"
                      title="Clique para editar"
                    >
                      {editingCell?.id === record._id && editingCell.field === 'email' ? (
                        <input
                          autoFocus
                          type="email"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={handleSaveEdit}
                          onKeyDown={handleKeyDown}
                          className="w-full bg-white border border-emerald-500 rounded px-1.5 py-0.5 text-xs font-mono"
                        />
                      ) : (
                        <span className="truncate max-w-[200px] block" title={record.email}>
                          {record.email || '-'}
                        </span>
                      )}
                    </td>

                    {/* Carga horária */}
                    <td
                      onClick={() => handleStartEdit(record, 'cargaHoraria')}
                      className="py-1.5 px-3 text-right font-mono tabular-nums text-neutral-900 font-semibold cursor-pointer hover:bg-black/5 rounded"
                      title="Clique para editar"
                    >
                      {editingCell?.id === record._id && editingCell.field === 'cargaHoraria' ? (
                        <input
                          autoFocus
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={handleSaveEdit}
                          onKeyDown={handleKeyDown}
                          className="w-16 bg-white border border-emerald-500 rounded px-1.5 py-0.5 text-xs text-right font-mono"
                        />
                      ) : (
                        <span>{record.cargaHoraria || '0'}</span>
                      )}
                    </td>

                    {/* Início */}
                    <td
                      onClick={() => handleStartEdit(record, 'inicio')}
                      className="py-1.5 px-3 font-mono tabular-nums text-neutral-700 cursor-pointer hover:bg-black/5 rounded"
                      title="Clique para editar"
                    >
                      {editingCell?.id === record._id && editingCell.field === 'inicio' ? (
                        <input
                          autoFocus
                          type="text"
                          value={editValue}
                          placeholder="DD/MM/AAAA"
                          maxLength={10}
                          onChange={(e) => setEditValue(maskDateInput(e.target.value))}
                          onBlur={handleSaveEdit}
                          onKeyDown={handleKeyDown}
                          className="w-24 bg-white border border-emerald-500 rounded px-1.5 py-0.5 text-xs font-mono"
                        />
                      ) : (
                        <span>{record.inicio || '-'}</span>
                      )}
                    </td>

                    {/* Fim */}
                    <td
                      onClick={() => handleStartEdit(record, 'fim')}
                      className="py-1.5 px-3 font-mono tabular-nums text-neutral-700 cursor-pointer hover:bg-black/5 rounded"
                      title="Clique para editar"
                    >
                      {editingCell?.id === record._id && editingCell.field === 'fim' ? (
                        <input
                          autoFocus
                          type="text"
                          value={editValue}
                          placeholder="DD/MM/AAAA"
                          maxLength={10}
                          onChange={(e) => setEditValue(maskDateInput(e.target.value))}
                          onBlur={handleSaveEdit}
                          onKeyDown={handleKeyDown}
                          className="w-24 bg-white border border-emerald-500 rounded px-1.5 py-0.5 text-xs font-mono"
                        />
                      ) : (
                        <span>{record.fim || '-'}</span>
                      )}
                    </td>

                    {/* Actions - Botão Corrigir e Remover */}
                    <td className="py-1.5 px-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setEditingModalRecord(record)}
                          className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors flex items-center gap-1 cursor-pointer ${
                            hasCpfProblem
                              ? 'bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-xs'
                              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200'
                          }`}
                          title="Abrir formulário para editar / corrigir dados"
                        >
                          {hasCpfProblem ? (
                            <>
                              <Wrench className="w-3 h-3" />
                              <span>Corrigir</span>
                            </>
                          ) : (
                            <>
                              <Edit2 className="w-3 h-3" />
                              <span>Editar</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => onDeleteRecord(record._id)}
                          className="text-neutral-400 hover:text-red-600 transition-colors p-1 rounded hover:bg-red-50 cursor-pointer"
                          title="Remover linha"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-3 border-t border-neutral-200 bg-neutral-50/50 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            <span>Linhas por página:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-white border border-neutral-300 rounded px-2 py-1 text-xs"
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={500}>500</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 border border-neutral-200 rounded bg-white hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Anterior
            </button>
            <span className="px-3 font-mono tabular-nums">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1 border border-neutral-200 rounded bg-white hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Próxima
            </button>
          </div>
        </div>
      )}

      {/* Modal para Edição / Correção de Linha */}
      <EditRecordModal
        isOpen={!!editingModalRecord}
        onClose={() => setEditingModalRecord(null)}
        record={editingModalRecord}
        onSave={onUpdateRecord}
      />
    </div>
  );
};
