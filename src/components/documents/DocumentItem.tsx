
import React from 'react';
import { Document } from '@/types/document';
import { FileText, FileType, Download, Bookmark, BookmarkPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface DocumentItemProps {
  document: Document;
  onToggleBookmark: (id: string) => void;
}

const fileTypeIcons = {
  PDF: <FileText className="h-6 w-6 text-portugalPalette-dark-blue-1" />,
  DOCX: <FileText className="h-6 w-6 text-portugalPalette-blue" />,
  XLSX: <FileText className="h-6 w-6 text-portugalPalette-light-blue-2" />,
  PPT: <FileText className="h-6 w-6 text-portugalPalette-light-blue-1" />,
  TXT: <FileText className="h-6 w-6 text-foreground" />,
};

export const DocumentItem: React.FC<DocumentItemProps> = ({ document, onToggleBookmark }) => {
  return (
    <div className="flex items-start space-x-4 p-4 hover:bg-muted/50 rounded-md transition-colors">
      <div className="flex-shrink-0 mt-1">
        {fileTypeIcons[document.fileType]}
      </div>
      
      <div className="flex-grow min-w-0">
        <h3 className="text-base font-medium leading-tight mb-1">{document.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
          {document.summary}
        </p>
        
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="outline" className="bg-primary/10">{document.category}</Badge>
          <Badge variant="outline" className="bg-secondary/10">{document.fileType}</Badge>
          {document.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="bg-muted">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      
      <div className="flex-shrink-0 flex items-center space-x-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-11 w-11" aria-label="Ver documento">
              <FileType className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Ver</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-11 w-11" aria-label="Descarregar documento">
              <Download className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Descarregar</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-11 w-11" 
              onClick={() => onToggleBookmark(document.id)}
              aria-label={document.isBookmarked ? "Remover marcador" : "Adicionar marcador"}
            >
              {document.isBookmarked ? 
                <Bookmark className="h-5 w-5 fill-current" /> : 
                <BookmarkPlus className="h-5 w-5" />
              }
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {document.isBookmarked ? "Remover marcador" : "Adicionar marcador"}
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};
