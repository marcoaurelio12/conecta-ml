import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useCurrentUser } from "@/contexts/CurrentUserContext";
import { Role } from "@/types/user";

interface RequireRoleProps {
  roles: Role[];
  children: React.ReactNode;
}

/**
 * Mock route guard. Roles come from CurrentUserContext today and from the
 * Entra ID token in M1 — screens and route tables stay unchanged.
 */
export function RequireRole({ roles, children }: RequireRoleProps) {
  const { role } = useCurrentUser();
  const location = useLocation();

  if (!roles.includes(role)) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
