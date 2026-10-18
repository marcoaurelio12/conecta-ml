import React from "react";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { useCurrentUser } from "@/contexts/CurrentUserContext";
import { roleLabels, userInitials } from "@/types/user";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const UserMenu: React.FC = () => {
  const { user } = useCurrentUser();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-10 gap-2 px-1.5 sm:px-2"
          aria-label={`Menu do utilizador: ${user.name}`}
        >
          <Avatar className="size-8 border">
            <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
              {userInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <span className="hidden flex-col items-start leading-tight sm:flex">
            <span className="text-sm font-medium">{user.name}</span>
            <span className="text-xs text-muted-foreground">{roleLabels[user.role]}</span>
          </span>
          <ChevronDown className="hidden size-4 text-muted-foreground sm:block" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium">{user.name}</span>
            <span className="text-xs text-muted-foreground">{user.email}</span>
            <span className="mt-1 inline-flex w-fit rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
              {roleLabels[user.role]} · {user.department}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault();
            toast.info("Sessão simulada — o início de sessão com Entra ID chega no M1.");
          }}
        >
          Terminar sessão
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
