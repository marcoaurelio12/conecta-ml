export type BenefitCategory = 'Health' | 'Retirement' | 'Wellness' | 'Time Off' | 'Perks' | 'All';

export type BenefitStatus = 'Elegível' | 'Inscrito' | 'Pendente';

/** Fixture icon names; every value must exist in BenefitCard's icon map. */
export type BenefitIcon =
  | 'award'
  | 'baby'
  | 'book'
  | 'brain'
  | 'bus'
  | 'calendar'
  | 'clock'
  | 'credit-card'
  | 'dollar-sign'
  | 'dumbbell'
  | 'handshake'
  | 'heart'
  | 'home'
  | 'piggy-bank'
  | 'shield';

export interface Benefit {
  id: string;
  title: string;
  summary: string;
  description: string;
  category: BenefitCategory;
  status: BenefitStatus;
  icon: BenefitIcon;
  eligibility: string;
  cost: {
    employee: string;
    employer: string;
  };
  enrollmentSteps: string[];
  comparison?: Record<string, string>;
}
