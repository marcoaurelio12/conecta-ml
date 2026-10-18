/**
 * Mock identity types. Code identifiers stay in English; UI labels live in the
 * roleLabels map (PT-PT). In M1 these roles map to Entra ID app roles and the
 * fixtures are replaced by the ID token claims — screens keep using this shape.
 */

export type Role = "Employee" | "Manager" | "HR" | "IAMAdmin";

export const roleLabels: Record<Role, string> = {
  Employee: "Colaborador",
  Manager: "Gestor",
  HR: "Recursos Humanos",
  IAMAdmin: "Administrador IAM",
};

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  title: string;
  department: string;
  role: Role;
}

export const allRoles: Role[] = ["Employee", "Manager", "HR", "IAMAdmin"];

export const userInitials = (name: string): string =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
