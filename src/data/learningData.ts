import { ModuleStatus } from "@/types/status";

export type LearningCategory =
  | "Política da Empresa"
  | "Competências Técnicas"
  | "Competências Interpessoais"
  | "Conhecimento do Produto"
  | "Conformidade";

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  /** Minutes. */
  duration: number;
  category: LearningCategory;
  /** Status shown on first run, before the learner changes anything. */
  defaultStatus: ModuleStatus;
}

export const learningModules: LearningModule[] = [
  {
    id: "1",
    title: "Introdução à Empresa",
    description:
      "Saiba mais sobre a missão, visão e valores da nossa empresa. Este módulo introdutório ajudá-lo-á a compreender a nossa cultura.",
    duration: 15,
    category: "Política da Empresa",
    defaultStatus: "Não Iniciado",
  },
  {
    id: "2",
    title: "Fundamentos de Segurança de Dados",
    description:
      "Práticas de segurança essenciais que todos os colaboradores precisam de conhecer para proteger os dados da empresa e dos clientes.",
    duration: 25,
    category: "Conformidade",
    defaultStatus: "Em Progresso",
  },
  {
    id: "3",
    title: "Competências de Comunicação com o Cliente",
    description:
      "Desenvolva competências de comunicação eficazes para interagir com os clientes e prestar um serviço de excelência.",
    duration: 30,
    category: "Competências Interpessoais",
    defaultStatus: "Concluído",
  },
  {
    id: "4",
    title: "Visão Geral do Produto",
    description:
      "Saiba mais sobre os nossos produtos principais, as suas funcionalidades e como beneficiam os nossos clientes.",
    duration: 40,
    category: "Conhecimento do Produto",
    defaultStatus: "Não Iniciado",
  },
  {
    id: "5",
    title: "Workshop Técnico Avançado",
    description:
      "Análise aprofundada dos aspetos técnicos dos nossos sistemas, incluindo técnicas de resolução de problemas e otimização.",
    duration: 60,
    category: "Competências Técnicas",
    defaultStatus: "Não Iniciado",
  },
  {
    id: "6",
    title: "Fundamentos de Gestão de Tempo",
    description:
      "Aprenda estratégias práticas para gerir o seu tempo de forma eficaz e aumentar a produtividade no local de trabalho.",
    duration: 20,
    category: "Competências Interpessoais",
    defaultStatus: "Em Progresso",
  },
];

export const learningCategories: LearningCategory[] = [
  "Política da Empresa",
  "Competências Técnicas",
  "Competências Interpessoais",
  "Conhecimento do Produto",
  "Conformidade",
];

export const learningStorageKey = "conecta.learning.v1";

/** Persisted learning progress: module id → status (same shape as the API). */
export type LearningProgress = Record<string, ModuleStatus>;
