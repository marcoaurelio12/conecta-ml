
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import AuthenticatedLayout from "@/components/layouts/AuthenticatedLayout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <AuthenticatedLayout>
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">Oops! Página não encontrada</p>
        <Button asChild>
          <Link to="/">Voltar ao Painel</Link>
        </Button>
      </div>
    </AuthenticatedLayout>
  );
};

export default NotFound;
