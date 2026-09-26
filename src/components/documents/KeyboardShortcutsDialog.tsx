
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from '@/components/ui/table';

interface KeyboardShortcutsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const KeyboardShortcutsDialog: React.FC<KeyboardShortcutsDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const shortcuts = [
    { key: '/', description: 'Focar barra de pesquisa' },
    { key: '?', description: 'Abrir este diálogo de ajuda' },
    { key: 'Esc', description: 'Limpar pesquisa ou fechar diálogo' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Atalhos de Teclado</DialogTitle>
          <DialogDescription>
            Use estes atalhos de teclado para navegar na biblioteca de documentos de forma mais eficiente.
          </DialogDescription>
        </DialogHeader>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Tecla</TableHead>
              <TableHead>Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shortcuts.map((shortcut) => (
              <TableRow key={shortcut.key}>
                <TableCell>
                  <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">
                    {shortcut.key}
                  </kbd>
                </TableCell>
                <TableCell>{shortcut.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
};
