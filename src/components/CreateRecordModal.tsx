import React, { useState, useEffect } from 'react';
import { X, Plus, UserPlus } from 'lucide-react';
import { StandardRecord } from '../types';
import { cleanCpf, isValidCpf, formatToDateBr, maskDateInput } from '../utils/csvConverter';

interface CreateRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (record: StandardRecord) => void;
}

const EMPTY_FORM = {
  nome: '',
  nascimento: '',
  cpf: '',
  email: '',
  cargaHoraria: '',
  inicio: '',
  fim: '',
};

export const CreateRecordModal: React.FC<CreateRecordModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [formData, setFormData] = useState(EMPTY_FORM);

  // Always reset fields to blank whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData(EMPTY_FORM);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const digitsCpf = cleanCpf(formData.cpf);
  const isCpfValid = digitsCpf ? isValidCpf(digitsCpf) : false;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: StandardRecord = {
      _id: `rec-manual-${Date.now()}`,
      nome: formData.nome.trim(),
      nascimento: formatToDateBr(formData.nascimento),
      cpf: cleanCpf(formData.cpf),
      email: formData.email.trim(),
      cargaHoraria: formData.cargaHoraria.trim() || '0',
      inicio: formatToDateBr(formData.inicio),
      fim: formatToDateBr(formData.fim),
      _original: {},
      _errors: !isCpfValid ? { cpf: 'CPF inválido' } : {},
    };

    onAdd(newRecord);
    setFormData(EMPTY_FORM);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl flex flex-col overflow-hidden border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900">
                Adicionar Nova Linha na Tabela
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Construa sua planilha diretamente no aplicativo sem precisar de arquivo externo
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs">
          {/* Nome */}
          <div className="space-y-1">
            <label className="font-semibold text-neutral-800 flex items-center justify-between">
              <span>Nome Completo *</span>
              <span className="text-neutral-400 font-normal">Destino: "Nome"</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Ex: Nome do Participante"
            />
          </div>

          {/* CPF */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-neutral-800 flex items-center gap-1.5">
                <span>CPF *</span>
                {digitsCpf && (
                  isCpfValid ? (
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-medium">
                      ✓ Válido
                    </span>
                  ) : (
                    <span className="text-[10px] text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded font-medium">
                      Inválido ({digitsCpf.length}/11 dígitos)
                    </span>
                  )
                )}
              </label>
              <span className="text-neutral-400 font-normal">Destino: "CPF" (11 dígitos)</span>
            </div>
            <input
              type="text"
              required
              value={formData.cpf}
              onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
              className={`w-full bg-white border rounded-lg px-3 py-2 text-xs font-mono text-neutral-900 focus:outline-none focus:ring-2 ${
                digitsCpf && !isCpfValid ? 'border-red-400 focus:ring-red-500' : 'border-neutral-300 focus:ring-emerald-500'
              }`}
              placeholder="Ex: 124.982.107-43 ou 12498210743"
            />
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
                placeholder="Ex: 60"
                className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs font-mono text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="font-semibold text-neutral-800 block">
              E-mail
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Ex: participante@ifes.edu.br"
              className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs font-mono text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Início */}
            <div className="space-y-1">
              <label className="font-semibold text-neutral-800 block">
                Data Início
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
                Data Fim
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
              <Plus className="w-3.5 h-3.5" />
              <span>Inserir na Tabela</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
