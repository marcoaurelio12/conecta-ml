import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DocumentCategory, DocumentFileType } from '@/types/document';

interface DocumentFiltersProps {
  categoryFilter: DocumentCategory | null;
  fileTypeFilter: DocumentFileType | null;
  onCategoryFilterChange: (value: DocumentCategory | null) => void;
  onFileTypeFilterChange: (value: DocumentFileType | null) => void;
  onClearFilters: () => void;
}

export const DocumentFilters: React.FC<DocumentFiltersProps> = ({
  categoryFilter,
  fileTypeFilter,
  onCategoryFilterChange,
  onFileTypeFilterChange,
  onClearFilters,
}) => {
  // Values come straight from the domain type so filters can never drift from
  // the data (the old hard-coded English list matched nothing).
  const categories: DocumentCategory[] = ['Política', 'Modelo', 'Formulário', 'Guia', 'Relatório'];
  const fileTypes: DocumentFileType[] = ['PDF', 'DOCX', 'XLSX', 'PPT', 'TXT'];

  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-muted/30 p-4 sm:flex-row">
      <div className="flex-1">
        <Label htmlFor="category-filter" className="mb-2 block text-sm font-medium">
          Categoria
        </Label>
        <Select
          value={categoryFilter || 'all'}
          onValueChange={(value) => onCategoryFilterChange(value === 'all' ? null : (value as DocumentCategory))}
        >
          <SelectTrigger id="category-filter" className="w-full">
            <SelectValue placeholder="Todas as Categorias" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as Categorias</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1">
        <Label htmlFor="filetype-filter" className="mb-2 block text-sm font-medium">
          Tipo de Ficheiro
        </Label>
        <Select
          value={fileTypeFilter || 'all'}
          onValueChange={(value) => onFileTypeFilterChange(value === 'all' ? null : (value as DocumentFileType))}
        >
          <SelectTrigger id="filetype-filter" className="w-full">
            <SelectValue placeholder="Todos os Tipos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Tipos de Ficheiro</SelectItem>
            {fileTypes.map((fileType) => (
              <SelectItem key={fileType} value={fileType}>
                {fileType}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-end">
        <Button
          variant="ghost"
          className="h-10 px-2 text-muted-foreground"
          onClick={onClearFilters}
          disabled={!categoryFilter && !fileTypeFilter}
        >
          <X className="mr-2 h-4 w-4" aria-hidden="true" />
          Limpar Filtros
        </Button>
      </div>
    </div>
  );
};
