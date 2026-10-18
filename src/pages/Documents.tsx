import { useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Search, HelpCircle, ArrowDown, ArrowUp } from "lucide-react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Document, DocumentCategory, DocumentFileType } from "@/types/document";
import { documentData } from "@/data/documentData";
import { DocumentItem } from "@/components/documents/DocumentItem";
import { DocumentFilters } from "@/components/documents/DocumentFilters";
import { KeyboardShortcutsDialog } from "@/components/documents/KeyboardShortcutsDialog";
import { useDebounce } from "@/hooks/useDebounce";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { usePersistentState } from "@/hooks/usePersistentState";

type SortField = "title" | "dateUploaded";
type SortOrder = "asc" | "desc";

const bookmarksStorageKey = "conecta.bookmarks.v1";

const Documents = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<DocumentCategory | null>(null);
  const [fileTypeFilter, setFileTypeFilter] = useState<DocumentFileType | null>(null);
  const [showHelpDialog, setShowHelpDialog] = useState<boolean>(false);
  const [sortField, setSortField] = useState<SortField>("dateUploaded");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  // Bookmark overrides persist per user; the fixture value is the default.
  const [bookmarks, setBookmarks] = usePersistentState<Record<string, boolean>>(
    bookmarksStorageKey,
    {}
  );
  const searchInputRef = useRef<HTMLInputElement>(null);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // One data path through react-query — the local copy + useEffect is gone.
  const { data: documents = [], isLoading } = useQuery({
    queryKey: ["documents", debouncedSearchQuery, categoryFilter, fileTypeFilter, sortField, sortOrder],
    queryFn: () => {
      let filteredDocs = [...documentData];

      if (debouncedSearchQuery) {
        const query = debouncedSearchQuery.toLowerCase();
        filteredDocs = filteredDocs.filter(
          (doc) =>
            doc.title.toLowerCase().includes(query) ||
            doc.summary.toLowerCase().includes(query) ||
            doc.tags.some((tag) => tag.toLowerCase().includes(query))
        );
      }

      if (categoryFilter) {
        filteredDocs = filteredDocs.filter((doc) => doc.category === categoryFilter);
      }

      if (fileTypeFilter) {
        filteredDocs = filteredDocs.filter((doc) => doc.fileType === fileTypeFilter);
      }

      filteredDocs.sort((a, b) => {
        if (sortField === "title") {
          return sortOrder === "asc"
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
        }
        return sortOrder === "asc"
          ? new Date(a.dateUploaded).getTime() - new Date(b.dateUploaded).getTime()
          : new Date(b.dateUploaded).getTime() - new Date(a.dateUploaded).getTime();
      });

      return filteredDocs;
    },
  });

  // Register keyboard shortcuts
  useKeyboardShortcut("/", (e) => {
    e.preventDefault();
    searchInputRef.current?.focus();
  });

  useKeyboardShortcut("?", (e) => {
    e.preventDefault();
    setShowHelpDialog(true);
  });

  const withBookmarks = useMemo(
    () => documents.map((doc) => ({ ...doc, isBookmarked: bookmarks[doc.id] ?? doc.isBookmarked })),
    [documents, bookmarks]
  );

  const handleToggleBookmark = (docId: string) => {
    const doc = withBookmarks.find((d) => d.id === docId);
    setBookmarks((current) => ({ ...current, [docId]: !(current[docId] ?? doc?.isBookmarked ?? false) }));
    if (doc) {
      const nowBookmarked = !(bookmarks[docId] ?? doc.isBookmarked);
      toast[nowBookmarked ? "success" : "info"](
        nowBookmarked ? `Marcador adicionado a “${doc.title}”.` : `Marcador removido de “${doc.title}”.`
      );
    }
  };

  const handleDownload = (doc: Document) => {
    // Mock download until the document API exists.
    toast.info(`A descarregar “${doc.title}”…`);
  };

  const handleSortChange = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const clearFilters = () => {
    setCategoryFilter(null);
    setFileTypeFilter(null);
  };

  return (
    <DashboardLayout>
      <div>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Biblioteca de Documentos</h1>
            <p className="mt-1 text-muted-foreground">
              Políticas, modelos e formulários num único sítio.
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowHelpDialog(true)}
            aria-label="Ver atalhos de teclado"
          >
            <HelpCircle className="size-5" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative mt-6">
          <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={searchInputRef}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar documentos…"
            className="h-12 pl-10 text-base"
            aria-label="Pesquisar documentos"
          />
        </div>

        <div className="mt-4">
          <DocumentFilters
            categoryFilter={categoryFilter}
            fileTypeFilter={fileTypeFilter}
            onCategoryFilterChange={setCategoryFilter}
            onFileTypeFilterChange={setFileTypeFilter}
            onClearFilters={clearFilters}
          />
        </div>

        {/* Sorting controls */}
        <div className="mt-4 flex items-center justify-between border-b pb-2">
          <div className="text-sm text-muted-foreground" aria-live="polite">
            {withBookmarks.length} {withBookmarks.length === 1 ? "documento" : "documentos"}
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              onClick={() => handleSortChange("title")}
            >
              Título
              {sortField === "title" &&
                (sortOrder === "asc" ? (
                  <ArrowUp className="ml-1 size-4" />
                ) : (
                  <ArrowDown className="ml-1 size-4" />
                ))}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              onClick={() => handleSortChange("dateUploaded")}
            >
              Data
              {sortField === "dateUploaded" &&
                (sortOrder === "asc" ? (
                  <ArrowUp className="ml-1 size-4" />
                ) : (
                  <ArrowDown className="ml-1 size-4" />
                ))}
            </Button>
          </div>
        </div>

        {/* Document list */}
        <div className="flex flex-col divide-y">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center gap-4 py-4">
                <Skeleton className="size-10 rounded-md" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <div className="mt-2 flex gap-2">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Skeleton className="size-9 rounded-md" />
                  <Skeleton className="size-9 rounded-md" />
                </div>
              </div>
            ))
          ) : withBookmarks.length > 0 ? (
            withBookmarks.map((doc) => (
              <DocumentItem
                key={doc.id}
                document={doc}
                onToggleBookmark={handleToggleBookmark}
                onDownload={handleDownload}
              />
            ))
          ) : (
            <div className="py-10 text-center">
              <p className="text-muted-foreground">
                Nenhum documento encontrado para os seus critérios de pesquisa.
              </p>
              <Button
                variant="link"
                onClick={() => {
                  setSearchQuery("");
                  clearFilters();
                }}
              >
                Limpar pesquisa e filtros
              </Button>
            </div>
          )}
        </div>
      </div>

      <KeyboardShortcutsDialog open={showHelpDialog} onOpenChange={setShowHelpDialog} />
    </DashboardLayout>
  );
};

export default Documents;
