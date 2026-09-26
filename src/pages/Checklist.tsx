import { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Check, ListTodo, Filter } from "lucide-react";
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Button, ButtonProps } from '@/components/ui/button';
import { BadgeProps } from '@/components/ui/badge';

// Define task type
interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  category: 'firstDay' | 'week1' | 'month1';
}

type FilterType = 'all' | 'pending' | 'completed';

const Checklist = () => {
  // Sample task data
  const initialTasks: Task[] = [
    // First Day Tasks
    {
      id: '1',
      title: 'Preencher formulários de RH',
      description: 'Preencher formulários de emprego, impostos e benefícios',
      dueDate: 'Hoje',
      completed: true,
      category: 'firstDay'
    },
    {
      id: '2',
      title: 'Configurar estação de trabalho',
      description: 'Configurar o seu portátil, credenciais de acesso e software',
      dueDate: 'Hoje',
      completed: true,
      category: 'firstDay'
    },
    {
      id: '3',
      title: 'Reunião de apresentação da equipa',
      description: 'Reunir com os membros da sua equipa direta',
      dueDate: 'Hoje',
      completed: false,
      category: 'firstDay'
    },

    // Week 1 Tasks
    {
      id: '4',
      title: 'Formação de segurança',
      description: 'Concluir a formação obrigatória de segurança e conformidade',
      dueDate: '3 dias',
      completed: false,
      category: 'week1'
    },
    {
      id: '5',
      title: 'Integração de produto',
      description: 'Aprender sobre os nossos produtos, serviços e clientes',
      dueDate: '5 dias',
      completed: false,
      category: 'week1'
    },
    {
      id: '6',
      title: 'Configurar ambiente de desenvolvimento',
      description: 'Instalar e configurar todas as ferramentas de desenvolvimento necessárias',
      dueDate: '2 dias',
      completed: false,
      category: 'week1'
    },

    // Month 1 Tasks
    {
      id: '7',
      title: 'Concluir primeiro projeto',
      description: 'Terminar a sua primeira tarefa de projeto atribuída',
      dueDate: '3 semanas',
      completed: false,
      category: 'month1'
    },
    {
      id: '8',
      title: 'Definição de metas de desempenho',
      description: 'Reunir com o gestor para estabelecer metas de desempenho',
      dueDate: '2 semanas',
      completed: false,
      category: 'month1'
    },
    {
      id: '9',
      title: 'Evento de team building',
      description: 'Participar na atividade mensal de team building',
      dueDate: '4 semanas',
      completed: false,
      category: 'month1'
    },
  ];

  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [filter, setFilter] = useState<FilterType>('all');

  // Calculate progress
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Filter tasks based on selected filter
  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  // Group tasks by category
  const firstDayTasks = filteredTasks.filter(task => task.category === 'firstDay');
  const week1Tasks = filteredTasks.filter(task => task.category === 'week1');
  const month1Tasks = filteredTasks.filter(task => task.category === 'month1');

  // Toggle task completion
  const toggleTask = (taskId: string) => {
    setTasks(currentTasks =>
      currentTasks.map(task =>
        task.id === taskId
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  return (
    <DashboardLayout>
      {/* Sticky Progress Bar */}
      <div className="sticky top-0 bg-background z-10 pt-2 pb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold">Progresso da Integração</h2>
          <span className="text-sm font-medium">{completedTasks}/{totalTasks} concluídas</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 mt-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lista de Verificação de Integração</h1>
          <p className="text-muted-foreground mt-1">Acompanhe o seu progresso durante o processo de integração</p>
        </div>

        {/* Filter chips */}
        <div className="flex space-x-2 mt-4 md:mt-0">
          <Button
            size="sm"
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            className="flex items-center gap-1"
          >
            <Filter className="h-4 w-4" />
            Todas
          </Button>
          <Button
            size="sm"
            variant={filter === 'pending' ? 'default' : 'outline'}
            onClick={() => setFilter('pending')}
          >
            Pendentes
          </Button>
          <Button
            size="sm"
            variant={filter === 'completed' ? 'default' : 'outline'}
            onClick={() => setFilter('completed')}
          >
            Concluídas
          </Button>
        </div>
      </div>

      {/* Task Accordion */}
      <div className="space-y-6">
        {/* First Day */}
        <Accordion type="single" collapsible defaultValue="firstDay" className="border rounded-md">
          <AccordionItem value="firstDay">
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-center">
                <ListTodo className="mr-2 h-5 w-5" />
                <span className="font-semibold">Primeiro Dia</span>
                <Badge variant="secondary" className="ml-2">
                  {firstDayTasks.filter(t => t.completed).length}/{firstDayTasks.length}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 py-2">
              <div className="space-y-2">
                {firstDayTasks.map(task => (
                  <TaskItem key={task.id} task={task} toggleTask={toggleTask} />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Week 1 */}
        <Accordion type="single" collapsible defaultValue="week1" className="border rounded-md">
          <AccordionItem value="week1">
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-center">
                <ListTodo className="mr-2 h-5 w-5" />
                <span className="font-semibold">Semana 1</span>
                <Badge variant="secondary" className="ml-2">
                  {week1Tasks.filter(t => t.completed).length}/{week1Tasks.length}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 py-2">
              <div className="space-y-2">
                {week1Tasks.map(task => (
                  <TaskItem key={task.id} task={task} toggleTask={toggleTask} />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Month 1 */}
        <Accordion type="single" collapsible defaultValue="month1" className="border rounded-md">
          <AccordionItem value="month1">
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-center">
                <ListTodo className="mr-2 h-5 w-5" />
                <span className="font-semibold">Mês 1</span>
                <Badge variant="secondary" className="ml-2">
                  {month1Tasks.filter(t => t.completed).length}/{month1Tasks.length}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 py-2">
              <div className="space-y-2">
                {month1Tasks.map(task => (
                  <TaskItem key={task.id} task={task} toggleTask={toggleTask} />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </DashboardLayout>
  );
};

// Task Item Component
interface TaskItemProps {
  task: Task;
  toggleTask: (id: string) => void;
}

const TaskItem = ({ task, toggleTask }: TaskItemProps) => {
  return (
    <div
      className={`
        flex items-start space-x-4 border rounded-lg p-3
        ${task.completed ? 'bg-muted/30' : 'bg-background'}
        focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2
        transition-colors
      `}
      tabIndex={0}
    >
      <Checkbox
        id={`task-${task.id}`}
        checked={task.completed}
        onCheckedChange={() => toggleTask(task.id)}
        className="mt-1"
        aria-label={`Marcar ${task.title} como ${task.completed ? 'incompleta' : 'completa'}`}
      />
      <div className="flex-grow">
        <div className="flex items-start justify-between">
          <label
            htmlFor={`task-${task.id}`}
            className={`font-medium cursor-pointer ${task.completed ? 'text-muted-foreground line-through' : ''}`}
          >
            {task.title}
          </label>
          <Badge variant={getVariant(task.dueDate)} className="ml-2">
            {task.dueDate}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
      </div>
      {task.completed && (
        <div className="text-portugalPalette-dark-blue-1 mt-1">
          <Check className="h-4 w-4" />
        </div>
      )}
    </div>
  );
};

// Helper to determine badge variant based on due date
const getVariant = (dueDate: string): "default" | "secondary" | "destructive" | "outline" => {
  if (dueDate === 'Hoje') return "destructive";
  if (dueDate.includes('dias') && parseInt(dueDate) <= 3) return "default";
  // Add more specific Portuguese week handling if needed, e.g. "semanas"
  return "secondary";
};

export default Checklist;
