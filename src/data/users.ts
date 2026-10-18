import { CurrentUser } from "@/types/user";

/**
 * One fixture per role. People are existing employees from employeeData.ts
 * (plus the signed-in employee), so the org chart and "Centrar em Mim" stay
 * truthful for whoever is "signed in".
 */
export const userFixtures: Record<string, CurrentUser> = {
  Employee: {
    id: "13",
    name: "Alex Ferreira",
    email: "alex.ferreira@nortia.example",
    title: "Especialista de Marketing",
    department: "Marketing",
    role: "Employee",
  },
  Manager: {
    id: "6",
    name: "David Kim",
    email: "david.kim@nortia.example",
    title: "Gestor de Engenharia",
    department: "Tecnologia",
    role: "Manager",
  },
  HR: {
    id: "11",
    name: "Sofia Garcia",
    email: "sofia.garcia@nortia.example",
    title: "Especialista de RH",
    department: "RH",
    role: "HR",
  },
  IAMAdmin: {
    id: "14",
    name: "Rui Almeida",
    email: "rui.almeida@nortia.example",
    title: "Administrador de Identidade",
    department: "Tecnologia",
    role: "IAMAdmin",
  },
};
