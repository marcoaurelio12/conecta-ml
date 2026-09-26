
export type BenefitCategory = 'Health' | 'Retirement' | 'Wellness' | 'Time Off' | 'Perks' | 'All';

export type BenefitStatus = 'Elegível' | 'Inscrito' | 'Pendente';

export interface Benefit {
  id: string;
  title: string;
  summary: string;
  description: string;
  category: BenefitCategory;
  status: BenefitStatus;
  icon: string;
  color: string;
  eligibility: string;
  cost: {
    employee: string;
    employer: string;
  };
  enrollmentSteps: string[];
  comparison?: Record<string, string>;
}
