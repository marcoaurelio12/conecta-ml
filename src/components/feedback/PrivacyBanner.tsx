
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const PrivacyBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(() => {
    const saved = localStorage.getItem("privacy-banner-dismissed");
    return saved === "true";
  });

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem("privacy-banner-dismissed", "true");
  };

  if (dismissed) {
    return null;
  }

  return (
    <Alert className="mb-6 bg-muted/50 border border-muted" role="status">
      <div className="flex items-start justify-between">
        <AlertDescription className="text-sm">
          O seu feedback ajuda-nos a melhorar. Todas as respostas são recolhidas de acordo com a nossa{" "}
          <Link 
            to="/documents/privacy-policy" 
            className="font-medium underline underline-offset-4 hover:text-primary"
          >
            Política de Privacidade
          </Link>
          .
        </AlertDescription>
        <button 
          onClick={handleDismiss} 
          className="ml-4 text-muted-foreground hover:text-foreground"
          aria-label="Ignorar aviso de privacidade"
        >
          <X size={16} />
        </button>
      </div>
    </Alert>
  );
};

export default PrivacyBanner;
