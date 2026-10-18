import React, { useMemo } from "react";
import { Building2, Crosshair, Mail, Phone, Send, Users } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmployeeType } from "@/types/employee";
import { userInitials } from "@/types/user";
import { cn } from "@/lib/utils";

interface EmployeeDetailsSheetProps {
  employee: EmployeeType | null;
  allEmployees: EmployeeType[];
  onClose: () => void;
  /** Opens another person's profile inside the same sheet. */
  onNavigate: (employee: EmployeeType) => void;
  /** Closes the sheet and pans the chart to this person's card. */
  onCenterOnTree: (employee: EmployeeType) => void;
}

interface ContactRowProps {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
  label: string;
  children: React.ReactNode;
}

function ContactRow({ icon: Icon, label, children }: ContactRowProps) {
  return (
    <div className="flex items-center gap-3 border-b border-border/60 py-2.5 last:border-0">
      <Icon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      <span className="w-24 shrink-0 text-xs text-muted-foreground">{label}</span>
      {children}
    </div>
  );
}

/**
 * Profile panel ported from the Open Design organogram prototype, rebuilt on
 * the app's Sheet primitive: contacts, reporting line navigation, team stats
 * and bio. Fixture data carries no location, so the department row stands in
 * instead of inventing one.
 */
export const EmployeeDetailsSheet: React.FC<EmployeeDetailsSheetProps> = ({
  employee,
  allEmployees,
  onClose,
  onNavigate,
  onCenterOnTree,
}) => {
  const info = useMemo(() => {
    if (!employee) return null;
    const manager = allEmployees.find((candidate) => candidate.id === employee.managerId) ?? null;
    const directReports = allEmployees.filter((candidate) => candidate.managerId === employee.id);
    const countTeam = (id: string): number =>
      allEmployees
        .filter((candidate) => candidate.managerId === id)
        .reduce((sum, candidate) => sum + 1 + countTeam(candidate.id), 0);
    let level = 1;
    let current = employee;
    while (current.managerId) {
      const managerCandidate = allEmployees.find((c) => c.id === current.managerId);
      if (!managerCandidate) break;
      level += 1;
      current = managerCandidate;
    }
    return { manager, directReports, team: countTeam(employee.id), level };
  }, [employee, allEmployees]);

  return (
    <Sheet open={!!employee} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="flex w-full flex-col overflow-y-auto sm:max-w-[400px]">
        {employee && info && (
          <div className="flex min-h-0 flex-1 flex-col">
            <SheetHeader className="items-center text-center">
              <Avatar className="size-20 border">
                <AvatarFallback
                  className={cn(
                    "text-lg font-semibold",
                    employee.managerId === null
                      ? "bg-primary text-primary-foreground"
                      : "bg-foreground text-background"
                  )}
                >
                  {userInitials(employee.name)}
                </AvatarFallback>
              </Avatar>
              <SheetTitle className="mt-3 text-2xl">{employee.name}</SheetTitle>
              <SheetDescription>{employee.title}</SheetDescription>
              <Badge variant="outline" className="mt-1 font-normal text-muted-foreground">
                {employee.department}
              </Badge>
            </SheetHeader>

            <div className="mt-6 border-t pt-2" role="list" aria-label="Contactos">
              <ContactRow icon={Mail} label="Email">
                <a
                  href={`mailto:${employee.email}`}
                  className="min-w-0 flex-1 break-all text-sm text-foreground transition-colors duration-fast hover:text-primary"
                >
                  {employee.email}
                </a>
              </ContactRow>
              <ContactRow icon={Phone} label="Telefone">
                <a
                  href={`tel:${employee.phone.replace(/\s/g, "")}`}
                  className="min-w-0 flex-1 text-sm tabular-nums text-foreground transition-colors duration-fast hover:text-primary"
                >
                  {employee.phone}
                </a>
              </ContactRow>
              <ContactRow icon={Building2} label="Departamento">
                <span className="min-w-0 flex-1 text-sm text-foreground">{employee.department}</span>
              </ContactRow>
              <ContactRow icon={Users} label="Reporta a">
                {info.manager ? (
                  <Button
                    variant="ghost"
                    className="h-auto min-w-0 justify-start gap-2 p-1"
                    onClick={() => onNavigate(info.manager!)}
                  >
                    <Avatar className="size-6">
                      <AvatarFallback className="bg-primary/10 text-[10px] font-semibold text-primary">
                        {userInitials(info.manager.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate">{info.manager.name}</span>
                  </Button>
                ) : (
                  <span className="min-w-0 flex-1 text-sm text-muted-foreground">
                    Topo da hierarquia organizacional
                  </span>
                )}
              </ContactRow>
            </div>

            <div className="mt-5">
              <h3 className="mb-2 text-xs font-medium text-muted-foreground">Equipa</h3>
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-lg border bg-background p-3">
                  <p className="font-mono text-lg tabular-nums">{info.directReports.length || "—"}</p>
                  <p className="mt-1 text-[10.5px] leading-tight text-muted-foreground">reportes diretos</p>
                </div>
                <div className="rounded-lg border bg-background p-3">
                  <p className="font-mono text-lg tabular-nums">{info.team || "—"}</p>
                  <p className="mt-1 text-[10.5px] leading-tight text-muted-foreground">pessoas na equipa</p>
                </div>
                <div className="rounded-lg border bg-background p-3">
                  <p className="font-mono text-lg tabular-nums">{info.level}º</p>
                  <p className="mt-1 text-[10.5px] leading-tight text-muted-foreground">nível</p>
                </div>
              </div>
            </div>

            {info.directReports.length > 0 && (
              <div className="mt-5">
                <h3 className="mb-2 text-xs font-medium text-muted-foreground">Subordinados diretos</h3>
                <ul className="flex flex-wrap gap-1.5">
                  {info.directReports.map((report) => (
                    <li key={report.id}>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-8"
                        onClick={() => onNavigate(report)}
                      >
                        {report.name}
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {employee.bio && (
              <div className="mt-5">
                <h3 className="mb-2 text-xs font-medium text-muted-foreground">Sobre</h3>
                <p className="text-sm leading-relaxed text-foreground">{employee.bio}</p>
              </div>
            )}

            <div className="mt-6 flex gap-2">
              <Button
                variant="outline"
                className="flex-1 gap-2"
                onClick={() => onCenterOnTree(employee)}
              >
                <Crosshair className="size-4" aria-hidden="true" />
                Centrar na árvore
              </Button>
              <Button asChild className="flex-1 gap-2">
                <a href={`mailto:${employee.email}`}>
                  <Send className="size-4" aria-hidden="true" />
                  Enviar email
                </a>
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
