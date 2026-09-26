
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EmployeeType } from "@/types/employee";
import { MapPin, UserRound } from "lucide-react";

interface EmployeeDetailsDialogProps {
  employee: EmployeeType;
  open: boolean;
  onClose: () => void;
  allEmployees: EmployeeType[];
}

export const EmployeeDetailsDialog: React.FC<EmployeeDetailsDialogProps> = ({
  employee,
  open,
  onClose,
  allEmployees,
}) => {
  // Find manager
  const manager = employee.managerId
    ? allEmployees.find(emp => emp.id === employee.managerId)
    : null;

  // Find direct reports
  const directReports = allEmployees.filter(
    emp => emp.managerId === employee.id
  );

  return (
    <Dialog open={open} onOpenChange={isOpen => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{employee.name}</DialogTitle>
          <DialogDescription>{employee.title}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Avatar className="h-24 w-24">
              <AvatarImage src={employee.imageUrl} alt={employee.name} />
              <AvatarFallback>
                <UserRound className="h-12 w-12" />
              </AvatarFallback>
            </Avatar>
            
            <div className="space-y-2 text-center sm:text-left">
              <p><span className="font-semibold">Departamento:</span> {employee.department}</p>
              <p><span className="font-semibold">Email:</span> {employee.email}</p>
              <p><span className="font-semibold">Telefone:</span> {employee.phone}</p>
            </div>
          </div>

          {employee.bio && (
            <div>
              <h4 className="font-semibold mb-1">Bio</h4>
              <p className="text-sm">{employee.bio}</p>
            </div>
          )}

          <div className="border-t pt-4">
            <h4 className="font-semibold mb-2">Linha de Reporte</h4>
            
            {manager ? (
              <div className="flex items-center gap-2 mb-4">
                <div className="font-medium">Reporta a:</div>
                <Button 
                  variant="ghost" 
                  className="flex items-center gap-2 p-1 h-auto" 
                  onClick={() => {
                    onClose();
                    setTimeout(() => {
                      // Open manager's profile
                      const employeeWithEvents = new CustomEvent("open-employee", {
                        detail: { employee: manager }
                      });
                      window.dispatchEvent(employeeWithEvents);
                    }, 300);
                  }}
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={manager.imageUrl} alt={manager.name} />
                    <AvatarFallback><UserRound className="h-3 w-3" /></AvatarFallback>
                  </Avatar>
                  <span>{manager.name}</span>
                </Button>
              </div>
            ) : (
              <p className="text-sm mb-4">Topo da hierarquia organizacional</p>
            )}

            {directReports.length > 0 && (
              <>
                <div className="font-medium mb-2">Subordinados diretos:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {directReports.map(report => (
                    <Button 
                      key={report.id} 
                      variant="ghost" 
                      className="flex items-center justify-start gap-2 p-1 h-auto" 
                      onClick={() => {
                        onClose();
                        setTimeout(() => {
                          // Open direct report's profile
                          const employeeWithEvents = new CustomEvent("open-employee", {
                            detail: { employee: report }
                          });
                          window.dispatchEvent(employeeWithEvents);
                        }, 300);
                      }}
                    >
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={report.imageUrl} alt={report.name} />
                        <AvatarFallback><UserRound className="h-3 w-3" /></AvatarFallback>
                      </Avatar>
                      <span>{report.name}</span>
                    </Button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
