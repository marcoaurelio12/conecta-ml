/**
 * Checklist fixtures. The persisted shape (Task[]) is the one the future API
 * will return, so swapping the store for react-query keeps screens unchanged.
 */

export type TaskCategory = "firstDay" | "week1" | "month1";

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  category: TaskCategory;
}

export const checklistTasks: Task[] = [
  // Primeiro dia
  {
    id: "1",
    title: "Preencher formulários de RH",
    description: "Preencher formulários de emprego, impostos e benefícios",
    dueDate: "Hoje",
    completed: true,
    category: "firstDay",
  },
  {
    id: "2",
    title: "Configurar estação de trabalho",
    description: "Configurar o seu portátil, credenciais de acesso e software",
    dueDate: "Hoje",
    completed: true,
    category: "firstDay",
  },
  {
    id: "3",
    title: "Reunião de apresentação da equipa",
    description: "Reunir com os membros da sua equipa direta",
    dueDate: "Hoje",
    completed: false,
    category: "firstDay",
  },

  // Semana 1
  {
    id: "4",
    title: "Formação de segurança",
    description: "Concluir a formação obrigatória de segurança e conformidade",
    dueDate: "3 dias",
    completed: false,
    category: "week1",
  },
  {
    id: "5",
    title: "Integração de produto",
    description: "Aprender sobre os nossos produtos, serviços e clientes",
    dueDate: "5 dias",
    completed: false,
    category: "week1",
  },
  {
    id: "6",
    title: "Configurar ambiente de desenvolvimento",
    description: "Instalar e configurar todas as ferramentas de desenvolvimento necessárias",
    dueDate: "2 dias",
    completed: false,
    category: "week1",
  },

  // Mês 1
  {
    id: "7",
    title: "Concluir primeiro projeto",
    description: "Terminar a sua primeira tarefa de projeto atribuída",
    dueDate: "3 semanas",
    completed: false,
    category: "month1",
  },
  {
    id: "8",
    title: "Definição de metas de desempenho",
    description: "Reunir com o gestor para estabelecer metas de desempenho",
    dueDate: "2 semanas",
    completed: false,
    category: "month1",
  },
  {
    id: "9",
    title: "Evento de team building",
    description: "Participar na atividade mensal de team building",
    dueDate: "4 semanas",
    completed: false,
    category: "month1",
  },
];

export const checklistStorageKey = "conecta.checklist.v1";

/** Saved tasks for screens that only read progress (e.g. the dashboard). */
export const loadSavedChecklist = (): Task[] => {
  try {
    const stored = localStorage.getItem(checklistStorageKey);
    if (stored) {
      const parsed = JSON.parse(stored) as Task[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // Fall through to fixtures.
  }
  return checklistTasks;
};
