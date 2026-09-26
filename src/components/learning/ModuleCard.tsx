
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Book, Clock } from "lucide-react";

type ModuleStatus = "Não Iniciado" | "Em Progresso" | "Concluído";

type Category = 
  | "Política da Empresa"
  | "Competências Técnicas"
  | "Competências Interpessoais"
  | "Conhecimento do Produto"
  | "Conformidade";

interface Module {
  id: string;
  title: string;
  description: string;
  duration: number;
  status: ModuleStatus;
  category: Category;
  thumbnail: string;
}

interface ModuleCardProps {
  module: Module;
  onClick: () => void;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({ module, onClick }) => {
  const getButtonText = (status: ModuleStatus): string => {
    switch (status) {
      case "Não Iniciado":
        return "Iniciar";
      case "In Progress":
        return "Continuar";
      case "Completed":
        return "Ver Módulo";
      default:
        return "Iniciar";
    }
  };

  const getStatusVariant = (status: ModuleStatus) => {
    switch (status) {
      case "Concluído":
        return "default";
      case "Em Progresso":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getCategoryIcon = (category: Category) => {
    switch (category) {
      case "Política da Empresa":
      case "Conformidade":
        return <Book className="h-4 w-4" />;
      default:
        return <Play className="h-4 w-4" />;
    }
  };

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:-translate-y-2 hover:shadow-lg">
      <div 
        className="h-44 bg-cover bg-center" 
        style={{ backgroundImage: `url(${module.thumbnail})` }}
      />
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg line-clamp-1">{module.title}</h3>
          <Badge variant={getStatusVariant(module.status)} className="ml-2">
            {module.status}
          </Badge>
        </div>
        <p className="text-muted-foreground line-clamp-3 min-h-[4.5rem]">
          {module.description}
        </p>
        <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{module.duration} min</span>
          <div className="ml-auto flex items-center gap-1">
            {getCategoryIcon(module.category)}
            <span className="text-xs">{module.category}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 pb-4">
        <Button 
          className="w-full"
          variant={module.status === "Não Iniciado" ? "default" :
                   module.status === "Em Progresso" ? "secondary" : "outline"}
          onClick={onClick}
        >
          {getButtonText(module.status)}
        </Button>
      </CardFooter>
    </Card>
  );
};
