import React, { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { ModuleCard } from "@/components/learning/ModuleCard";
import { ModuleCardSkeleton } from "@/components/learning/ModuleCardSkeleton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useDebounce } from "@/hooks/useDebounce";
import { usePersistentState } from "@/hooks/usePersistentState";
import {
  learningCategories,
  learningModules,
  learningStorageKey,
  LearningProgress,
  LearningCategory,
} from "@/data/learningData";
import { ModuleStatus, moduleStatusMeta, moduleStatuses } from "@/types/status";

const Learning = () => {
  // Filter state lives in the URL (B5): deep links and back navigation keep
  // the search and filters instead of remounting into a blank page.
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get("q") ?? "";
  const statusFilter = searchParams.get("estado") ?? "all";
  const categoryFilter = searchParams.get("categoria") ?? "all";

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [progress, setProgress] = usePersistentState<LearningProgress>(
    learningStorageKey,
    {}
  );
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const setParam = (key: string, value: string) => {
    setSearchParams(
      (current) => {
        if (value && value !== "all") current.set(key, value);
        else current.delete(key);
        return current;
      },
      { replace: true }
    );
  };

  // Simulate the future API latency once.
  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const statusOf = (moduleId: string, fallback: ModuleStatus): ModuleStatus =>
    progress[moduleId] ?? fallback;

  const filteredModules = useMemo(
    () =>
      learningModules.filter((module) => {
        const matchesSearch =
          module.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          module.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
        const matchesStatus =
          statusFilter === "all" ||
          statusOf(module.id, module.defaultStatus) === statusFilter;
        const matchesCategory =
          categoryFilter === "all" || module.category === (categoryFilter as LearningCategory);
        return matchesSearch && matchesStatus && matchesCategory;
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [debouncedSearchTerm, statusFilter, categoryFilter, progress]
  );

  const selectedModule = selectedModuleId
    ? learningModules.find((m) => m.id === selectedModuleId)
    : null;
  const selectedStatus = selectedModule
    ? statusOf(selectedModule.id, selectedModule.defaultStatus)
    : null;

  const handleModuleClick = (moduleId: string) => {
    setSelectedModuleId(moduleId);
  };

  const handleCloseDialog = () => {
    setSelectedModuleId(null);
  };

  const handleToggleComplete = () => {
    if (!selectedModule || !selectedStatus) return;
    const nextStatus: ModuleStatus =
      selectedStatus === "Concluído" ? "Em Progresso" : "Concluído";
    setProgress((current) => ({ ...current, [selectedModule.id]: nextStatus }));
    toast.success(
      nextStatus === "Concluído"
        ? `Módulo “${selectedModule.title}” marcado como concluído.`
        : `Módulo “${selectedModule.title}” reaberto.`
    );
  };

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Catálogo de Formação</h1>
        <p className="mt-1 text-muted-foreground">
          O seu progresso fica guardado neste dispositivo enquanto a plataforma não está ligada.
        </p>

        {/* Search and filter bar */}
        <div className="mt-6 mb-8 flex flex-col gap-3 md:flex-row">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Pesquisar módulos…"
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setParam("q", e.target.value)}
              aria-label="Pesquisar módulos"
            />
          </div>
          <div className="flex gap-3">
            <Select value={statusFilter} onValueChange={(value) => setParam("estado", value)}>
              <SelectTrigger className="w-[180px]" aria-label="Filtrar por estado">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os estados</SelectItem>
                {moduleStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={(value) => setParam("categoria", value)}>
              <SelectTrigger className="w-[200px]" aria-label="Filtrar por categoria">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {learningCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Module grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => <ModuleCardSkeleton key={index} />)
          ) : filteredModules.length > 0 ? (
            filteredModules.map((module) => (
              <ModuleCard
                key={module.id}
                module={module}
                status={statusOf(module.id, module.defaultStatus)}
                onClick={() => handleModuleClick(module.id)}
              />
            ))
          ) : (
            <div className="col-span-full py-12 text-center">
              <h3 className="text-lg font-medium">Nenhum módulo encontrado</h3>
              <p className="mt-1 text-muted-foreground">
                Tente ajustar a pesquisa ou limpar os filtros.
              </p>
              <Button
                variant="link"
                className="mt-2"
                onClick={() => setSearchParams({}, { replace: true })}
              >
                Limpar pesquisa e filtros
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Module detail dialog */}
      <Dialog open={!!selectedModuleId} onOpenChange={(open) => !open && handleCloseDialog()}>
        {selectedModule && selectedStatus && (
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-left text-2xl">{selectedModule.title}</DialogTitle>
              <DialogDescription className="text-left">
                {selectedModule.category} · {selectedModule.duration} minutos
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5">
              <div className="flex items-center gap-2">
                <Badge variant={moduleStatusMeta[selectedStatus].badgeVariant}>
                  {selectedStatus}
                </Badge>
              </div>

              <div className="flex aspect-video items-center justify-center rounded-lg bg-muted">
                <p className="p-4 text-center text-sm text-muted-foreground">
                  O leitor de vídeo será incorporado aqui quando existir conteúdo.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-medium">Sobre este módulo</h3>
                <p className="text-muted-foreground">{selectedModule.description}</p>
              </div>

              <div className="flex justify-end gap-2 border-t pt-4">
                <Button variant="outline" onClick={handleCloseDialog}>
                  Fechar
                </Button>
                <Button onClick={handleToggleComplete}>
                  {selectedStatus === "Concluído"
                    ? "Marcar como em progresso"
                    : "Marcar como concluído"}
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </DashboardLayout>
  );
};

export default Learning;
