import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import AppSidebar from "./AppSidebar";
import { UserMenu } from "./UserMenu";
import { ThemeToggle } from "@/components/theme-toggle";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

/**
 * App shell: a dark brand rail for navigation (sidebar tokens) and a light
 * content canvas. Works as a collapsible rail on desktop and as an off-canvas
 * sheet on mobile, both via the same shadcn Sidebar primitives.
 */
const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({ children }) => {
  const { pathname } = useLocation();
  const isFirstRender = useRef(true);

  // Move focus to the content region on navigation so keyboard and screen
  // reader users land in the new screen instead of staying on the header.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    document.getElementById("content")?.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
        >
          Saltar para o conteúdo
        </a>
        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b bg-background/85 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/75">
          <SidebarTrigger aria-label="Abrir ou fechar menu" />
          <Separator orientation="vertical" className="h-5" />
          <div className="ml-auto flex items-center gap-1">
            <ThemeToggle />
            <UserMenu />
          </div>
        </header>

        <main
          id="content"
          tabIndex={-1}
          className="flex-1 px-4 py-6 outline-none md:px-8 md:py-8"
        >
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AuthenticatedLayout;
