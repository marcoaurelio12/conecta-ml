import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Benefit } from "@/types/benefit";
import { benefitStatusMeta } from "@/types/status";
import {
  Award,
  Baby,
  Book,
  Brain,
  Bus,
  Calendar,
  Clock,
  CreditCard,
  DollarSign,
  Dumbbell,
  Handshake,
  Heart,
  Home,
  PiggyBank,
  Shield,
  type LucideIcon,
} from "lucide-react";
import { BenefitIcon } from "@/types/benefit";

interface BenefitCardProps {
  benefit: Benefit;
  onOpen: (benefit: Benefit) => void;
}

/* Fixture icons are stored as typed strings; the exhaustive map keeps lucide
   tree-shakeable — a star import pulls the whole icon set into the bundle.
   `satisfies` makes a missing icon a compile error instead of a "?" at runtime. */
const iconMap = {
  award: Award,
  baby: Baby,
  book: Book,
  brain: Brain,
  bus: Bus,
  calendar: Calendar,
  clock: Clock,
  "credit-card": CreditCard,
  "dollar-sign": DollarSign,
  dumbbell: Dumbbell,
  handshake: Handshake,
  heart: Heart,
  home: Home,
  "piggy-bank": PiggyBank,
  shield: Shield,
} satisfies Record<BenefitIcon, LucideIcon>;

const BenefitCard: React.FC<BenefitCardProps> = ({ benefit, onOpen }) => {
  const IconComponent = iconMap[benefit.icon];

  return (
    <Card className="flex h-full flex-col transition-all duration-fast hover:-translate-y-0.5 hover:shadow-md">
      <CardContent className="flex h-full flex-col p-6">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div
            className="rounded-md border border-primary/15 bg-primary/10 p-2 text-primary"
            aria-hidden="true"
          >
            <IconComponent size={22} />
          </div>
          <Badge variant={benefitStatusMeta[benefit.status].badgeVariant}>
            {benefit.status}
          </Badge>
        </div>

        <h3 className="mb-1.5 text-lg font-semibold leading-snug">{benefit.title}</h3>
        <p className="mb-6 flex-grow text-sm text-muted-foreground">{benefit.summary}</p>

        {/* The detail lives in this data already — one quiet action opens it. */}
        <Button variant="outline" className="w-full" onClick={() => onOpen(benefit)}>
          Saber mais
        </Button>
      </CardContent>
    </Card>
  );
};

export default BenefitCard;
