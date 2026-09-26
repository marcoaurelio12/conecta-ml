
import React from 'react';
import { UserRound } from 'lucide-react';
import { QuickLink } from './QuickLink';

export const OrgChartQuickLink = () => {
  return (
    <QuickLink
      icon={<UserRound className="h-6 w-6" />}
      title="Organograma"
      description="Estrutura interativa da empresa com detalhes dos colaboradores."
      href="/org-chart"
    />
  );
};
