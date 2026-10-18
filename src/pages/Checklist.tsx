import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Check, Clock, ListChecks, RotateCcw } from "lucide-react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { usePersistentState } from "@/hooks/usePersistentState";
import {
  checklistStorageKey,
  checklistTasks,
  Task,
  TaskCategory,
} from "@/data/checklistData";

type FilterType = "all" | "pending" | "completed";

const categoryLabels: Record<TaskCategory, string> = {
  firstDay: "Primeiro Dia",
  week1: "Semana 1",
  month1: "Mês 1",
};

const Checklist = () => {
  // Progress persists in localStorage with the shape the API will use (B4).
  const [tasks, setTasks] = usePersistentState<Task[]>(checklistStorageKey, checklistTasks);
  const [filter, setFilter] = useState<FilterType>("all");
  const [justSaved, setJustSaved] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setJustSaved(true);
    const timer = setTimeout(() => setJustSaved(false), 2500);
    return () => clearTimeout(timer);
  }, [tasks]);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true;
  });

  const groups: TaskCategory[] = ["firstDay", "week1", "month1"];
  const tasksIn = (category: TaskCategory) => filteredTasks.filter((t) => t.category === category);

  const toggleTask = (taskId: string) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const resetProgress = () => {
    setTasks(checklistTasks);
  };

  return (
    <DashboardLayout>
      {/* Page header with inline progress — one hierarchy, not two stacked bars. */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lista de Verificação</h1>
          <p className="mt-1 text-muted-foreground">
            Acompanhe o seu progresso durante o processo de integração.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {justSaved ? (
            <span
              className="flex animate-fade-in items-center gap-1.5 text-sm text-success"
              role="status"
            >
              <Check className="size-4" aria-hidden="true" />
              Progresso guardado
            </span>
          ) : (
            <span className="text-sm text-muted-foreground">
              {completedTasks}/{totalTasks} concluídas
            </span>
          )}

          {/* The product's only destructive action: out of the filter row and
              behind a confirmation, where it can't read as a fourth filter. */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="gap-1.5 text-muted-foreground hover:text-destructive"
              >
                <RotateCcw className="size-3.5" aria-hidden="true" />
                Repor lista
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Repor a lista de verificação?</AlertDialogTitle>
                <AlertDialogDescription>
                  Isto apaga o progresso guardado e repõe as {totalTasks} tarefas iniciais por
                  concluir. A ação não pode ser anulada.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Manter progresso</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={resetProgress}
                >
                  Repor
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="mt-4 mb-8 flex items-center gap-4">
        <Progress value={progress} className="h-2 flex-1" />
        <span className="text-sm font-medium tabular-nums">{Math.round(progress)}%</span>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-2" role="group" aria-label="Filtrar tarefas">
        <Button
          size="sm"
          variant={filter === "all" ? "default" : "outline"}
          aria-pressed={filter === "all"}
          onClick={() => setFilter("all")}
        >
          Todas
        </Button>
        <Button
          size="sm"
          variant={filter === "pending" ? "default" : "outline"}
          aria-pressed={filter === "pending"}
          onClick={() => setFilter("pending")}
        >
          Pendentes
        </Button>
        <Button
          size="sm"
          variant={filter === "completed" ? "default" : "outline"}
          aria-pressed={filter === "completed"}
          onClick={() => setFilter("completed")}
        >
          Concluídas
        </Button>
      </div>

      {/* Task groups */}
      <div className="space-y-4">
        {groups.map((category) => {
          const categoryTasks = tasksIn(category);
          if (categoryTasks.length === 0) return null;

          return (
            <Accordion
              key={category}
              type="single"
              collapsible
              defaultValue={category}
              className="rounded-lg border bg-card"
            >
              <AccordionItem value={category} className="border-none">
                <AccordionTrigger className="px-4 py-4 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <ListChecks className="size-5 text-primary" aria-hidden="true" />
                    <span className="font-semibold">{categoryLabels[category]}</span>
                    <Badge variant="secondary" className="ml-1 tabular-nums">
                      {categoryTasks.filter((t) => t.completed).length}/{categoryTasks.length}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-2">
                    {categoryTasks.map((task) => (
                      <TaskItem key={task.id} task={task} toggleTask={toggleTask} />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          );
        })}

        {filteredTasks.length === 0 && (
          <div className="rounded-lg border bg-card py-12 text-center">
            <p className="text-muted-foreground">
              {filter === "completed"
                ? "Ainda não concluiu nenhuma tarefa."
                : "Todas as tarefas estão concluídas. Bom trabalho!"}
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

interface TaskItemProps {
  task: Task;
  toggleTask: (id: string) => void;
}

const TaskItem = ({ task, toggleTask }: TaskItemProps) => {
  return (
    <div
      className={`flex items-start gap-4 rounded-lg border p-3 transition-colors duration-fast ${
        task.completed ? "bg-muted/40" : "bg-background"
      }`}
    >
      <Checkbox
        id={`task-${task.id}`}
        checked={task.completed}
        onCheckedChange={() => toggleTask(task.id)}
        className="mt-0.5"
        aria-label={`Marcar ${task.title} como ${task.completed ? "incompleta" : "completa"}`}
      />
      <div className="min-w-0 flex-grow">
        <div className="flex items-start justify-between gap-2">
          <label
            htmlFor={`task-${task.id}`}
            className={`cursor-pointer font-medium ${
              task.completed ? "text-muted-foreground line-through" : ""
            }`}
          >
            {task.title}
          </label>
          <Badge variant={getVariant(task.dueDate, task.completed)} className="shrink-0">
            {!task.completed && (
              <Clock className="mr-1 size-3" aria-hidden="true" />
            )}
            <span className="sr-only">Prazo: </span>
            {task.dueDate}
          </Badge>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{task.description}</p>
      </div>
    </div>
  );
};

/** Deadline urgency without alarm-red: "Hoje" reads as attention (warning),
    not as an error, and urgency disappears once the task is complete. */
const getVariant = (
  dueDate: string,
  completed: boolean
): "default" | "secondary" | "warning" | "outline" => {
  if (completed) return "outline";
  if (dueDate === "Hoje") return "warning";
  if (dueDate.includes("dia") && parseInt(dueDate, 10) <= 3) return "default";
  return "secondary";
};

export default Checklist;
