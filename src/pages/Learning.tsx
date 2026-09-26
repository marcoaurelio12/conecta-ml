
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
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
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useDebounce } from "@/hooks/useDebounce";

// Types for our learning modules
type ModuleStatus = "Não Iniciado" | "Em Progresso" | "Concluído";

type Category =
  | "Política da Empresa"
  | "Competências Técnicas"
  | "Competências Interpessoais"
  | "Conhecimento do Produto"
  | "Conformidade";

interface LearningModule {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  status: ModuleStatus;
  category: Category;
  thumbnail: string;
  videoUrl?: string;
  transcript?: string;
}

const Learning = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [modules, setModules] = useState<LearningModule[]>([]);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Mock data for learning modules
  const mockModules: LearningModule[] = [
    {
      id: "1",
      title: "Introdução à Empresa",
      description: "Saiba mais sobre a missão, visão e valores da nossa empresa. Este módulo introdutório ajudá-lo-á a compreender a nossa cultura.",
      duration: 15,
      status: "Não Iniciado",
      category: "Política da Empresa",
      thumbnail: "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    },
    {
      id: "2",
      title: "Fundamentos de Segurança de Dados",
      description: "Práticas de segurança essenciais que todos os colaboradores precisam de conhecer para proteger os dados da empresa e dos clientes.",
      duration: 25,
      status: "Em Progresso",
      category: "Conformidade",
      thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    },
    {
      id: "3",
      title: "Competências de Comunicação com o Cliente",
      description: "Desenvolva competências de comunicação eficazes para interagir com os clientes e prestar um serviço de excelência.",
      duration: 30,
      status: "Concluído",
      category: "Competências Interpessoais",
      thumbnail: "https://images.unsplash.com/photo-1573497491765-dccce02b29df?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    },
    {
      id: "4",
      title: "Visão Geral do Produto",
      description: "Saiba mais sobre os nossos produtos principais, as suas funcionalidades e como beneficiam os nossos clientes.",
      duration: 40,
      status: "Não Iniciado",
      category: "Conhecimento do Produto",
      thumbnail: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    },
    {
      id: "5",
      title: "Workshop Técnico Avançado",
      description: "Análise aprofundada dos aspetos técnicos dos nossos sistemas, incluindo técnicas de resolução de problemas e otimização.",
      duration: 60,
      status: "Não Iniciado",
      category: "Competências Técnicas",
      thumbnail: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    },
    {
      id: "6",
      title: "Fundamentos de Gestão de Tempo",
      description: "Aprenda estratégias práticas para gerir o seu tempo de forma eficaz e aumentar a produtividade no local de trabalho.",
      duration: 20,
      status: "Em Progresso",
      category: "Competências Interpessoais",
      thumbnail: "https://images.unsplash.com/photo-1584377334016-464803ebd8dd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    },
  ];

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setModules(mockModules);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Check URL for module ID param
    const url = new URL(window.location.href);
    const moduleId = url.pathname.split('/learning/')[1];
    if (moduleId) {
      setSelectedModuleId(moduleId);
    }
  }, []);

  // Filter modules based on search term and filters
  const filteredModules = modules.filter((module) => {
    const matchesSearch = 
      module.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      module.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "all" || 
      module.status === statusFilter;
    
    const matchesCategory =
      categoryFilter === "all" || 
      module.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleModuleClick = (moduleId: string) => {
    setSelectedModuleId(moduleId);
    navigate(`/learning/${moduleId}`, { replace: true });
  };

  const handleCloseDialog = () => {
    setSelectedModuleId(null);
    navigate("/learning", { replace: true });
  };

  // Get selected module
  const selectedModule = selectedModuleId 
    ? modules.find(m => m.id === selectedModuleId) 
    : null;

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-8">Catálogo de Formação</h1>
        
        {/* Search and filter bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar módulos..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Estados</SelectItem>
                <SelectItem value="Não Iniciado">Não Iniciado</SelectItem>
                <SelectItem value="Em Progresso">Em Progresso</SelectItem>
                <SelectItem value="Concluído">Concluído</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={categoryFilter}
              onValueChange={setCategoryFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Categorias</SelectItem>
                <SelectItem value="Política da Empresa">Política da Empresa</SelectItem>
                <SelectItem value="Competências Técnicas">Competências Técnicas</SelectItem>
                <SelectItem value="Competências Interpessoais">Competências Interpessoais</SelectItem>
                <SelectItem value="Conhecimento do Produto">Conhecimento do Produto</SelectItem>
                <SelectItem value="Conformidade">Conformidade</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Masonry grid of module cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            // Show skeleton loaders when loading
            Array.from({ length: 6 }).map((_, index) => (
              <ModuleCardSkeleton key={index} />
            ))
          ) : filteredModules.length > 0 ? (
            // Show actual module cards
            filteredModules.map((module) => (
              <ModuleCard
                key={module.id}
                module={module}
                onClick={() => handleModuleClick(module.id)}
              />
            ))
          ) : (
            // No results found
            <div className="col-span-full text-center py-12">
              <h3 className="text-xl font-medium">Nenhum módulo encontrado</h3>
              <p className="text-muted-foreground mt-2">Tente ajustar a sua pesquisa ou filtros</p>
            </div>
          )}
        </div>
      </div>

      {/* Module detail dialog */}
      <Dialog open={!!selectedModuleId} onOpenChange={(open) => {
        if (!open) handleCloseDialog();
      }}>
        {selectedModule && (
          <DialogContent className="max-w-4xl">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold">{selectedModule.title}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">{selectedModule.duration} min</Badge>
                  <Badge 
                    variant={
                      selectedModule.status === "Completed" ? "default" : 
                      selectedModule.status === "In Progress" ? "secondary" : "outline"
                    }
                  >
                    {selectedModule.status}
                  </Badge>
                  <Badge variant="outline">{selectedModule.category}</Badge>
                </div>
              </div>
              
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg aspect-video flex items-center justify-center">
                {/* This would be a video player in a real app */}
                <p className="text-center text-gray-500 p-4">
                  O leitor de vídeo seria incorporado aqui
                </p>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-medium">Sobre este módulo</h3>
                <p>{selectedModule.description}</p>
                
                <div className="border-t pt-4">
                  <h3 className="text-lg font-medium mb-2">Transcrição</h3>
                  <p className="text-muted-foreground text-sm">
                    {selectedModule.transcript || "Nenhuma transcrição disponível para este módulo."}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={() => {
                  // Mark module as completed logic would go here
                  handleCloseDialog();
                }}>
                  {selectedModule.status === "Concluído"
                    ? "Marcar como Incompleto"
                    : "Marcar como Completo"
                  }
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
