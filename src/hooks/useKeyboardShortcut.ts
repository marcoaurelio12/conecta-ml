
import { useEffect } from 'react';

type KeyHandler = (event: KeyboardEvent) => void;

interface ShortcutOptions {
  metaKey?: boolean;
  altKey?: boolean;
  ctrlKey?: boolean;
  shiftKey?: boolean;
}

export function useKeyboardShortcut(
  key: string,
  callback: KeyHandler,
  options: ShortcutOptions = {}
) {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const { metaKey, altKey, ctrlKey, shiftKey } = options;
      
      if (
        event.key === key &&
        (metaKey === undefined || event.metaKey === metaKey) &&
        (altKey === undefined || event.altKey === altKey) &&
        (ctrlKey === undefined || event.ctrlKey === ctrlKey) &&
        (shiftKey === undefined || event.shiftKey === shiftKey)
      ) {
        callback(event);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [key, callback, options]);
}
