import React from 'react';
import { Spinner } from '..';
import clsx from 'clsx';

export type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean;
};

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ type = 'button', isLoading = false, className = '', ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={clsx(
          'text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex items-center justify-center',
          className
        )}
        {...props}
      >
        {isLoading && <Spinner size="sm" className="text-current" />}
        <span>{props.children}</span>
      </button>
    );
  }
);
