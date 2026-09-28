import React, { useState } from 'react';
import { X, Check, AlertCircle, ShieldAlert, Sparkles } from 'lucide-react';
import { StandardRecord } from '../types';
import { cleanCpf, isValidCpf, formatToDateBr, maskDateInput } from '../utils/csvConverter';

interface EditRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: StandardRecord | null;
  onSave: (id: string, updatedFields: Partial<StandardRecord>) => void;
}

export const EditRecordModal: React.FC<EditRecordModalProps> = ({
  isOpen,
  onClose,
  record,
  onSave,
}) => {
  if (!isOpen || !record) return null;

  const [formData, setFormData] = useState({
    nome: record.nome || '',
    nascimento: record.nascimento || '',
    cpf: record.cpf || '',
    email: record.email || '',
    cargaHoraria: record.cargaHoraria || '',
    inicio: record.inicio || '',
    fim: record.fim || '',
  });

  const digitsCpf = cleanCpf(formData.cpf);
  const isCpfValid = isValidCpf(digitsCpf);
  const isCpfEmpty = !digitsCpf;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(record._id, {
      nome: formData.nome.trim(),
      nascimento: formatToDateBr(formData.nascimento),
      cpf: cleanCpf(formData.cpf),
      email: formData.email.trim(),
      cargaHoraria: formData.cargaHoraria.trim(),
      inicio: formatToDateBr(formData.inicio),
      fim: formatToDateBr(formData.fim),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl flex flex-col overflow-hidden border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
          <div>
            <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <span>Editar Registro de Participante</span>
              {(!isCpfValid || isCpfEmpty) && (
                <span className="text-[11px] font-medium text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3 text-amber-700" />
                  CPF precisa de correção
                </span>
              )}
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Altere os dados conforme a padronização do sistema acadêmico de destino
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs">
          {/* Alerta de erro de CPF */}
          {!isCpfValid && !isCpfEmpty && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">CPF com dígitos verificadores inválidos</p>
                <p className="text-[11px] text-red-700 mt-0.5">
                  O valor atual ({digitsCpf}) não passa no cálculo oficial da Receita Federal. Digite o CPF correto para evitar rejeição no sistema de destino.
                </p>
              </div>
            </div>
          )}

          {isCpfEmpty && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Campo CPF em branco</p>
                <p className="text-[11px] text-amber-700 mt-0.5">
                  O CPF é um campo obrigatório no sistema de destino.
                </p>
              </div>
            </div>
          )}

          {/* Nome */}
          <div className="space-y-1">
            <label className="font-semibold text-neutral-800 flex items-center justify-between">
              <span>Nome Completo *</span>
              <span className="text-neutral-400 font-normal">Cabeçalho: "Nome"</span>
            </label>
            <input
              type="text"
              required
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Ex: Nome do Participante"
            />
          </div>

          {/* CPF com validação visual */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-neutral-800 flex items-center gap-1.5">
                <span>CPF (apenas números) *</span>
                {isCpfValid ? (
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-medium flex items-center gap-1">
                    <Check className="w-2.5 h-2.5" /> Válido
                  </span>
                ) : (
                  <span className="text-[10px] text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded font-medium">
                    Inválido ({digitsCpf.length}/11 dígitos)
                  </span>
                )}
              </label>
              <span className="text-neutral-400 font-normal">Cabeçalho: "CPF"</span>
            </div>
            <div className="relative">
              <input
                type="text"
                required
                value={formData.cpf}
                onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                className={`w-full bg-white border rounded-lg px-3 py-2 text-xs font-mono text-neutral-900 focus:outline-none focus:ring-2 ${
                  isCpfValid
                    ? 'border-emerald-500 focus:ring-emerald-500'
                    : isCpfEmpty
                    ? 'border-amber-400 focus:ring-amber-500 bg-amber-50/20'
                    : 'border-red-400 focus:ring-red-500 bg-red-50/20'
                }`}
                placeholder="Ex: 124.982.107-43 ou 12498210743"
              />
            </div>
            <p className="text-[10px] text-neutral-500">
              Pontos e traços são removidos automaticamente na hora de salvar.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Nascimento */}
            <div className="space-y-1">
              <label className="font-semibold text-neutral-800 block">
                Data de Nascimento
              </label>
              <input
                type="text"
                value={formData.nascimento}
                onChange={(e) => setFormData({ ...formData, nascimento: maskDateInput(e.target.value) })}
                placeholder="DD/MM/AAAA"
                maxLength={10}
                className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs font-mono text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Carga Horária */}
            <div className="space-y-1">
              <label className="font-semibold text-neutral-800 block">
                Carga horária (horas)
              </label>
              <input
                type="text"
                value={formData.cargaHoraria}
                onChange={(e) => setFormData({ ...formData, cargaHoraria: e.target.value })}
                placeholder="Ex: 487"
                className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs font-mono text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="font-semibold text-neutral-800 block">
              E-mail Institucional ou Pessoal
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="exemplo@ifsp.edu.br"
              className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs font-mono text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Início */}
            <div className="space-y-1">
              <label className="font-semibold text-neutral-800 block">
                Data de Início
              </label>
              <input
                type="text"
                value={formData.inicio}
                onChange={(e) => setFormData({ ...formData, inicio: maskDateInput(e.target.value) })}
                placeholder="DD/MM/AAAA"
                maxLength={10}
                className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs font-mono text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Fim */}
            <div className="space-y-1">
              <label className="font-semibold text-neutral-800 block">
                Data de Término (Fim)
              </label>
              <input
                type="text"
                value={formData.fim}
                onChange={(e) => setFormData({ ...formData, fim: maskDateInput(e.target.value) })}
                placeholder="DD/MM/AAAA"
                maxLength={10}
                className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs font-mono text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Footer actions */}
          <div className="pt-3 border-t border-neutral-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Salvar Alterações</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
