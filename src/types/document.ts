
export type DocumentCategory = 'Política' | 'Modelo' | 'Formulário' | 'Guia' | 'Relatório';

export type DocumentFileType = 'PDF' | 'DOCX' | 'XLSX' | 'PPT' | 'TXT';

export interface Document {
  id: string;
  title: string;
  summary: string;
  dateUploaded: string;
  category: DocumentCategory;
  fileType: DocumentFileType;
  tags: string[];
  url: string;
  isBookmarked: boolean;
}
