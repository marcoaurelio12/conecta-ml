
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface QuickLinkProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  className?: string;
}

export const QuickLink: React.FC<QuickLinkProps> = ({ 
  icon, 
  title, 
  description, 
  href, 
  className 
}) => {
  return (
    <Link 
      to={href} 
      className={cn(
        "block p-4 border rounded-lg transition-all duration-200",
        "hover:shadow-md hover:-translate-y-1 hover:border-primary/50",
        "bg-card text-card-foreground",
        className
      )}
    >
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0 rounded-md p-2 bg-primary/5 text-primary">
          {icon}
        </div>
        <div>
          <h3 className="font-medium mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </Link>
  );
};
