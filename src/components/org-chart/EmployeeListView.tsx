
import React from "react";
import { EmployeeType } from "@/types/employee";
import { PersonNode } from "./PersonNode";

interface EmployeeListViewProps {
  employees: EmployeeType[];
  onEmployeeClick: (employee: EmployeeType) => void;
}

export const EmployeeListView: React.FC<EmployeeListViewProps> = ({ 
  employees, 
  onEmployeeClick 
}) => {
  return (
    <div className="space-y-4">
      {employees.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Nenhum colaborador encontrado</p>
        </div>
      ) : (
        employees.map(employee => (
          <PersonNode 
            key={employee.id} 
            employee={employee} 
            onClick={onEmployeeClick} 
            className="shadow-sm w-full"
          />
        ))
      )}
    </div>
  );
};
