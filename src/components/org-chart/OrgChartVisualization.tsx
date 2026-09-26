
import React, { useRef, useEffect, useState } from "react";
import { EmployeeType } from "@/types/employee";
import { PersonNode } from "./PersonNode";

interface OrgChartVisualizationProps {
  employees: EmployeeType[];
  zoomLevel: number;
  onNodeClick: (employee: EmployeeType) => void;
}

export const OrgChartVisualization: React.FC<OrgChartVisualizationProps> = ({
  employees,
  zoomLevel,
  onNodeClick
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  
  // Build tree structure
  const buildTree = () => {
    const employeeMap = new Map<string, EmployeeType & { children: EmployeeType[] }>();
    
    employees.forEach(emp => {
      employeeMap.set(emp.id, { ...emp, children: [] });
    });
    
    let root = null;
    
    employees.forEach(emp => {
      if (emp.managerId === null) {
        root = employeeMap.get(emp.id);
      } else {
        const manager = employeeMap.get(emp.managerId);
        if (manager) {
          manager.children.push(employeeMap.get(emp.id)!);
        }
      }
    });
    
    return root;
  };
  
  const rootEmployee = buildTree();
  
  // Handle mouse/touch events for panning
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const handleMouseDown = (e: MouseEvent) => {
      setIsDragging(true);
      setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - startPos.x,
          y: e.clientY - startPos.y
        });
      }
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
    };
    
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        setIsDragging(true);
        setStartPos({ 
          x: e.touches[0].clientX - position.x, 
          y: e.touches[0].clientY - position.y 
        });
      }
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches.length === 1) {
        setPosition({
          x: e.touches[0].clientX - startPos.x,
          y: e.touches[0].clientY - startPos.y
        });
      }
    };
    
    const handleTouchEnd = () => {
      setIsDragging(false);
    };
    
    container.addEventListener("mousedown", handleMouseDown);
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("mouseleave", handleMouseUp);
    
    container.addEventListener("touchstart", handleTouchStart);
    container.addEventListener("touchmove", handleTouchMove);
    container.addEventListener("touchend", handleTouchEnd);
    
    return () => {
      container.removeEventListener("mousedown", handleMouseDown);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("mouseleave", handleMouseUp);
      
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging, position, startPos]);
  
  // Recursively render tree nodes
  const renderTreeNode = (node: EmployeeType & { children: EmployeeType[] }) => {
    if (!node) return null;
    
    return (
      <div key={node.id} className="flex flex-col items-center">
        <PersonNode employee={node} onClick={onNodeClick} />
        
        {node.children && node.children.length > 0 && (
          <>
            <div className="w-1 h-8 bg-border"></div>

            <div className="flex flex-row items-start">
              {node.children.map((child, index) => (
                <div key={child.id} className="flex flex-col items-center mx-4">
                  {renderTreeNode(child as EmployeeType & { children: EmployeeType[] })}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className="overflow-hidden h-[600px] relative bg-background rounded-lg"
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
    >
      <div
        className="absolute transition-transform duration-300"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${zoomLevel})`,
          transformOrigin: "center top"
        }}
      >
        {rootEmployee && renderTreeNode(rootEmployee)}
      </div>
    </div>
  );
};
