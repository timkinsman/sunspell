import { toggleElement } from '@/utils/toggleElement';
import * as React from 'react';

export const useArray = <T>(initial: T[] = []) => {
  const [array, setArray] = React.useState(initial);

  const add = React.useCallback((item: T) => setArray([...array, item]), [array]);
  const remove = React.useCallback((item: T) => setArray(array.filter((k) => k !== item)), [array]);
  const removeAll = React.useCallback(() => setArray([]), []);
  const toggle = React.useCallback((item: T) => setArray(toggleElement(array, item)), [array]);

  return { array, setArray, add, remove, removeAll, toggle };
};
