import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import AuthenticatedLayout from "@/components/layouts/AuthenticatedLayout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404: rota inexistente:", location.pathname);
  }, [location.pathname]);

  return (
    <AuthenticatedLayout>
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="mb-6 flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Compass className="size-8" aria-hidden="true" />
        </div>
        <h1 className="text-5xl font-bold tracking-tight">404</h1>
        <p className="mt-3 max-w-md text-lg text-muted-foreground">
          Esta página não existe ou foi movida. O caminho que tentou abrir foi{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-sm">{location.pathname}</code>.
        </p>
        <Button asChild className="mt-8">
          <Link to="/">Voltar ao Início</Link>
        </Button>
      </div>
    </AuthenticatedLayout>
  );
};

export default NotFound;
