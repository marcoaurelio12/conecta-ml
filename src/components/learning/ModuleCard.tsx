import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock } from "lucide-react";
import { LearningModule } from "@/data/learningData";
import { ModuleStatus, moduleStatusMeta } from "@/types/status";

interface ModuleCardProps {
  module: LearningModule;
  status: ModuleStatus;
  onClick: () => void;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({ module, status, onClick }) => {
  const meta = moduleStatusMeta[status];

  return (
    <Card className="flex h-full flex-col">
      <CardContent className="flex flex-1 flex-col pt-5">
        <div className="mb-3 flex items-start justify-between gap-2">
          {/* A compact marker instead of a dead cover band: same brand tint,
              none of the 40% card height spent on decoration. */}
          <div
            className="flex size-10 shrink-0 items-center justify-center rounded-md bg-secondary text-primary"
            aria-hidden="true"
          >
            <BookOpen className="size-5" />
          </div>
          <Badge variant={meta.badgeVariant} className="shrink-0">
            {status}
          </Badge>
        </div>
        <h3 className="mb-1.5 font-semibold leading-snug">{module.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-3 min-h-[3.75rem]">
          {module.description}
        </p>
        <div className="mt-auto flex items-center gap-2 pt-4 text-sm text-muted-foreground">
          <Clock className="size-4" aria-hidden="true" />
          <span>{module.duration} min</span>
          <span className="ml-auto text-xs">{module.category}</span>
        </div>
      </CardContent>

      <CardFooter className="pb-5 pt-0">
        <Button className="w-full" variant={status === "Concluído" ? "outline" : "default"} onClick={onClick}>
          {meta.actionLabel}
        </Button>
      </CardFooter>
    </Card>
  );
};
