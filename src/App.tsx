import { lazy, Suspense } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { CurrentUserProvider } from "@/contexts/CurrentUserContext";
import { RequireRole } from "@/components/auth/RequireRole";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Route-level code splitting: each screen ships in its own chunk (B7).
const Index = lazy(() => import("./pages/Index"));
const Checklist = lazy(() => import("./pages/Checklist"));
const Learning = lazy(() => import("./pages/Learning"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ITSupport = lazy(() => import("./pages/ITSupport"));
const SupportTicket = lazy(() => import("./pages/SupportTicket"));
const OrgChart = lazy(() => import("./pages/OrgChart"));
const Documents = lazy(() => import("./pages/Documents"));
const Benefits = lazy(() => import("./pages/Benefits"));
const Feedback = lazy(() => import("./pages/Feedback"));
const RoadmapPlaceholder = lazy(() => import("./pages/RoadmapPlaceholder"));

const queryClient = new QueryClient();

const PageFallback = () => (
  <div className="flex min-h-[60vh] items-center justify-center" aria-busy="true">
    <Skeleton className="h-12 w-12 rounded-full" />
    <span className="sr-only">A carregar…</span>
  </div>
);

const App = () => (
  <ThemeProvider defaultTheme="system" storageKey="conecta.theme">
    <CurrentUserProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          {/* Single toast system (Sonner). The Radix toaster was removed. */}
          <Sonner position="bottom-right" />
          <BrowserRouter>
            <ErrorBoundary>
              <Suspense fallback={<PageFallback />}>
                <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/checklist" element={<Checklist />} />
                <Route path="/learning" element={<Learning />} />
                <Route path="/it-support" element={<ITSupport />} />
                <Route path="/support/ticket" element={<SupportTicket />} />
                <Route path="/org-chart" element={<OrgChart />} />
                <Route path="/documents" element={<Documents />} />
                <Route path="/benefits" element={<Benefits />} />
                <Route
                  path="/pessoas"
                  element={
                    <RequireRole roles={["HR"]}>
                      <RoadmapPlaceholder
                        milestone="M2"
                        title="Pessoas"
                        description="As admissões, mudanças de função e saídas serão geridas neste ecrã. Cada alteração ficará registada num registo de auditoria imutável, com a descrição de quem fez o quê e quando."
                      />
                    </RequireRole>
                  }
                />
                <Route
                  path="/aprovacoes"
                  element={
                    <RequireRole roles={["Manager"]}>
                      <RoadmapPlaceholder
                        milestone="M3"
                        title="Aprovações"
                        description="A fila de aprovações de acessos para gestores: pedidos com justificação, tempo restante para decisão e bloqueios de separação de funções."
                      />
                    </RequireRole>
                  }
                />
                <Route
                  path="/auditoria"
                  element={
                    <RequireRole roles={["IAMAdmin"]}>
                      <RoadmapPlaceholder
                        milestone="M3"
                        title="Auditoria"
                        description="O registo append-only de alterações de identidade: filtros, correlation id, diffs antes/depois e exportação de evidência."
                      />
                    </RequireRole>
                  }
                />
                <Route path="/feedback" element={<Feedback />} />
                <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </CurrentUserProvider>
  </ThemeProvider>
);

export default App;
