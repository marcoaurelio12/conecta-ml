
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ListTodo } from "lucide-react"; // Changed from Checklist to ListTodo
import { Link } from 'react-router-dom';

export const TaskCard: React.FC = () => {
  // Mock data - in a real app, this would come from an API
  const nextTask = {
    title: "Visão geral completa das políticas da empresa",
    dueDate: "Hoje",
    priority: "Alto",
    description: "Ler e tomar conhecimento do documento sobre as políticas da empresa."
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">A tua Próxima Tarefa</CardTitle>
          <ListTodo className="text-muted-foreground h-5 w-5" /> {/* Changed from Checklist to ListTodo */}
        </div>
      </CardHeader>
      <CardContent>
        <h3 className="font-medium mb-1">{nextTask.title}</h3>
        <div className="text-sm text-muted-foreground mb-3">
          <span className="inline-flex items-center mr-3">
            <span className="font-medium">Prazo:</span> 
            <span className="ml-1">{nextTask.dueDate}</span>
          </span>
          <span className="inline-flex items-center">
            <span className="font-medium">Prioridade:</span> 
            <span className="ml-1 text-red-500 font-medium">{nextTask.priority}</span>
          </span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{nextTask.description}</p>
      </CardContent>
      <CardFooter className="pt-0">
        <Button asChild variant="outline" size="sm">
          <Link to="/checklist">Ver Todas as Tarefas</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
