import {
  ClipboardCheck,
  FolderOpen,
  Gift,
  GraduationCap,
  Home,
  LifeBuoy,
  ListChecks,
  MessageSquare,
  Network,
  ScrollText,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { Role } from "@/types/user";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  /** Roles that see this item; omitted means every role. */
  roles?: Role[];
  /** Planned screen from the IAM roadmap — shown as a milestone badge. */
  milestone?: "M2" | "M3";
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const navigation: NavGroup[] = [
  {
    label: "Principal",
    items: [
      { title: "Início", href: "/", icon: Home },
      { title: "Lista de Verificação", href: "/checklist", icon: ListChecks },
      { title: "Formação", href: "/learning", icon: GraduationCap },
      { title: "Feedback", href: "/feedback", icon: MessageSquare },
    ],
  },
  {
    label: "Recursos",
    items: [
      { title: "Documentos", href: "/documents", icon: FolderOpen },
      { title: "Benefícios", href: "/benefits", icon: Gift },
      { title: "Suporte de TI", href: "/it-support", icon: LifeBuoy },
      { title: "Organograma", href: "/org-chart", icon: Network },
    ],
  },
  {
    label: "Governação",
    items: [
      { title: "Pessoas", href: "/pessoas", icon: UsersRound, roles: ["HR"], milestone: "M2" },
      {
        title: "Aprovações",
        href: "/aprovacoes",
        icon: ClipboardCheck,
        roles: ["Manager"],
        milestone: "M3",
      },
      { title: "Auditoria", href: "/auditoria", icon: ScrollText, roles: ["IAMAdmin"], milestone: "M3" },
    ],
  },
];
