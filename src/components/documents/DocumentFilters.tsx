
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

interface DocumentFiltersProps {
  categoryFilter: string | null;
  fileTypeFilter: string | null;
  onCategoryFilterChange: (value: string | null) => void;
  onFileTypeFilterChange: (value: string | null) => void;
  onClearFilters: () => void;
}

export const DocumentFilters: React.FC<DocumentFiltersProps> = ({
  categoryFilter,
  fileTypeFilter,
  onCategoryFilterChange,
  onFileTypeFilterChange,
  onClearFilters,
}) => {
  const categories = ['Policy', 'Template', 'Form', 'Guide', 'Report'];
  const fileTypes = ['PDF', 'DOCX', 'XLSX', 'PPT', 'TXT'];

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-muted/30 rounded-lg">
      <div className="flex-1">
        <Label htmlFor="category-filter" className="mb-2 block text-sm font-medium">
          Categoria
        </Label>
        <Select
          value={categoryFilter || ''}
          onValueChange={(value) => onCategoryFilterChange(value === "all" ? null : value)}
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
          value={fileTypeFilter || ''}
          onValueChange={(value) => onFileTypeFilterChange(value === "all" ? null : value)}
        >
          <SelectTrigger id="filetype-filter" className="w-full">
            <SelectValue placeholder="All File Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Tipos de Ficheiros</SelectItem>
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
          className="h-10 px-2"
          onClick={onClearFilters}
          disabled={!categoryFilter && !fileTypeFilter}
        >
          <X className="mr-2 h-4 w-4" />
          Limpar Filtros
        </Button>
      </div>
    </div>
  );
};
