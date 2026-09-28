import React, { useState } from 'react';

interface SrcTutorialStepProps {
  onBackToExport: () => void;
  onRedownload: () => void;
  filename: string;
}

export const SrcTutorialStep: React.FC<SrcTutorialStepProps> = ({
  onBackToExport,
  onRedownload,
  filename,
}) => {
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [downloadFeedback, setDownloadFeedback] = useState(false);

  const handleDownloadAgain = () => {
    onRedownload();
    setDownloadFeedback(true);
    setTimeout(() => setDownloadFeedback(false), 3000);
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto space-y-8 pb-10">
      {/* Top Banner: Título Oficial & Status do Arquivo */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col gap-1 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#85f8c4] text-[#002114] self-start font-mono text-[11px] font-semibold">
              <span className="material-symbols-outlined text-[15px]">verified</span>
              <span>PASSO A PASSO ILUSTRADO • SISTEMA SRC/IFES OFICIAL</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#131b2e] tracking-tight">
              Como Inserir o Arquivo Gerado no Sistema SRC/Ifes
            </h1>
            <p className="text-sm sm:text-base text-[#3d4a42]">
              Guia visual com os 6 passos reais extraídos da interface oficial do Sistema de Registro e Emissão de Certificados (SRC/Ifes) para homologar seus participantes com 100% de sucesso.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto bg-[#e2e7ff] px-4 py-2 rounded-lg border border-[#bccac0]/30 shadow-xs">
            <span className="material-symbols-outlined text-[#006948] text-[20px]">verified_user</span>
            <span className="font-mono text-xs text-[#131b2e] font-semibold">SRC Homologado • Proex/Ifes</span>
          </div>
        </div>

        {/* Card de Status do Arquivo Convertido */}
        <div className="bg-white rounded-xl shadow-xs p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative overflow-hidden border border-[#bccac0]/30">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#006948]"></div>
          <div className="flex items-start sm:items-center gap-4 pl-1">
            <div className="w-12 h-12 rounded-xl bg-[#85f8c4] flex items-center justify-center text-[#006948] shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-[28px]">file_download_done</span>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-bold text-[#131b2e]">Arquivo pronto para submissão:</span>
                <code className="px-2 py-0.5 rounded bg-[#eaedff] text-[#006948] font-mono text-xs font-semibold">
                  {filename || 'dados_convertidos_sistema.csv'}
                </code>
                <span className="px-2 py-0.5 rounded bg-[#85f8c4] text-[#002114] font-mono text-[10px] font-bold">
                  Válido
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 font-mono text-xs text-[#3d4a42]">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#006948]"></span>UTF-8 (compatível com acentos)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#006948]"></span>Delimitador Tabulação (\t)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#006948]"></span>Estrutura Canônica de 7 Colunas
                </span>
                <span className="text-[#006948] font-bold">Zero CPFs Nulos</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 pl-1 lg:pl-0">
            <button
              onClick={handleDownloadAgain}
              className="px-3.5 py-2 rounded-lg bg-[#eaedff] hover:bg-[#dae2fd] text-[#131b2e] font-medium text-xs transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">cloud_download</span>
              <span>{downloadFeedback ? 'Baixado!' : 'Baixar Novamente'}</span>
            </button>
            <a
              href="https://src.ifes.edu.br"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-[#006948] text-white hover:bg-[#00855d] text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs"
            >
              <span>Ir para o Portal SRC</span>
              <span className="material-symbols-outlined text-[16px]">open_in_new</span>
            </a>
          </div>
        </div>
      </section>

      {/* Indicador de Resumo dos 6 Passos */}
      <div className="bg-[#f2f3ff] rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 border border-[#eaedff]">
        <div className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-full bg-[#006948] text-white font-mono text-xs flex items-center justify-center font-bold">
            6
          </span>
          <span className="text-sm font-bold text-[#131b2e]">
            Roteiro Oficial de Submissão em 6 Etapas
          </span>
        </div>
        <div className="flex items-center gap-2 text-[#3d4a42] font-mono text-xs">
          <span className="w-2 h-2 rounded-full bg-[#006948] animate-pulse"></span>
          <span>Interface real baseada no SRC v1.1.1 Proex • Tempo estimado: ~2 minutos</span>
        </div>
      </div>

      {/* ========================================== */}
      {/* ROTEIRO COMPLETO: 6 PASSOS ILUSTRADOS     */}
      {/* ========================================== */}
      <section className="flex flex-col gap-6">
        {/* PASSO 1 */}
        <article className="bg-white rounded-xl shadow-xs border border-[#bccac0]/25 overflow-hidden flex flex-col">
          <div className="p-5 sm:p-6 flex flex-col gap-2 bg-white border-b border-[#bccac0]/20">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-lg bg-[#006948] text-white text-base flex items-center justify-center font-bold shadow-xs">
                  1
                </span>
                <h2 className="text-lg font-bold text-[#131b2e]">
                  Acessar a Barra Superior: Gerenciar &gt; Ações
                </h2>
              </div>
              <span className="px-2.5 py-0.5 rounded bg-[#eaedff] text-[#3d4a42] font-mono text-xs">
                Tela Inicial do SRC
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#3d4a42] leading-relaxed">
              Ao entrar no portal do <strong className="text-[#131b2e]">SRC/IFES</strong>, localize o menu verde na barra superior. Clique no menu <strong className="text-[#006948] font-bold">"Gerenciar ▾"</strong> e em seguida selecione a opção <strong className="text-[#006948] font-bold">"Ações"</strong>.
            </p>
            <div className="flex items-center gap-2 text-[#3d4a42] text-xs bg-[#f2f3ff] px-3.5 py-2 rounded-lg">
              <span className="material-symbols-outlined text-[#006948] text-[18px]">navigation</span>
              <span>Navegação exata: <strong>SRC/IFES</strong> → Menu Superior <strong className="text-[#006948]">Gerenciar</strong> → Submenu <strong className="text-[#006948]">Ações</strong></span>
            </div>
          </div>

          <div className="p-4 sm:p-5 bg-[#f2f3ff]">
            <div className="rounded-lg overflow-hidden border border-[#dae2fd] shadow-xs bg-white">
              <div className="bg-[#e2e7ff] px-4 py-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></span>
                  <span className="ml-2 font-mono text-xs text-[#3d4a42]">SRC/IFES - Início &gt; Gerenciar &gt; Ações</span>
                </div>
                <span className="font-mono text-xs text-[#006948] font-bold">Print 1 • Menu Gerenciar</span>
              </div>

              {/* Mockup visual estilizado */}
              <div className="flex flex-col bg-white border border-[#dae2fd] overflow-hidden">
                <div className="bg-[#00855d] text-white px-4 py-2.5 flex flex-wrap items-center justify-between text-xs shadow-xs">
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-sm tracking-wide">SRC/IFES</span>
                    <nav className="flex items-center gap-2 text-xs">
                      <span className="flex items-center gap-1 opacity-90 px-2 py-1 rounded">
                        <span className="material-symbols-outlined text-[15px]">home</span> Início
                      </span>
                      <div className="relative">
                        <div className="flex items-center gap-1 bg-[#005137] px-2.5 py-1 rounded font-semibold text-white shadow-xs ring-2 ring-[#85f8c4]">
                          <span className="material-symbols-outlined text-[15px]">manage_accounts</span> Gerenciar ▾
                        </div>
                      </div>
                      <span className="opacity-90 px-2 py-1">Cadastro ▾</span>
                      <span className="opacity-90 px-2 py-1">Administração ▾</span>
                    </nav>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <span className="material-symbols-outlined text-[16px]">account_circle</span>
                    <span>Servidor Autenticado</span>
                  </div>
                </div>

                <div className="p-4 bg-white">
                  <div className="text-center py-2 mb-3 border-b border-[#eaedff]">
                    <h3 className="text-sm font-semibold text-[#006591]">Sistema de Registro e Emissão de Certificados</h3>
                    <p className="text-xs text-[#6d7a72]">Prezado(a) servidor(a), confira abaixo as ações homologadas no campus.</p>
                  </div>
                  <div className="bg-[#f2f3ff] p-3 rounded-lg flex items-center justify-between">
                    <span className="font-mono text-xs text-[#006948] font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">check_circle</span>
                      Clique em Gerenciar ▾ → Ações para listar seus projetos
                    </span>
                    <span className="bg-[#85f8c4] text-[#002114] px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                      Passo 1 OK
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* PASSO 2 */}
        <article className="bg-white rounded-xl shadow-xs border border-[#bccac0]/25 overflow-hidden flex flex-col">
          <div className="p-5 sm:p-6 flex flex-col gap-2 bg-white border-b border-[#bccac0]/20">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-lg bg-[#006948] text-white text-base flex items-center justify-center font-bold shadow-xs">
                  2
                </span>
                <h2 className="text-lg font-bold text-[#131b2e]">
                  Filtrar a Ação Acadêmica pelo Número do Processo
                </h2>
              </div>
              <span className="px-2.5 py-0.5 rounded bg-[#eaedff] text-[#3d4a42] font-mono text-xs">
                Tela Gerenciar Ação (Filtro)
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#3d4a42] leading-relaxed">
              Na tela <strong className="text-[#131b2e]">"Gerenciar Ação"</strong>, digite o número do processo da ação acadêmica desejada no campo <strong className="text-[#006948] font-bold">"Processo:"</strong> (ex: <code className="px-1.5 py-0.5 rounded bg-[#eaedff] font-mono text-xs">12345.678910/2020-99</code>) e clique no botão azul com a <strong className="text-[#006591] font-bold">lupa de pesquisa</strong>.
            </p>
            <div className="flex items-center gap-2 text-[#3d4a42] text-xs bg-[#f2f3ff] px-3.5 py-2 rounded-lg">
              <span className="material-symbols-outlined text-[#006591] text-[18px]">search</span>
              <span>Dica: Caso não saiba o número exato do processo, consulte o coordenador do projeto ou a portaria institucional vinculada.</span>
            </div>
          </div>

          <div className="p-4 sm:p-5 bg-[#f2f3ff]">
            <div className="rounded-lg overflow-hidden border border-[#dae2fd] shadow-xs bg-white p-4">
              <div className="flex flex-col sm:flex-row items-center gap-3 bg-[#eaedff]/50 p-4 rounded-lg border border-[#bccac0]/25">
                <div className="w-full sm:w-auto flex-1 space-y-1">
                  <label className="block font-mono text-[11px] font-bold text-[#131b2e]">
                    Processo SIPAC / SEI:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value="23147.001234/2024-56"
                      className="bg-white border border-[#006591] rounded px-3 py-1.5 text-xs font-mono text-[#131b2e] w-full"
                    />
                    <button className="px-3.5 py-1.5 bg-[#006591] text-white rounded text-xs font-bold flex items-center gap-1 shadow-xs">
                      <span className="material-symbols-outlined text-[16px]">search</span>
                      <span>Buscar</span>
                    </button>
                  </div>
                </div>
                <div className="bg-[#c9e6ff] text-[#001e2f] p-2.5 rounded text-xs font-mono">
                  🔍 O botão azul com a lupa carrega as atividades do processo.
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* PASSO 3 */}
        <article className="bg-white rounded-xl shadow-xs border border-[#bccac0]/25 overflow-hidden flex flex-col">
          <div className="p-5 sm:p-6 flex flex-col gap-2 bg-white border-b border-[#bccac0]/20">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-lg bg-[#006948] text-white text-base flex items-center justify-center font-bold shadow-xs">
                  3
                </span>
                <h2 className="text-lg font-bold text-[#131b2e]">
                  Localizar Atividade &amp; Clicar no Ícone de 3 Pessoas (Gerenciar Público-Alvo)
                </h2>
              </div>
              <span className="px-2.5 py-0.5 rounded bg-[#eaedff] text-[#3d4a42] font-mono text-xs">
                Coluna Operação
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#3d4a42] leading-relaxed">
              Após a pesquisa, o SRC listará as atividades correspondentes na tabela. Localize a atividade desejada (ex: Evento, Curso) e, na coluna <strong className="text-[#131b2e]">"Operação"</strong> na extrema direita, clique no primeiro botão que possui o <strong className="text-[#006948] font-bold">ícone com desenho de 3 pessoas juntas (Gerenciar Público-Alvo)</strong>.
            </p>
            <div className="flex items-center gap-2 text-[#3d4a42] text-xs bg-[#f2f3ff] px-3.5 py-2 rounded-lg">
              <span className="material-symbols-outlined text-[#006948] text-[18px]">group</span>
              <span>Coluna Operação: O botão com <strong className="text-[#006948]">3 pessoas</strong> abre o público-alvo; o botão com 1 pessoa é para docentes/equipe.</span>
            </div>
          </div>

          <div className="p-4 sm:p-5 bg-[#f2f3ff]">
            <div className="rounded-lg overflow-hidden border border-[#bccac0]/30 shadow-xs bg-white">
              {/* Barra superior estilo janela com dica */}
              <div className="bg-[#eaedff] px-4 py-2 border-b border-[#bccac0]/25 flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-mono text-[#131b2e] font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#006948]">table_view</span>
                  Tabela de Atividades do Processo (SRC)
                </span>
                <span className="bg-[#85f8c4]/70 text-[#002114] px-2 py-0.5 rounded text-[11px] font-bold">
                  Clique no primeiro botão da coluna "Operação" (ícone com 3 pessoas)
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-[#cbd5e1] text-[#334155] text-[11px] font-semibold select-none border-b border-neutral-300">
                    <tr>
                      <th className="py-2.5 px-3 whitespace-nowrap border-r border-[#94a3b8]/30">
                        <div className="flex items-center gap-1">
                          <span>Nº</span>
                          <span className="text-[10px] text-neutral-500 font-bold">⇅</span>
                        </div>
                      </th>
                      <th className="py-2.5 px-3 whitespace-nowrap border-r border-[#94a3b8]/30">
                        <div className="flex items-center gap-1">
                          <span>Tipo</span>
                          <span className="text-[10px] text-neutral-500 font-bold">⇅</span>
                        </div>
                      </th>
                      <th className="py-2.5 px-4 min-w-[280px] border-r border-[#94a3b8]/30 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <span>Atividade</span>
                          <span className="text-[10px] text-neutral-500 font-bold">⇅</span>
                        </div>
                      </th>
                      <th className="py-2.5 px-3 whitespace-nowrap border-r border-[#94a3b8]/30">
                        <div className="flex items-center gap-1">
                          <span>Turno</span>
                          <span className="text-[10px] text-neutral-500 font-bold">⇅</span>
                        </div>
                      </th>
                      <th className="py-2.5 px-2.5 whitespace-nowrap border-r border-[#94a3b8]/30 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <span>C.H</span>
                          <span className="text-[10px] text-neutral-500 font-bold">⇅</span>
                        </div>
                      </th>
                      <th className="py-2.5 px-3 whitespace-nowrap border-r border-[#94a3b8]/30">
                        <div className="flex items-center gap-1">
                          <span>Início</span>
                          <span className="text-[10px] text-neutral-500 font-bold">⇅</span>
                        </div>
                      </th>
                      <th className="py-2.5 px-3 whitespace-nowrap border-r border-[#94a3b8]/30">
                        <div className="flex items-center gap-1">
                          <span>Término</span>
                          <span className="text-[10px] text-neutral-500 font-bold">⇅</span>
                        </div>
                      </th>
                      <th className="py-2.5 px-3 whitespace-nowrap border-r border-[#94a3b8]/30 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <span>Vagas</span>
                          <span className="text-[10px] text-neutral-500 font-bold">⇅</span>
                        </div>
                      </th>
                      <th className="py-2.5 px-3 whitespace-nowrap border-r border-[#94a3b8]/30 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <span>Status<br />(público)</span>
                          <span className="text-[10px] text-neutral-500 font-bold">⇅</span>
                        </div>
                      </th>
                      <th className="py-2.5 px-3 whitespace-nowrap border-r border-[#94a3b8]/30 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <span>Status<br />(equipe)</span>
                          <span className="text-[10px] text-neutral-500 font-bold">⇅</span>
                        </div>
                      </th>
                      <th className="py-2.5 px-4 whitespace-nowrap text-center">
                        <span>Operação</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 text-[#1e293b] text-xs bg-white">
                    <tr className="hover:bg-neutral-50/80 transition-colors">
                      <td className="py-3 px-3 font-mono text-neutral-700 whitespace-nowrap">001</td>
                      <td className="py-3 px-3 whitespace-nowrap">Projeto</td>
                      <td className="py-3 px-4 font-normal leading-snug">
                        Apoio a projetos de inovação e empreendedorismo na Rede Federal de Educação Profissional, Científica e Tecnológica (RFEFPC)
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">Integral</td>
                      <td className="py-3 px-2.5 text-center font-mono">0</td>
                      <td className="py-3 px-3 font-mono whitespace-nowrap">01/12/2019</td>
                      <td className="py-3 px-3 font-mono whitespace-nowrap">31/12/2025</td>
                      <td className="py-3 px-3 text-center font-mono">700</td>
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wider bg-[#f3e8ff] text-[#7e22ce] border border-[#d8b4fe]">
                          CADASTRO
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wider bg-[#e0f2fe] text-[#0369a1] border border-[#bae6fd]">
                          FINALIZADO
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Botão 1: Público-alvo (3 pessoas com destaque de clique) */}
                          <div className="relative group">
                            <button
                              className="p-1.5 rounded bg-white hover:bg-neutral-100 border-2 border-[#006948] text-neutral-700 shadow-sm flex items-center justify-center ring-2 ring-[#85f8c4] ring-offset-1 transition-all"
                              title="Gerenciar Público-Alvo (CLIQUE AQUI!)"
                            >
                              <span className="material-symbols-outlined text-[18px] text-[#006948] font-bold">groups</span>
                            </button>
                            {/* Tooltip chamativa */}
                            <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#006948] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm pointer-events-none">
                              Clique Aqui!
                            </span>
                          </div>

                          {/* Botão 2: Equipe (1 pessoa) */}
                          <button
                            className="p-1.5 rounded bg-white hover:bg-neutral-100 border border-neutral-300 text-neutral-600 shadow-2xs flex items-center justify-center"
                            title="Gerenciar Equipe"
                          >
                            <span className="material-symbols-outlined text-[18px] text-neutral-600">account_circle</span>
                          </button>

                          {/* Botão 3: Informações (i) */}
                          <button
                            className="p-1.5 rounded bg-white hover:bg-neutral-100 border border-neutral-300 text-neutral-800 shadow-2xs flex items-center justify-center font-bold text-xs w-7 h-7"
                            title="Informações da Atividade"
                          >
                            i
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Legenda explicativa no rodapé do mockup */}
              <div className="bg-[#f8fafc] px-4 py-2.5 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-600">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <span className="p-0.5 rounded border border-[#006948] text-[#006948] inline-flex items-center justify-center bg-white shadow-2xs">
                      <span className="material-symbols-outlined text-[14px]">groups</span>
                    </span>
                    <strong className="text-[#006948]">1º botão (3 pessoas):</strong> Gerenciar Público-Alvo / Discentes (onde importa o CSV)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="p-0.5 rounded border border-neutral-300 text-neutral-600 inline-flex items-center justify-center bg-white">
                      <span className="material-symbols-outlined text-[14px]">account_circle</span>
                    </span>
                    <span><strong>2º botão:</strong> Equipe docente</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="p-0.5 rounded border border-neutral-300 text-neutral-700 font-bold inline-flex items-center justify-center w-5 h-5 bg-white text-[11px]">
                      i
                    </span>
                    <span><strong>3º botão:</strong> Detalhes</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* PASSO 4 */}
        <article className="bg-white rounded-xl shadow-xs border border-[#bccac0]/25 overflow-hidden flex flex-col">
          <div className="p-5 sm:p-6 flex flex-col gap-2 bg-white border-b border-[#bccac0]/20">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-lg bg-[#006948] text-white text-base flex items-center justify-center font-bold shadow-xs">
                  4
                </span>
                <h2 className="text-lg font-bold text-[#131b2e]">
                  Na tela "Gerenciar Público-Alvo", clicar em Menu ▾ e escolher "Importar CSV"
                </h2>
              </div>
              <span className="px-2.5 py-0.5 rounded bg-[#eaedff] text-[#3d4a42] font-mono text-xs">
                Menu Suspenso
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#3d4a42] leading-relaxed">
              Na tela <strong className="text-[#131b2e]">"Gerenciar Público-Alvo"</strong>, clique no botão <strong className="text-[#131b2e] font-bold">"Menu ▾"</strong> localizado acima da tabela de discentes e, no menu suspenso que se abre, clique na opção <strong className="text-[#006948] font-bold">"Importar CSV"</strong> (com ícone de bandeja de upload).
            </p>
            <div className="flex items-center gap-2 text-[#3d4a42] text-xs bg-[#f2f3ff] px-3.5 py-2 rounded-lg">
              <span className="material-symbols-outlined text-[#825100] text-[18px]">info</span>
              <span>Importante: Não use o botão "+ Novo" (que cadastra manualmente um por um). Utilize <strong className="text-[#006948]">Menu ▾ → Importar CSV</strong> para carregar a turma toda de uma vez.</span>
            </div>
          </div>

          <div className="p-4 sm:p-5 bg-[#f2f3ff]">
            <div className="rounded-lg overflow-hidden border border-[#dae2fd] shadow-xs bg-white p-4">
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="p-3 bg-[#eaedff]/40 rounded-lg border border-[#bccac0]/30 w-full sm:w-64">
                  <div className="bg-[#006948] text-white px-3 py-1.5 rounded font-bold text-xs flex items-center justify-between mb-2">
                    <span>Menu ▾</span>
                    <span className="material-symbols-outlined text-[16px]">expand_more</span>
                  </div>
                  <div className="bg-white rounded border border-[#eaedff] shadow-sm divide-y divide-[#eaedff] text-xs">
                    <div className="px-3 py-1.5 text-[#3d4a42]">Aprovar todos</div>
                    <div className="px-3 py-2 bg-[#85f8c4]/30 text-[#006948] font-bold flex items-center gap-1.5 border-l-4 border-[#006948]">
                      <span className="material-symbols-outlined text-[16px]">upload_file</span>
                      <span>Importar CSV (Clique aqui!)</span>
                    </div>
                    <div className="px-3 py-1.5 text-[#3d4a42]">Registrar certificados</div>
                  </div>
                </div>

                <div className="flex-1 text-xs text-[#3d4a42] space-y-2">
                  <h4 className="font-bold text-sm text-[#131b2e]">Instrução Oficial de Carga em Lote:</h4>
                  <p>
                    O comando <strong>Importar CSV</strong> aceita exatamente o arquivo gerado por este conversor, respeitando a tabulação <code className="bg-[#eaedff] px-1 py-0.5 rounded font-mono">\t</code> e a codificação UTF-8 com os 11 dígitos de CPF intactos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* PASSO 5 */}
        <article className="bg-white rounded-xl shadow-xs border border-[#bccac0]/25 overflow-hidden flex flex-col">
          <div className="p-5 sm:p-6 flex flex-col gap-2 bg-white border-b border-[#bccac0]/20">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-lg bg-[#006948] text-white text-base flex items-center justify-center font-bold shadow-xs">
                  5
                </span>
                <h2 className="text-lg font-bold text-[#131b2e]">
                  Clicar no Botão Azul "+ Selecionar" e depois no Verde "Importar"
                </h2>
              </div>
              <span className="px-2.5 py-0.5 rounded bg-[#eaedff] text-[#3d4a42] font-mono text-xs">
                Tela Importar Arquivo Público-Alvo
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#3d4a42] leading-relaxed">
              Na tela <strong className="text-[#131b2e]">"Importar Arquivo Público-Alvo"</strong>, clique no botão azul <strong className="text-[#006591] font-bold">+ Selecionar</strong> para escolher o arquivo <code className="px-1.5 py-0.5 rounded bg-[#eaedff] text-[#006948] font-mono text-xs font-semibold">{filename || 'dados_convertidos_sistema.csv'}</code> no seu computador. Após o arquivo ser anexado, clique no botão verde <strong className="text-[#006948] font-bold">"Importar"</strong>.
            </p>
            <div className="flex items-center gap-2 text-[#3d4a42] text-xs bg-[#f2f3ff] px-3.5 py-2 rounded-lg">
              <span className="material-symbols-outlined text-[#006948] text-[18px]">upload</span>
              <span>Ordem de cliques: 1º Botão Azul <strong className="text-[#006591]">+ Selecionar</strong> (escolha o arquivo) → 2º Botão Verde <strong className="text-[#006948]">Importar</strong>.</span>
            </div>
          </div>

          <div className="p-4 sm:p-5 bg-[#f2f3ff]">
            <div className="rounded-lg overflow-hidden border border-[#dae2fd] shadow-xs bg-white p-4">
              <div className="flex flex-wrap items-center justify-center gap-4 py-4">
                <div className="flex items-center gap-2 p-3 bg-[#c9e6ff] text-[#001e2f] rounded-lg font-bold text-xs shadow-xs">
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  <span>1º Passo: + Selecionar (Anexar seu .csv)</span>
                </div>
                <span className="material-symbols-outlined text-[#6d7a72]">arrow_forward</span>
                <div className="flex items-center gap-2 p-3 bg-[#85f8c4] text-[#002114] rounded-lg font-bold text-xs shadow-xs">
                  <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
                  <span>2º Passo: Importar (Enviar ao SRC)</span>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* PASSO 6 (FINAL) */}
        <article className="bg-white rounded-xl shadow-md border-2 border-[#006948]/40 overflow-hidden flex flex-col">
          <div className="p-5 sm:p-6 flex flex-col gap-2 bg-white border-b border-[#bccac0]/20">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-lg bg-[#006948] text-white text-base flex items-center justify-center font-bold shadow-xs">
                  6
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg font-bold text-[#131b2e]">
                    Conferência Prévia &amp; Finalizar em "Cadastrar participantes"
                  </h2>
                  <span className="px-2 py-0.5 rounded bg-[#85f8c4] text-[#002114] font-mono text-[10px] font-bold uppercase tracking-wider">
                    Etapa Final
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded bg-[#85f8c4] text-[#002114] font-mono text-xs font-bold">
                Conclusão
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#3d4a42] leading-relaxed">
              O sistema exibirá a notificação azul <strong className="text-[#006591] font-bold">"Arquivo importado com sucesso! Para prosseguir leia as instruções e em seguida cadastre os participantes"</strong>. Toda a lista de nomes, datas, CPFs e e-mails importados será exibida na tabela para conferência. Para concluir o cadastro oficial no SRC, basta clicar no botão verde <strong className="text-[#006948] font-bold">"✔ Cadastrar participantes"</strong> no canto superior esquerdo da tabela.
            </p>

            <div className="bg-[#006948]/10 p-4 rounded-lg flex items-center gap-3 border border-[#006948]/20 mt-1">
              <div className="w-10 h-10 rounded-full bg-[#006948] flex items-center justify-center text-white shrink-0 shadow-xs">
                <span className="material-symbols-outlined text-[22px]">check_circle</span>
              </div>
              <div className="flex flex-col text-xs">
                <span className="text-sm font-bold text-[#006948]">Processo Finalizado com Sucesso!</span>
                <span className="text-[#3d4a42] mt-0.5">
                  Ao clicar em <strong>"Cadastrar participantes"</strong>, os dados são gravados permanentemente no banco de dados do SRC e os certificados eletrônicos ficam prontos para geração e assinatura digital da Proex/Ifes.
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-5 bg-[#f2f3ff]">
            <div className="rounded-lg overflow-hidden border border-[#dae2fd] shadow-xs bg-white p-4">
              <div className="bg-[#006591] text-white p-3 rounded-lg flex items-center justify-between text-xs font-semibold mb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">check_circle</span>
                  <span>Arquivo importado com sucesso! Para prosseguir leia as instruções e em seguida cadastre os participantes.</span>
                </div>
                <span className="bg-white/20 px-2 py-0.5 rounded font-mono text-[11px]">38 Registros</span>
              </div>

              <div className="flex items-center gap-3">
                <button className="px-4 py-2 bg-[#006948] hover:bg-[#00855d] text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-2 ring-4 ring-[#85f8c4] animate-pulse">
                  <span className="material-symbols-outlined text-[18px]">done_all</span>
                  <span>✔ Cadastrar participantes (Clique Aqui!)</span>
                </button>
                <span className="text-xs text-[#3d4a42] font-mono">
                  ← Botão oficial do SRC para homologar a turma inteira.
                </span>
              </div>
            </div>
          </div>
        </article>
      </section>

      {/* Seção de Dúvidas & Recomendações Técnicas */}
      <section className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006591] text-[24px]">help_center</span>
            <h2 className="text-xl font-bold text-[#131b2e]">Dúvidas Frequentes &amp; Orientações Técnicas</h2>
          </div>
          <p className="text-xs text-[#3d4a42]">
            Recomendações técnicas homologadas pela equipe de Extensão para prevenir falhas de importação no SRC.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-xs border border-[#bccac0]/25 flex flex-col justify-between gap-3">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-[#131b2e] uppercase">CPFs com 11 dígitos</span>
              <h4 className="text-xs font-bold text-[#131b2e]">Preservação dos Zeros</h4>
              <p className="text-xs text-[#3d4a42]">
                Nosso conversor garante que CPFs iniciados em zero (ex: 012.345.678-90) mantenham todos os 11 algarismos válidos, evitando recusa pelo SRC.
              </p>
            </div>
            <div className="bg-[#f2f3ff] p-2 rounded text-[11px] text-[#006948] font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px]">check_circle</span>
              <span>Já tratado automaticamente</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-xs border border-[#bccac0]/25 flex flex-col justify-between gap-3">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-[#131b2e] uppercase">Acentuação Universal</span>
              <h4 className="text-xs font-bold text-[#131b2e]">Padrão UTF-8 Limpo</h4>
              <p className="text-xs text-[#3d4a42]">
                Caracteres e nomes acentuados (Ângelo, Conceição, José) são exportados sem caracteres quebrados ou corrompidos.
              </p>
            </div>
            <div className="bg-[#f2f3ff] p-2 rounded text-[11px] text-[#006948] font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px]">check_circle</span>
              <span>Compatível com banco SRC</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-xs border border-[#bccac0]/25 flex flex-col justify-between gap-3">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-[#131b2e] uppercase">Cabeçalhos Canônicos</span>
              <h4 className="text-xs font-bold text-[#131b2e]">Ordem das 7 Colunas</h4>
              <p className="text-xs text-[#3d4a42]">
                O arquivo gerado obedece estritamente: "Nome", "Nascimento", "CPF", "Email", "Carga horária", "Início" e "Fim".
              </p>
            </div>
            <div className="bg-[#f2f3ff] p-2 rounded text-[11px] text-[#006948] font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px]">check_circle</span>
              <span>Zero colunas faltantes</span>
            </div>
          </div>
        </div>
      </section>

      {/* Barra Inferior de Ação & Suporte */}
      <section className="bg-white rounded-xl p-5 shadow-xs border border-[#bccac0]/25 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={onBackToExport}
          className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-[#eaedff] hover:bg-[#dae2fd] text-[#131b2e] font-medium text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Voltar para Tela de Download (Passo 3)</span>
        </button>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setIsHelpModalOpen(true)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-[#eaedff] hover:bg-[#dae2fd] text-[#006591] font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">support_agent</span>
            <span>Suporte Proex / Dúvidas</span>
          </button>

          <a
            href="https://src.ifes.edu.br"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#006948] text-white hover:bg-[#00855d] text-xs font-semibold transition-all flex items-center justify-center gap-2 shadow-xs"
          >
            <span>Abrir Portal do SRC/Ifes em Nova Aba</span>
            <span className="material-symbols-outlined text-[18px]">launch</span>
          </a>
        </div>
      </section>

      {/* Modal de Suporte */}
      {isHelpModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl flex flex-col gap-4 border border-[#bccac0]/30 animate-in fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-[#eaedff]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006948] text-[24px]">school</span>
                <h3 className="text-base font-bold text-[#131b2e]">Canais Oficiais Proex / Ifes</h3>
              </div>
              <button
                onClick={() => setIsHelpModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#eaedff] flex items-center justify-center text-[#3d4a42] hover:text-[#131b2e] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <p className="text-xs text-[#3d4a42]">
              Caso encontre inconsistências no cadastro do processo ou necessite de orientações sobre a homologação de carga horária:
            </p>

            <div className="flex flex-col gap-1.5 text-xs font-mono bg-[#f2f3ff] p-4 rounded-lg text-[#131b2e]">
              <p><strong>E-mail Institucional:</strong> proex@ifes.edu.br</p>
              <p><strong>Coordenação Geral de Extensão:</strong> (27) 3357-7500</p>
              <p><strong>Suporte Técnico de TI:</strong> https://ti.suporte.ifes.edu.br/</p>
            </div>

            <button
              onClick={() => setIsHelpModalOpen(false)}
              className="w-full py-2 bg-[#006948] text-white rounded-lg text-xs font-semibold hover:bg-[#00855d] cursor-pointer"
            >
              Entendido, fechar canal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
