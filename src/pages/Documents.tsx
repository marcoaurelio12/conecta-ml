
import React, { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, HelpCircle, ArrowDown, ArrowUp } from 'lucide-react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Link } from 'react-router-dom';
import { Document } from '@/types/document';
import { documentData } from '@/data/documentData';
import { DocumentItem } from '@/components/documents/DocumentItem';
import { DocumentFilters } from '@/components/documents/DocumentFilters';
import { KeyboardShortcutsDialog } from '@/components/documents/KeyboardShortcutsDialog';
import { useDebounce } from '@/hooks/useDebounce';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';

type SortField = 'title' | 'dateUploaded';
type SortOrder = 'asc' | 'desc';

const Documents = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [fileTypeFilter, setFileTypeFilter] = useState<string | null>(null);
  const [showHelpDialog, setShowHelpDialog] = useState<boolean>(false);
  const [sortField, setSortField] = useState<SortField>('dateUploaded');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [documents, setDocuments] = useState<Document[]>(documentData);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const { toast } = useToast();

  const { data, isLoading } = useQuery({
    queryKey: ['documents', debouncedSearchQuery, categoryFilter, fileTypeFilter, sortField, sortOrder],
    queryFn: () => {
      // In a real app, this would be an API call
      // For now, we'll filter and sort the static data
      let filteredDocs = [...documentData];

      if (debouncedSearchQuery) {
        const query = debouncedSearchQuery.toLowerCase();
        filteredDocs = filteredDocs.filter(
          doc =>
            doc.title.toLowerCase().includes(query) ||
            doc.summary.toLowerCase().includes(query) ||
            doc.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }

      if (categoryFilter) {
        filteredDocs = filteredDocs.filter(doc => doc.category === categoryFilter);
      }

      if (fileTypeFilter) {
        filteredDocs = filteredDocs.filter(doc => doc.fileType === fileTypeFilter);
      }

      // Sort the documents
      filteredDocs.sort((a, b) => {
        if (sortField === 'title') {
          return sortOrder === 'asc'
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
        } else {
          return sortOrder === 'asc'
            ? new Date(a.dateUploaded).getTime() - new Date(b.dateUploaded).getTime()
            : new Date(b.dateUploaded).getTime() - new Date(a.dateUploaded).getTime();
        }
      });

      return filteredDocs;
    },
  });

  useEffect(() => {
    if (data) {
      setDocuments(data);
    }
  }, [data]);

  // Register keyboard shortcuts
  useKeyboardShortcut('/', (e) => {
    e.preventDefault();
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  });

  useKeyboardShortcut('?', (e) => {
    e.preventDefault();
    setShowHelpDialog(true);
  });

  const handleToggleBookmark = (docId: string) => {
    setDocuments(prevDocs =>
      prevDocs.map(doc => {
        if (doc.id === docId) {
          const newIsBookmarked = !doc.isBookmarked;
          toast({
            title: newIsBookmarked ? "Documento marcado" : "Marcação removida",
            description: `Marcação ${newIsBookmarked ? "adicionada" : "removida"} para "${doc.title}"`,
          });
          return { ...doc, isBookmarked: newIsBookmarked };
        }
        return doc;
      })
    );
  };

  const handleSortChange = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const clearFilters = () => {
    setCategoryFilter(null);
    setFileTypeFilter(null);
  };

  return (
    <DashboardLayout>
      <div className="container max-w-6xl mx-auto p-4">

        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Biblioteca de Documentos</h1>
            <Button variant="ghost" size="icon" onClick={() => setShowHelpDialog(true)} aria-label="Ajuda">
              <HelpCircle className="h-5 w-5" />
            </Button>
          </div>

          {/* Hero search section */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              ref={searchInputRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar documentos…"
              className="pl-10 h-12 text-lg"
              aria-label="Pesquisar documentos"
            />
          </div>

          <DocumentFilters
            categoryFilter={categoryFilter}
            fileTypeFilter={fileTypeFilter}
            onCategoryFilterChange={setCategoryFilter}
            onFileTypeFilterChange={setFileTypeFilter}
            onClearFilters={clearFilters}
          />

          {/* Sorting controls */}
          <div className="flex justify-between items-center border-b pb-2">
            <div className="text-sm text-muted-foreground">
              {documents.length} {documents.length === 1 ? 'documento' : 'documentos'} encontrado(s)
            </div>
            <div className="flex gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-sm font-normal"
                onClick={() => handleSortChange('title')}
              >
                Título
                {sortField === 'title' && (
                  sortOrder === 'asc' ? <ArrowUp className="ml-1 h-4 w-4" /> : <ArrowDown className="ml-1 h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-sm font-normal"
                onClick={() => handleSortChange('dateUploaded')}
              >
                Data de Carregamento
                {sortField === 'dateUploaded' && (
                  sortOrder === 'asc' ? <ArrowUp className="ml-1 h-4 w-4" /> : <ArrowDown className="ml-1 h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Document list */}
          <div className="flex flex-col divide-y">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="py-4 flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-md" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <div className="flex gap-2 mt-2">
                      <Skeleton className="h-6 w-16 rounded-full" />
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-9 w-9 rounded-md" />
                    <Skeleton className="h-9 w-9 rounded-md" />
                    <Skeleton className="h-9 w-9 rounded-md" />
                  </div>
                </div>
              ))
            ) : documents.length > 0 ? (
              documents.map((doc) => (
                <DocumentItem 
                  key={doc.id} 
                  document={doc} 
                  onToggleBookmark={handleToggleBookmark} 
                />
              ))
            ) : (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">Nenhum documento encontrado para os seus critérios de pesquisa.</p>
                <Button
                  variant="link"
                  onClick={() => {
                    setSearchQuery('');
                    clearFilters();
                  }}
                >
                  Limpar todos os filtros
                </Button>
              </div>
            )}
          </div>
        </div>

        <KeyboardShortcutsDialog
          open={showHelpDialog}
          onOpenChange={setShowHelpDialog}
        />
      </div>
    </DashboardLayout>
  );
};

export default Documents;
