export interface StandardRecord {
  _id: string;
  nome: string;
  nascimento: string;
  cpf: string;
  email: string;
  cargaHoraria: string;
  inicio: string;
  fim: string;
  _original?: {
    [key: string]: any;
  };
  _errors?: {
    cpf?: string;
    nascimento?: string;
    inicio?: string;
    fim?: string;
    email?: string;
  };
}

export type TargetFieldKey = 'nome' | 'nascimento' | 'cpf' | 'email' | 'cargaHoraria' | 'inicio' | 'fim';

export interface TargetFieldDefinition {
  key: TargetFieldKey;
  targetHeader: string; // Exact text: e.g. "Carga horária", "Início"
  description: string;
  sampleInputHeader: string; // from the image: e.g. "Carga Horária", "Data Início"
  formatDescription: string;
  required: boolean;
}

export const TARGET_COLUMNS: TargetFieldDefinition[] = [
  {
    key: 'nome',
    targetHeader: 'Nome',
    description: 'Nome completo da pessoa participante',
    sampleInputHeader: 'Nome Completo',
    formatDescription: 'Texto limpo sem espaços duplicados',
    required: true,
  },
  {
    key: 'nascimento',
    targetHeader: 'Nascimento',
    description: 'Data de nascimento no formato DD/MM/AAAA',
    sampleInputHeader: 'Data de Nascimento',
    formatDescription: 'DD/MM/AAAA',
    required: true,
  },
  {
    key: 'cpf',
    targetHeader: 'CPF',
    description: 'CPF sem pontuação (apenas os 11 números)',
    sampleInputHeader: 'CPF',
    formatDescription: '11 dígitos numéricos',
    required: true,
  },
  {
    key: 'email',
    targetHeader: 'Email',
    description: 'Endereço de e-mail institucional ou pessoal',
    sampleInputHeader: 'Email',
    formatDescription: 'E-mail válido em minúsculas',
    required: true,
  },
  {
    key: 'cargaHoraria',
    targetHeader: 'Carga horária',
    description: 'Carga horária total (ex: 487)',
    sampleInputHeader: 'Carga Horária',
    formatDescription: 'Número inteiro de horas',
    required: true,
  },
  {
    key: 'inicio',
    targetHeader: 'Início',
    description: 'Data de início da atividade (DD/MM/AAAA)',
    sampleInputHeader: 'Data Início',
    formatDescription: 'DD/MM/AAAA',
    required: true,
  },
  {
    key: 'fim',
    targetHeader: 'Fim',
    description: 'Data de término da atividade (DD/MM/AAAA)',
    sampleInputHeader: 'Data Fim',
    formatDescription: 'DD/MM/AAAA',
    required: true,
  },
];

export type DelimiterType = 'tab' | 'semicolon' | 'comma';

export type QuoteStyle = 'all' | 'as-needed' | 'none';

export type LineEnding = 'crlf' | 'lf';

export interface ExportSettings {
  delimiter: DelimiterType;
  quoteStyle: QuoteStyle;
  lineEnding: LineEnding;
  cleanCpf: boolean; // strips dots and dashes
  standardizeDates: boolean; // format as DD/MM/YYYY
  filename: string;
  addBom: boolean; // UTF-8 BOM
}

export interface ColumnMapping {
  [sourceHeader: string]: TargetFieldKey | 'ignore';
}

export interface FileMetadata {
  filename: string;
  sheetName: string;
  availableSheets: string[];
  totalRows: number;
  totalColumns: number;
  fileSize: number;
}
