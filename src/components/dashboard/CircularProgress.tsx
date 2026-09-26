
import React from 'react';

interface CircularProgressProps {
  value: number;
  maxValue?: number;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({ 
  value, 
  maxValue = 100 
}) => {
  const percentage = Math.min(100, Math.max(0, (value / maxValue) * 100));
  const circumference = 2 * Math.PI * 40; // 40 is the radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="w-24 h-24 transform -rotate-90">
        <circle
          cx="48"
          cy="48"
          r="40"
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          className="text-muted opacity-20"
        />
        <circle
          cx="48"
          cy="48"
          r="40"
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="text-primary transition-all duration-1000 ease-out"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center flex-col">
        <span className="text-2xl font-bold">{Math.round(percentage)}%</span>
        <span className="text-xs text-muted-foreground">Completo</span>
      </div>
    </div>
  );
};
