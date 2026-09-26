
import React from 'react';
import { HelpCircle } from 'lucide-react';
import { QuickLink } from './QuickLink';

export const ITSupportQuickLink = () => {
  return (
    <QuickLink
      icon={<HelpCircle className="h-6 w-6" />}
      title="Suporte TI"
      description="Obtém ajuda com problemas técnicos e acesso a guias de instalação."
      href="/it-support"
    />
  );
};
