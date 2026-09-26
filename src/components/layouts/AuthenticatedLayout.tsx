
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import MobileNav from './MobileNav';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { title: "Painel", href: "/" },
  { title: "Lista de Verificação", href: "/checklist" },
  { title: "Formação", href: "/learning" },
  { title: "Documentos", href: "/documents" },
  { title: "Suporte", href: "/it-support" },
  { title: "Benefícios", href: "/benefits" },
  { title: "Feedback", href: "/feedback" },
];

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({ children }) => {
  const location = useLocation();
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Header */}
      <header className="border-b border-border bg-foreground sticky top-0 z-40 w-full shadow-md">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="font-bold text-xl" style={{ color: '#2DD4BF' }}>Nortia</Link>
          </div>

          {/* Mobile Menu - centered in navbar */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex md:hidden">
            <MobileNav navItems={navItems} />
          </div>

          {/* Center Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              {navItems.map((item) => (
                <NavigationMenuItem key={item.title}>
                  <Link to={item.href}>
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "text-primary hover:bg-primary hover:text-secondary",
                        location.pathname === item.href && "bg-primary text-background"
                      )}
                    >
                      {item.title}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* User Avatar Dropdown */}
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center gap-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="Menu do utilizador"
                >
                  <Avatar className="h-8 w-8 border border-border">
                    <AvatarImage src="/placeholder.svg" alt="User" />
                    <AvatarFallback className="bg-accent text-foreground">U</AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-4 w-4 text-primary" />
                </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-background border-border">
                  <DropdownMenuItem className="text-foreground hover:bg-secondary">Perfil</DropdownMenuItem>
                  <DropdownMenuItem className="text-foreground hover:bg-secondary">Definições</DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border/30" />
                  <DropdownMenuItem className="text-primary hover:bg-secondary">Terminar sessão</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-background">
        <div className="container py-8 px-4">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AuthenticatedLayout;
