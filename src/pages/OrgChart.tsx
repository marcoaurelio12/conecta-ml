
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  MapPin,
  Search,
  UserRound,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { useIsMobile } from "@/hooks/use-mobile";
import { EmployeeDetailsDialog } from "@/components/org-chart/EmployeeDetailsDialog";
import { Button } from "@/components/ui/button";
import { employeeData } from "@/data/employeeData";
import { EmployeeType } from "@/types/employee";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";

// Define the structure for the org chart node
interface OrgChartNode {
  id: string;
  entity: {
    id: string;
    avatar?: string;
    name: string;
    title: string;
  };
  children: OrgChartNode[];
}

// Function to transform flat employee data into a tree structure
const buildOrgTree = (employees: EmployeeType[]): OrgChartNode | null => {
  const employeeMap: { [key: string]: OrgChartNode } = {};
  let root: OrgChartNode | null = null;

  // Create a map of employees for easy lookup
  employees.forEach(employee => {
    employeeMap[employee.id] = {
      id: employee.id,
      entity: {
        id: employee.id,
        avatar: employee.imageUrl, // Using imageUrl as avatar
        name: employee.name,
        title: employee.title,
      },
      children: [],
    };
  });

  // Build the tree
  employees.forEach(employee => {
    if (employee.managerId === null) {
      // This is the root employee
      root = employeeMap[employee.id];
    } else {
      // Find the manager and add the employee as a child
      const manager = employeeMap[employee.managerId];
      if (manager) {
        manager.children.push(employeeMap[employee.id]);
      }
    }
  });

  return root;
};


const OrgChart = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeType | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const isMobile = useIsMobile();

  const { data: employees = [], isLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: () => {
      // In a real app, fetch from API
      return Promise.resolve(employeeData);
    },
  });

  const orgTreeData = buildOrgTree(employees);

  const filteredEmployees = debouncedSearchQuery
    ? employees.filter(emp =>
        emp.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        emp.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()))
    : employees;

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleCenterOnMe = () => {
    // In a real app, you would get the current user's ID
    const currentUserID = "1"; // CEO for demo
    const employee = employees.find(emp => emp.id === currentUserID);
    if (employee) {
      setSelectedEmployee(employee);
    }
  };

  // Function to handle node clicks in the new OrgChart
  const handleNodeClick = (nodeId: string) => {
    const employee = employees.find(emp => emp.id === nodeId);
    if (employee) {
      setSelectedEmployee(employee);
    }
  };


  return (
    <DashboardLayout>
      <div className="container p-4 max-w-7xl mx-auto">

        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <h1 className="text-2xl font-bold">Organograma Interativo</h1>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar colaboradores..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 min-h-[500px]">
            <div className="flex justify-between mb-4">
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" onClick={handleZoomIn}>
                  <ZoomIn className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Aumentar Zoom</span>
                </Button>
                <Button size="sm" variant="outline" onClick={handleZoomOut}>
                  <ZoomOut className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Diminuir Zoom</span>
                </Button>
              </div>
              <Button size="sm" onClick={handleCenterOnMe}>
                <MapPin className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Centrar em Mim</span>
              </Button>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-96">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : (
              <>
                {/* The new OrgChart component will handle both mobile and desktop visualization */}
                {orgTreeData && (
                  <OrgChartVisualization
                    employees={employees}
                    zoomLevel={zoomLevel}
                    onNodeClick={handleNodeClick}
                  />
                )}
              </>
            )}
          </div>
        </div>

        {selectedEmployee && (
          <EmployeeDetailsDialog
            employee={selectedEmployee}
            open={!!selectedEmployee}
            onClose={() => setSelectedEmployee(null)}
            allEmployees={employees}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default OrgChart;
