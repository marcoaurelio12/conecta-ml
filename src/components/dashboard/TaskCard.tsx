import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ListChecks, PartyPopper } from "lucide-react";
import { Link } from "react-router-dom";
import { loadSavedChecklist } from "@/data/checklistData";

export const TaskCard: React.FC = () => {
  // The next open task, from the same persisted checklist the page uses.
  const nextTask = useMemo(
    () => loadSavedChecklist().find((task) => !task.completed),
    []
  );

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">A sua próxima tarefa</CardTitle>
          <ListChecks className="size-5 text-muted-foreground" aria-hidden="true" />
        </div>
      </CardHeader>
      <CardContent>
        {nextTask ? (
          <>
            <h3 className="mb-2 font-medium">{nextTask.title}</h3>
            <Badge variant={nextTask.dueDate === "Hoje" ? "destructive" : "secondary"}>
              Prazo: {nextTask.dueDate}
            </Badge>
            <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
              {nextTask.description}
            </p>
          </>
        ) : (
          <div className="flex items-start gap-3">
            <PartyPopper className="mt-0.5 size-5 text-primary" aria-hidden="true" />
            <div>
              <h3 className="font-medium">Lista concluída</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Não tem tarefas pendentes de integração.
              </p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        <Button asChild variant="outline" size="sm">
          <Link to="/checklist">Ver todas as tarefas</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
