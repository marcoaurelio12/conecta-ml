import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { userFixtures } from "@/data/users";
import { allRoles, CurrentUser, Role } from "@/types/user";

const ROLE_STORAGE_KEY = "conecta.role";

interface CurrentUserContextValue {
  user: CurrentUser;
  role: Role;
  /** Dev-only helper behind the sidebar switcher; MSAL replaces it in M1. */
  setRole: (role: Role) => void;
}

const CurrentUserContext = createContext<CurrentUserContextValue | null>(null);

const loadInitialRole = (): Role => {
  try {
    const stored = localStorage.getItem(ROLE_STORAGE_KEY) as Role | null;
    if (stored && allRoles.includes(stored)) return stored;
  } catch {
    // localStorage unavailable (private mode) — fall through to the default.
  }
  return "Employee";
};

export function CurrentUserProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<Role>(loadInitialRole);

  const setRole = useCallback((nextRole: Role) => {
    setRoleState(nextRole);
    try {
      localStorage.setItem(ROLE_STORAGE_KEY, nextRole);
    } catch {
      // Ignore persistence failures; the in-memory role still applies.
    }
  }, []);

  const value = useMemo<CurrentUserContextValue>(
    () => ({ user: userFixtures[role], role, setRole }),
    [role, setRole]
  );

  return <CurrentUserContext.Provider value={value}>{children}</CurrentUserContext.Provider>;
}

export function useCurrentUser(): CurrentUserContextValue {
  const context = useContext(CurrentUserContext);
  if (!context) {
    throw new Error("useCurrentUser must be used within a CurrentUserProvider.");
  }
  return context;
}
