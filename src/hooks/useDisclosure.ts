import * as React from 'react';

/**
 * https://github.com/alan2207/bulletproof-react/blob/master/src/hooks/useDisclosure.ts
 */
export const useDisclosure = (initial = false) => {
  const [isOpen, setIsOpen] = React.useState(initial);

  const open = React.useCallback(() => setIsOpen(true), []);
  const close = React.useCallback(() => setIsOpen(false), []);
  const toggle = React.useCallback(() => setIsOpen((state) => !state), []);

  return { isOpen, open, close, toggle };
};
