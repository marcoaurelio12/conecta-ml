import { Component, type ErrorInfo, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Last-resort boundary around the lazy routes: a failed or crashing chunk no
 * longer strands the user on an eternal skeleton.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Erro não tratado na interface:", error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
        <div className="mb-6 flex size-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertTriangle className="size-8" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Algo correu inesperadamente</h1>
        <p className="mt-2 max-w-md text-muted-foreground">
          O ecrã não conseguiu carregar. Recarregar a página resolve na maioria dos casos — o
          seu progresso está guardado.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button onClick={() => window.location.reload()}>
            <RotateCcw className="mr-2 size-4" aria-hidden="true" />
            Recarregar a página
          </Button>
          <Button variant="outline" asChild>
            <Link to="/">Voltar ao Início</Link>
          </Button>
        </div>
      </div>
    );
  }
}
