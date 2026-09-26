
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Benefit } from "@/types/benefit";
import * as Icons from "lucide-react";
import { Icon } from "lucide-react";

interface BenefitCardProps {
  benefit: Benefit;
}

const getIconColor = (color: string) => {
  const colorMap: Record<string, string> = {
    blue: "text-portugalPalette-dark-blue-1",
    green: "text-portugalPalette-light-blue-2",
    purple: "text-portugalPalette-dark-blue-2",
    orange: "text-portugalPalette-blue",
    yellow: "text-portugalPalette-light-blue-1"
  };
  return colorMap[color] || "text-primary";
};

const getBadgeVariant = (status: string) => {
  const variantMap: Record<string, "default" | "secondary" | "outline"> = {
    Elegível: "outline",
    Inscrito: "default",
    Pendente: "secondary"
  };
  return variantMap[status] || "outline";
};

const BenefitCard: React.FC<BenefitCardProps> = ({ benefit }) => {
  // Dynamically get icon from Lucide
  const IconComponent = benefit.icon in Icons 
    ? (Icons as any)[benefit.icon.charAt(0).toUpperCase() + benefit.icon.slice(1)]
    : Icons.HelpCircle;
  
  return (
    <Card className="overflow-hidden transition-all duration-200 hover:translate-y-[-2px] hover:shadow-lg">
      <CardContent className="p-0">
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-start justify-between mb-3">
            <div className={`p-2 rounded-md border ${getIconColor(benefit.color)}`}>
              <IconComponent size={24} />
            </div>
            <Badge variant={getBadgeVariant(benefit.status)}>{benefit.status}</Badge>
          </div>
          
          <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
          <p className="text-muted-foreground mb-6 flex-grow">{benefit.summary}</p>
          
          <Link to={`/benefits/${benefit.id}`}>
            <Button 
              className="w-full"
              variant={benefit.status === "Eligible" ? "default" : "secondary"}
            >
              {benefit.status === "Elegível" ? "Inscrever-se Agora" : "Saber Mais"}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default BenefitCard;
