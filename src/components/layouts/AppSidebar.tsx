import React from "react";
import { Link, useLocation } from "react-router-dom";
import { navigation } from "@/config/navigation";
import { useCurrentUser } from "@/contexts/CurrentUserContext";
import { allRoles, roleLabels, Role } from "@/types/user";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

/**
 * Role-aware navigation. Items outside the current role never render, so the
 * sidebar already reads like the future M1+ product: a personal area plus the
 * governance areas each role will own.
 */
const AppSidebar: React.FC = () => {
  const location = useLocation();
  const { role, setRole } = useCurrentUser();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/" aria-label="Conecta — início">
                <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sm font-bold text-sidebar-primary-foreground">
                  C
                </div>
                <div className="grid flex-1 text-left leading-tight">
                  <span className="truncate font-semibold">Conecta</span>
                  <span className="truncate text-xs text-sidebar-muted">
                    Portal interno · Nortia
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {navigation.map((group) => {
          const items = group.items.filter(
            (item) => !item.roles || item.roles.includes(role)
          );
          if (items.length === 0) return null;

          return (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={location.pathname === item.href}
                        tooltip={
                          item.milestone
                            ? `${item.title} — previsto no roadmap IAM`
                            : item.title
                        }
                      >
                        <Link
                          to={item.href}
                          title={
                            item.milestone
                              ? `${item.title}: ecrã previsto no roadmap IAM, chega na fase ${item.milestone}`
                              : undefined
                          }
                        >
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                      {item.milestone && (
                        <SidebarMenuBadge className="text-sidebar-muted" aria-hidden="true">
                          {item.milestone}
                        </SidebarMenuBadge>
                      )}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>

      <SidebarFooter>
        {import.meta.env.DEV && (
          <div className="px-2 pb-1 group-data-[collapsible=icon]:hidden">
            <Select value={role} onValueChange={(value) => setRole(value as Role)}>
              <SelectTrigger
                className="h-9 border-sidebar-border bg-sidebar-accent text-sidebar-foreground"
                aria-label="Assumir papel (apenas em desenvolvimento)"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {allRoles.map((roleOption) => (
                  <SelectItem key={roleOption} value={roleOption}>
                    {roleLabels[roleOption]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;
