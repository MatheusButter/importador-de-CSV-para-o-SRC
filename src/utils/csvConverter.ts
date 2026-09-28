import * as XLSX from 'xlsx';
import {
  StandardRecord,
  TargetFieldKey,
  TARGET_COLUMNS,
  ExportSettings,
  ColumnMapping,
  FileMetadata,
} from '../types';

// Helper: Normalize string for fuzzy header comparison
export function normalizeHeader(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, '');
}

// Clean and pad CPF to exactly 11 numeric digits
export function cleanCpf(rawCpf: any): string {
  if (rawCpf === undefined || rawCpf === null) return '';
  const digitsOnly = String(rawCpf).replace(/\D/g, '');
  if (!digitsOnly) return '';
  // If digits are between 1 and 11, pad with leading zeros
  if (digitsOnly.length <= 11) {
    return digitsOnly.padStart(11, '0');
  }
  return digitsOnly;
}

// CPF Checksum validator for Brazilian standard CPF
export function isValidCpf(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, '');
  if (digits.length !== 11) return false;
  
  // Reject repetitive numbers like 111.111.111-11
  if (/^(\d)\1{10}$/.test(digits)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(digits.charAt(i), 10) * (10 - i);
  }
  let rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(digits.charAt(9), 10)) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(digits.charAt(i), 10) * (11 - i);
  }
  rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(digits.charAt(10), 10)) return false;

  return true;
}

// Format raw date into DD/MM/YYYY
export function formatToDateBr(value: any): string {
  if (value === undefined || value === null || value === '') return '';

  // If already a Date object
  if (value instanceof Date && !isNaN(value.getTime())) {
    const day = String(value.getUTCDate()).padStart(2, '0');
    const month = String(value.getUTCMonth() + 1).padStart(2, '0');
    const year = value.getUTCFullYear();
    return `${day}/${month}/${year}`;
  }

  // If string
  const str = String(value).trim();

  // If compact digits like 04101997 or 4101997
  const digitsOnly = str.replace(/\D/g, '');
  if (digitsOnly.length === 8 && !str.includes('/') && !str.includes('-') && !str.includes('.')) {
    const day = digitsOnly.slice(0, 2);
    const month = digitsOnly.slice(2, 4);
    const year = digitsOnly.slice(4, 8);
    return `${day}/${month}/${year}`;
  }

  // If in format DD/MM/YYYY or DD-MM-YYYY
  const brMatch = str.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{2,4})$/);
  if (brMatch) {
    const day = brMatch[1].padStart(2, '0');
    const month = brMatch[2].padStart(2, '0');
    let year = brMatch[3];
    if (year.length === 2) {
      year = parseInt(year, 10) > 40 ? `19${year}` : `20${year}`;
    }
    return `${day}/${month}/${year}`;
  }

  // If in ISO format YYYY-MM-DD
  const isoMatch = str.match(/^(\d{4})[/.-](\d{1,2})[/.-](\d{1,2})$/);
  if (isoMatch) {
    const year = isoMatch[1];
    const month = isoMatch[2].padStart(2, '0');
    const day = isoMatch[3].padStart(2, '0');
    return `${day}/${month}/${year}`;
  }

  // If Excel serial number (days since 1899-12-30)
  if (typeof value === 'number' || (!isNaN(Number(str)) && Number(str) > 20000 && Number(str) < 70000)) {
    const serial = Number(str);
    const parsedDate = XLSX.SSF.parse_date_code(serial);
    if (parsedDate) {
      const day = String(parsedDate.d).padStart(2, '0');
      const month = String(parsedDate.m).padStart(2, '0');
      const year = parsedDate.y;
      return `${day}/${month}/${year}`;
    }
  }

  return str;
}

// Automatically formats typed date strings: supports "04101997" -> "04/10/1997", "04/10/1997", etc.
export function maskDateInput(val: string): string {
  if (!val) return '';
  // Keep only digits and existing slashes
  const cleaned = val.replace(/[^\d/]/g, '');

  // If user pasted or typed pure digits
  const digits = cleaned.replace(/\D/g, '');
  if (digits.length <= 2) {
    return digits;
  }
  if (digits.length <= 4) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
}

// Clean hours
export function cleanHours(val: any): string {
  if (val === undefined || val === null || val === '') return '';
  const str = String(val).trim();
  // If float like "487.0", parse to integer
  if (/^\d+\.0+$/.test(str)) {
    return str.split('.')[0];
  }
  return str;
}

// Auto-detect which target field matches a given sheet header
export function autoDetectFieldMapping(sourceHeader: string): TargetFieldKey | 'ignore' {
  const norm = normalizeHeader(sourceHeader);

  // Nome Completo
  if (
    norm === 'nomecompleto' ||
    norm === 'nome' ||
    norm.includes('nomecompleto') ||
    norm.includes('aluno') ||
    norm.includes('participante') ||
    norm.includes('estudante') ||
    norm.includes('servidor') ||
    norm.includes('docente')
  ) {
    return 'nome';
  }

  // Data de Nascimento
  if (
    norm === 'datanascimento' ||
    norm === 'datadenascimento' ||
    norm === 'nascimento' ||
    norm === 'dtnascimento' ||
    norm === 'dtnasc' ||
    norm.includes('nasc')
  ) {
    return 'nascimento';
  }

  // CPF
  if (
    norm === 'cpf' ||
    norm === 'numcpf' ||
    norm === 'doccpf' ||
    norm.includes('cpf')
  ) {
    return 'cpf';
  }

  // Email
  if (
    norm === 'email' ||
    norm === 'correioeletronico' ||
    norm === 'contato' ||
    norm.includes('mail')
  ) {
    return 'email';
  }

  // Carga Horária
  if (
    norm === 'cargahoraria' ||
    norm === 'ch' ||
    norm === 'horas' ||
    norm === 'chtotal' ||
    norm.includes('cargahor') ||
    norm.includes('horaria')
  ) {
    return 'cargaHoraria';
  }

  // Data Início
  if (
    norm === 'datainicio' ||
    norm === 'inicio' ||
    norm === 'dtinicio' ||
    norm.includes('inicio') ||
    norm.includes('datainic')
  ) {
    return 'inicio';
  }

  // Data Fim
  if (
    norm === 'datafim' ||
    norm === 'datatermino' ||
    norm === 'fim' ||
    norm === 'termino' ||
    norm === 'dtfim' ||
    norm.includes('fim') ||
    norm.includes('termino')
  ) {
    return 'fim';
  }

  return 'ignore';
}

// Parse Spreadsheet file (.ods, .xlsx, .csv, etc.)
export async function parseSpreadsheetFile(file: File): Promise<{
  metadata: FileMetadata;
  headers: string[];
  mapping: ColumnMapping;
  records: StandardRecord[];
  workbook: XLSX.WorkBook;
}> {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, {
    type: 'array',
    cellDates: true,
    raw: false,
    dateNF: 'dd/mm/yyyy',
  });

  const availableSheets = workbook.SheetNames;
  if (availableSheets.length === 0) {
    throw new Error('O arquivo não contém nenhuma planilha.');
  }

  const sheetName = availableSheets[0];
  const worksheet = workbook.Sheets[sheetName];

  // Convert worksheet to JSON rows array (2D array to inspect headers safely)
  const rows = XLSX.utils.sheet_to_json<any[]>(worksheet, {
    header: 1,
    defval: '',
    blankrows: false,
  });

  if (rows.length === 0) {
    throw new Error('A planilha está vazia.');
  }

  // Detect header row (first non-empty row)
  let headerRowIndex = 0;
  for (let i = 0; i < Math.min(rows.length, 5); i++) {
    const row = rows[i];
    if (Array.isArray(row) && row.some((cell) => cell !== '')) {
      headerRowIndex = i;
      break;
    }
  }

  const rawHeaders: string[] = (rows[headerRowIndex] || []).map((h: any, idx: number) => {
    const str = String(h ?? '').trim();
    return str || `Coluna_${idx + 1}`;
  });

  // Auto detect mapping for each source header
  const mapping: ColumnMapping = {};
  rawHeaders.forEach((h) => {
    mapping[h] = autoDetectFieldMapping(h);
  });

  // Extract records from rows below header
  const records = extractRecordsFromRows(rows.slice(headerRowIndex + 1), rawHeaders, mapping);

  const metadata: FileMetadata = {
    filename: file.name,
    sheetName,
    availableSheets,
    totalRows: records.length,
    totalColumns: rawHeaders.length,
    fileSize: file.size,
  };

  return {
    metadata,
    headers: rawHeaders,
    mapping,
    records,
    workbook,
  };
}

// Convert 2D row array to StandardRecord list using column mapping
export function extractRecordsFromRows(
  dataRows: any[][],
  headers: string[],
  mapping: ColumnMapping
): StandardRecord[] {
  const records: StandardRecord[] = [];

  dataRows.forEach((row, rowIndex) => {
    // Check if row has any non-empty data
    const hasData = row.some((c) => c !== undefined && c !== null && String(c).trim() !== '');
    if (!hasData) return;

    const record: StandardRecord = {
      _id: `rec-${rowIndex + 1}`,
      nome: '',
      nascimento: '',
      cpf: '',
      email: '',
      cargaHoraria: '',
      inicio: '',
      fim: '',
      _original: {},
      _errors: {},
    };

    headers.forEach((header, colIndex) => {
      const cellValue = row[colIndex];
      record._original![header] = cellValue;

      const mappedTarget = mapping[header];
      if (mappedTarget && mappedTarget !== 'ignore') {
        applyMappedValue(record, mappedTarget, cellValue);
      }
    });

    // Validate CPF
    if (record.cpf) {
      if (!isValidCpf(record.cpf)) {
        record._errors = record._errors || {};
        record._errors.cpf = 'CPF inválido';
      }
    } else {
      record._errors = record._errors || {};
      record._errors.cpf = 'CPF ausente';
    }

    records.push(record);
  });

  return records;
}

// Set field value into standard record
export function applyMappedValue(record: StandardRecord, target: TargetFieldKey, rawVal: any) {
  switch (target) {
    case 'nome':
      record.nome = String(rawVal ?? '').replace(/\s+/g, ' ').trim();
      break;
    case 'nascimento':
      record.nascimento = formatToDateBr(rawVal);
      break;
    case 'cpf':
      record.cpf = cleanCpf(rawVal);
      break;
    case 'email':
      record.email = String(rawVal ?? '').trim();
      break;
    case 'cargaHoraria':
      record.cargaHoraria = cleanHours(rawVal);
      break;
    case 'inicio':
      record.inicio = formatToDateBr(rawVal);
      break;
    case 'fim':
      record.fim = formatToDateBr(rawVal);
      break;
  }
}

// Generate CSV string with strict compliance with user target format
export function generateCsvString(
  records: StandardRecord[],
  settings: ExportSettings
): string {
  const delimiterChar =
    settings.delimiter === 'tab' ? '\t' : settings.delimiter === 'semicolon' ? ';' : ',';
  const lineEndingStr = settings.lineEnding === 'crlf' ? '\r\n' : '\n';

  // Format a single cell value according to quote style
  const formatCell = (val: string): string => {
    const str = String(val ?? '');

    if (settings.quoteStyle === 'all') {
      // In the user's example, every value is surrounded by quotes: "João Paulo Pereira"
      return `"${str.replace(/"/g, '""')}"`;
    }

    if (settings.quoteStyle === 'as-needed') {
      if (str.includes(delimiterChar) || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    }

    // 'none'
    return str.replace(/"/g, '');
  };

  // Header row: exactly ["Nome", "Nascimento", "CPF", "Email", "Carga horária", "Início", "Fim"]
  const headers = TARGET_COLUMNS.map((col) => formatCell(col.targetHeader));
  const headerLine = headers.join(delimiterChar);

  // Data rows
  const dataLines = records.map((rec) => {
    const cpfVal = settings.cleanCpf ? cleanCpf(rec.cpf) : rec.cpf;
    const nascVal = settings.standardizeDates ? formatToDateBr(rec.nascimento) : rec.nascimento;
    const iniVal = settings.standardizeDates ? formatToDateBr(rec.inicio) : rec.inicio;
    const fimVal = settings.standardizeDates ? formatToDateBr(rec.fim) : rec.fim;

    const rowValues = [
      formatCell(rec.nome),
      formatCell(nascVal),
      formatCell(cpfVal),
      formatCell(rec.email),
      formatCell(rec.cargaHoraria),
      formatCell(iniVal),
      formatCell(fimVal),
    ];
    return rowValues.join(delimiterChar);
  });

  const fullContent = [headerLine, ...dataLines].join(lineEndingStr);
  return settings.addBom ? '\uFEFF' + fullContent : fullContent;
}

// Download file utility
export function downloadFile(content: string, filename: string, mimeType: string = 'text/csv;charset=utf-8;') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Generate sample .ODS file using SheetJS and trigger download
export function downloadSampleOdsSpreadsheet() {
  const sampleData = [
    {
      'Nome Completo': 'Participante Exemplo Alfa',
      'Data de Nascimento': '14/03/1995',
      'CPF': '124.982.107-43',
      'Email': 'participante.alfa@ifes.edu.br',
      'Carga Horária': 60,
      'Data Início': '01/02/2024',
      'Data Fim': '15/06/2024',
    },
    {
      'Nome Completo': 'Estudante Fictício Beta',
      'Data de Nascimento': '22/07/1998',
      'CPF': '098.734.217-55',
      'Email': 'estudante.beta@ifes.edu.br',
      'Carga Horária': 60,
      'Data Início': '01/02/2024',
      'Data Fim': '15/06/2024',
    },
    {
      'Nome Completo': 'Discente Modelo Gama',
      'Data de Nascimento': '09/11/2001',
      'CPF': '134.556.787-90',
      'Email': 'discente.gama@ifes.edu.br',
      'Carga Horária': 60,
      'Data Início': '01/02/2024',
      'Data Fim': '15/06/2024',
    },
    {
      'Nome Completo': 'Bolsista Simulado Delta',
      'Data de Nascimento': '30/05/1993',
      'CPF': '052.319.407-12',
      'Email': 'bolsista.delta@ifes.edu.br',
      'Carga Horária': 60,
      'Data Início': '01/02/2024',
      'Data Fim': '15/06/2024',
    },
    {
      'Nome Completo': 'Pesquisador Convidado Épsilon',
      'Data de Nascimento': '12/10/1988',
      'CPF': '167.442.907-08',
      'Email': 'pesquisador.epsilon@ifes.edu.br',
      'Carga Horária': 60,
      'Data Início': '01/02/2024',
      'Data Fim': '15/06/2024',
    },
  ];

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(sampleData);
  XLSX.utils.book_append_sheet(wb, ws, 'Planilha1');

  // Write ODS binary
  const odsArray = XLSX.write(wb, { bookType: 'ods', type: 'array' });
  const blob = new Blob([odsArray], {
    type: 'application/vnd.oasis.opendocument.spreadsheet',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'planilha_modelo_exemplo.ods';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
