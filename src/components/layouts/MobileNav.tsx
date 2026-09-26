
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface MobileNavProps {
  navItems: Array<{ title: string; href: string }>;
}

const MobileNav: React.FC<MobileNavProps> = ({ navItems }) => {
  const location = useLocation();

  return (
    <div className="md:hidden flex items-center">
      <Sheet>
        <SheetTrigger asChild>
          <button 
            aria-label="Abrir menu"
            className="rounded-full w-10 h-10 flex items-center justify-center bg-primary text-background hover:bg-primary/80 transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[80%] sm:w-[350px] pt-12 bg-background border-r-border">
          <SheetHeader>
            <SheetTitle className="text-xl font-bold mb-4 text-foreground">Navegação</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-2 mt-4">
            {navItems.map((item) => (
              <Link
                key={item.title}
                to={item.href}
                className={cn(
                  "py-3 px-4 rounded-md text-sm font-medium transition-colors hover:bg-secondary",
                  location.pathname === item.href
                    ? "bg-accent text-foreground font-semibold"
                    : "text-foreground"
                )}
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNav;
