import { StandardRecord } from '../types';

// Totalmente fictício e em conformidade com a LGPD (sem nomes, CPFs ou e-mails de pessoas reais)
export const RAW_SAMPLE_PROMPT_CSV = `"Nome"\t"Nascimento"\t"CPF"\t"Email"\t"Carga horária"\t"Início"\t"Fim"
"Participante Exemplo Alfa"\t"14/03/1995"\t"12498210743"\t"participante.alfa@ifes.edu.br"\t"60"\t"01/02/2024"\t"15/06/2024"
"Estudante Fictício Beta"\t"22/07/1998"\t"09873421755"\t"estudante.beta@ifes.edu.br"\t"60"\t"01/02/2024"\t"15/06/2024"
"Discente Modelo Gama"\t"09/11/2001"\t"13455678790"\t"discente.gama@ifes.edu.br"\t"60"\t"01/02/2024"\t"15/06/2024"
"Bolsista Simulado Delta"\t"30/05/1993"\t"05231940712"\t"bolsista.delta@ifes.edu.br"\t"60"\t"01/02/2024"\t"15/06/2024"
"Pesquisador Convidado Épsilon"\t"12/10/1988"\t"16744290708"\t"pesquisador.epsilon@ifes.edu.br"\t"60"\t"01/02/2024"\t"15/06/2024"`;

export const SAMPLE_INPUT_RECORDS: StandardRecord[] = [
  {
    _id: 'sample-1',
    nome: 'Participante Exemplo Alfa',
    nascimento: '14/03/1995',
    cpf: '12498210743',
    email: 'participante.alfa@ifes.edu.br',
    cargaHoraria: '60',
    inicio: '01/02/2024',
    fim: '15/06/2024',
    _original: {
      'Nome Completo': 'Participante Exemplo Alfa',
      'Data de Nascimento': '14/03/1995',
      'CPF': '124.982.107-43',
      'Email': 'participante.alfa@ifes.edu.br',
      'Carga Horária': 60,
      'Data Início': '01/02/2024',
      'Data Fim': '15/06/2024',
    },
  },
  {
    _id: 'sample-2',
    nome: 'Estudante Fictício Beta',
    nascimento: '22/07/1998',
    cpf: '09873421755',
    email: 'estudante.beta@ifes.edu.br',
    cargaHoraria: '60',
    inicio: '01/02/2024',
    fim: '15/06/2024',
    _original: {
      'Nome Completo': 'Estudante Fictício Beta',
      'Data de Nascimento': '22/07/1998',
      'CPF': '098.734.217-55',
      'Email': 'estudante.beta@ifes.edu.br',
      'Carga Horária': 60,
      'Data Início': '01/02/2024',
      'Data Fim': '15/06/2024',
    },
  },
  {
    _id: 'sample-3',
    nome: 'Discente Modelo Gama',
    nascimento: '09/11/2001',
    cpf: '13455678790',
    email: 'discente.gama@ifes.edu.br',
    cargaHoraria: '60',
    inicio: '01/02/2024',
    fim: '15/06/2024',
    _original: {
      'Nome Completo': 'Discente Modelo Gama',
      'Data de Nascimento': '09/11/2001',
      'CPF': '134.556.787-90',
      'Email': 'discente.gama@ifes.edu.br',
      'Carga Horária': 60,
      'Data Início': '01/02/2024',
      'Data Fim': '15/06/2024',
    },
  },
  {
    _id: 'sample-4',
    nome: 'Bolsista Simulado Delta',
    nascimento: '30/05/1993',
    cpf: '05231940712',
    email: 'bolsista.delta@ifes.edu.br',
    cargaHoraria: '60',
    inicio: '01/02/2024',
    fim: '15/06/2024',
    _original: {
      'Nome Completo': 'Bolsista Simulado Delta',
      'Data de Nascimento': '30/05/1993',
      'CPF': '052.319.407-12',
      'Email': 'bolsista.delta@ifes.edu.br',
      'Carga Horária': 60,
      'Data Início': '01/02/2024',
      'Data Fim': '15/06/2024',
    },
  },
  {
    _id: 'sample-5',
    nome: 'Pesquisador Convidado Épsilon',
    nascimento: '12/10/1988',
    cpf: '16744290708',
    email: 'pesquisador.epsilon@ifes.edu.br',
    cargaHoraria: '60',
    inicio: '01/02/2024',
    fim: '15/06/2024',
    _original: {
      'Nome Completo': 'Pesquisador Convidado Épsilon',
      'Data de Nascimento': '12/10/1988',
      'CPF': '167.442.907-08',
      'Email': 'pesquisador.epsilon@ifes.edu.br',
      'Carga Horária': 60,
      'Data Início': '01/02/2024',
      'Data Fim': '15/06/2024',
    },
  },
];
