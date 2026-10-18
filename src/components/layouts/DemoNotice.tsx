import React from "react";
import { FlaskConical } from "lucide-react";
import { isDemoMode, repositoryUrl } from "@/config/demo";

/**
 * Header notice for the public demo build: says the company and people are
 * fictional and where to switch roles, and links to the source.
 */
export const DemoNotice: React.FC = () => {
  if (!isDemoMode) return null;

  return (
    <p className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
      <FlaskConical className="size-4 shrink-0 text-warning" aria-hidden="true" />
      <span className="truncate">
        <span className="font-medium text-foreground">Demonstração</span>
        <span className="hidden sm:inline">
          {" "}· empresa e pessoas fictícias · troque de papel no menu lateral ·{" "}
          <a
            href={repositoryUrl}
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 hover:text-foreground"
          >
            código no GitHub
          </a>
        </span>
      </span>
    </p>
  );
};
