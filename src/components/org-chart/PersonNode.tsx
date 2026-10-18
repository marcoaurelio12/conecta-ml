import React from "react";
import { cn } from "@/lib/utils";
import { EmployeeType } from "@/types/employee";
import { userInitials } from "@/types/user";

interface PersonNodeProps {
  employee: EmployeeType;
  /** Direct reports — drives the footer counter and the avatar treatment. */
  directCount: number;
  /** Everyone beneath this person — shown as the collapsed toggle's "+N". */
  teamCount: number;
  isRoot?: boolean;
  isCurrentUser?: boolean;
  isMatch?: boolean;
  isDim?: boolean;
  /** How the card was activated — the canvas uses it to ignore pan-drag clicks. */
  onClick?: (employee: EmployeeType, source: "pointer" | "keyboard") => void;
}

/**
 * Person card ported from the Open Design organogram prototype: initials
 * avatar, two-line role, department chip and a direct-report counter. The
 * root card inverts, the signed-in person is ringed, and search either rings
 * a match or dims everyone else — never colour alone, the chip and name stay
 * readable in every state. The whole card is a single keyboard-operable
 * control; truncated values stay reachable through the profile sheet.
 */
export const PersonNode: React.FC<PersonNodeProps> = ({
  employee,
  directCount,
  teamCount,
  isRoot,
  isCurrentUser,
  isMatch,
  isDim,
  onClick,
}) => {
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick?.(employee, "keyboard");
    }
  };

  const ring = isMatch
    ? "ring-[3px] ring-primary/40"
    : isCurrentUser
      ? "ring-2 ring-ring/70"
      : "";

  return (
    <article
      role="button"
      tabIndex={0}
      data-employee-id={employee.id}
      aria-label={`${employee.name}, ${employee.title}. Abrir perfil`}
      onClick={() => onClick?.(employee, "pointer")}
      onKeyDown={handleKeyDown}
      className={cn(
        "w-[216px] cursor-pointer rounded-2xl border bg-card p-3.5 text-left shadow-sm",
        "max-[920px]:w-[184px]",
        "transition-[border-color,box-shadow,transform,opacity] duration-fast ease-out motion-reduce:transition-none",
        "hover:-translate-y-px hover:shadow-lg motion-reduce:hover:translate-y-0",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        isRoot ? "border-primary bg-primary text-primary-foreground" : "border-border",
        !isRoot && !isMatch && "hover:border-muted-foreground/40",
        isDim && "opacity-20",
        isMatch && !isRoot && "border-foreground",
        ring
      )}
    >
      <div className="flex items-center gap-2.5">
        <span
          aria-hidden="true"
          className={cn(
            "grid size-[38px] shrink-0 place-items-center rounded-full text-xs font-medium tracking-wide",
            isRoot
              ? "bg-primary-foreground text-primary"
              : directCount > 0
                ? "bg-foreground text-background"
                : "border border-border bg-background text-foreground"
          )}
        >
          {userInitials(employee.name)}
        </span>
        <div className="min-w-0">
          <h3 className="truncate text-sm font-medium leading-tight">{employee.name}</h3>
          <p
            className={cn(
              "mt-0.5 line-clamp-2 text-xs leading-snug",
              isRoot ? "text-primary-foreground/75" : "text-muted-foreground"
            )}
          >
            {employee.title}
          </p>
        </div>
      </div>
      <div className="mt-2.5 flex items-center justify-between gap-2">
        <span
          className={cn(
            "inline-flex max-w-[130px] items-center rounded-full border px-2.5 py-0.5 text-[10.5px] leading-4",
            isRoot
              ? "border-primary-foreground/30 text-primary-foreground/80"
              : "border-border text-muted-foreground"
          )}
        >
          <span className="truncate">{employee.department}</span>
        </span>
        {directCount > 0 && (
          <span
            title={`${teamCount} pessoas na equipa`}
            className={cn(
              "whitespace-nowrap font-mono text-[10.5px] tabular-nums",
              isRoot ? "text-primary-foreground/75" : "text-muted-foreground"
            )}
          >
            {directCount} diretos
          </span>
        )}
      </div>
    </article>
  );
};
