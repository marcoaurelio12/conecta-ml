
import React from "react";
import { UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EmployeeType } from "@/types/employee";

const departmentColors: Record<string, string> = {
  Executive: "bg-portugalPalette-dark-blue-2 border-portugalPalette-dark-blue-1",
  Technology: "bg-portugalPalette-dark-blue-1 border-portugalPalette-blue",
  Finance: "bg-portugalPalette-light-blue-2 border-portugalPalette-blue",
  Marketing: "bg-portugalPalette-blue border-portugalPalette-light-blue-2",
  HR: "bg-portugalPalette-light-blue-1 border-portugalPalette-light-blue-2",
  Sales: "bg-portugalPalette-light-blue-1 border-portugalPalette-blue",
};

interface PersonNodeProps {
  employee: EmployeeType;
  onClick?: (employee: EmployeeType) => void;
  className?: string;
}

export const PersonNode: React.FC<PersonNodeProps> = ({
  employee,
  onClick,
  className
}) => {
  const departmentColor = departmentColors[employee.department] || "bg-background border-border";

  return (
    <div
      className={cn(
        "flex flex-col items-center p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg",
        departmentColor,
        className
      )}
      onClick={() => onClick?.(employee)}
    >
      <Avatar className="h-16 w-16 mb-2">
        <AvatarImage src={employee.imageUrl} alt={employee.name} />
        <AvatarFallback>
          <UserRound className="h-8 w-8 text-muted-foreground" />
        </AvatarFallback>
      </Avatar>
      <h3 className="font-medium text-center">{employee.name}</h3>
      <p className="text-sm text-muted-foreground text-center">{employee.title}</p>
    </div>
  );
};
