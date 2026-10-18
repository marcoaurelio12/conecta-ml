import React from 'react';
import { Document } from '@/types/document';
import { FileText, Download, Bookmark, BookmarkPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface DocumentItemProps {
  document: Document;
  onToggleBookmark: (id: string) => void;
  onDownload: (document: Document) => void;
}

export const DocumentItem: React.FC<DocumentItemProps> = ({
  document,
  onToggleBookmark,
  onDownload,
}) => {
  return (
    <div className="flex items-start gap-4 rounded-md p-4 transition-colors duration-fast hover:bg-muted/50">
      <div className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary" aria-hidden="true">
        <FileText className="size-5" />
      </div>

      <div className="min-w-0 flex-grow">
        <h3 className="mb-1 text-base font-medium leading-tight">{document.title}</h3>
        <p className="mb-2 line-clamp-2 text-sm text-muted-foreground">{document.summary}</p>

        <div className="mt-2 flex flex-wrap gap-2">
          <Badge variant="outline" className="bg-primary/10">{document.category}</Badge>
          <Badge variant="outline">{document.fileType}</Badge>
          {document.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="font-normal">{tag}</Badge>
          ))}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-11"
              onClick={() => onDownload(document)}
              aria-label={`Descarregar ${document.title}`}
            >
              <Download className="size-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Descarregar</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-11"
              onClick={() => onToggleBookmark(document.id)}
              aria-label={document.isBookmarked ? `Remover marcador de ${document.title}` : `Marcar ${document.title}`}
              aria-pressed={document.isBookmarked}
            >
              {document.isBookmarked ?
                <Bookmark className="size-5 fill-current text-primary" /> :
                <BookmarkPlus className="size-5" />
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
