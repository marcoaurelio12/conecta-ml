
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
        "block rounded-lg border bg-card p-4 text-card-foreground transition-all duration-fast",
        "hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
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
