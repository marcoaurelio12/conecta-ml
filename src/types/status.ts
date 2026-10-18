import { BenefitCategory, BenefitStatus } from "@/types/benefit";

/**
 * Single source of truth for domain statuses and their presentation (B3).
 * Values are the PT-PT strings the UI shows and the fixtures store, so code
 * never compares "Eligible" against "Elegível" again.
 */

export type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

/* Learning module status -------------------------------------------------- */

export const moduleStatuses = ["Não Iniciado", "Em Progresso", "Concluído"] as const;
export type ModuleStatus = (typeof moduleStatuses)[number];

export const moduleStatusMeta: Record<
  ModuleStatus,
  { badgeVariant: BadgeVariant; actionLabel: string }
> = {
  "Não Iniciado": { badgeVariant: "outline", actionLabel: "Iniciar" },
  "Em Progresso": { badgeVariant: "secondary", actionLabel: "Continuar" },
  Concluído: { badgeVariant: "default", actionLabel: "Rever módulo" },
};

/* Benefit status ----------------------------------------------------------- */

export const benefitStatusMeta: Record<BenefitStatus, { badgeVariant: BadgeVariant }> = {
  Elegível: { badgeVariant: "outline" },
  Inscrito: { badgeVariant: "default" },
  Pendente: { badgeVariant: "secondary" },
};

/* Benefit categories: the type stores stable values, the map carries the
   PT-PT labels shown in filters and tabs. --------------------------------- */

export type BenefitCategoryValue = Exclude<BenefitCategory, "All">;

export const benefitCategoryLabels: Record<BenefitCategoryValue, string> = {
  Health: "Saúde",
  Retirement: "Reforma",
  Wellness: "Bem-estar",
  "Time Off": "Férias e Ausências",
  Perks: "Vantagens",
};

