import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Milestone } from "lucide-react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface RoadmapPlaceholderProps {
  milestone: "M2" | "M3";
  title: string;
  description: string;
}

/**
 * Honest placeholder for a planned screen. It states what will exist and when,
 * instead of simulating product UI that does not exist yet.
 */
const RoadmapPlaceholder: React.FC<RoadmapPlaceholderProps> = ({
  milestone,
  title,
  description,
}) => {
  return (
    <DashboardLayout>
      <Card className="mx-auto max-w-xl">
        <CardHeader>
          <div className="mb-2 flex items-center gap-2">
            <Badge variant="secondary">
              <Milestone className="mr-1 h-3 w-3" aria-hidden="true" />
              {milestone}
            </Badge>
            <span className="text-xs text-muted-foreground">Ecrã previsto no roadmap</span>
          </div>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 sm:flex-row">
          <Button asChild variant="outline">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
              Voltar ao Início
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link to="/checklist">Continuar a integração</Link>
          </Button>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default RoadmapPlaceholder;
