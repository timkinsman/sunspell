import clsx from 'clsx';
import React from 'react';

const sizes = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

export const Checkbox = ({
  checked,
  onCheckedChange,
  disabled,
  size = 'sm',
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: keyof typeof sizes;
}) => {
  return (
    <div className="flex items-center mb-4">
      <input
        id="checkbox"
        type="checkbox"
        value=""
        className={clsx(
          'text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 dark:bg-gray-700',
          sizes[size]
        )}
        checked={checked}
        onChange={() => onCheckedChange(!checked)}
        disabled={disabled}
      />
      {/* <label
        htmlFor="checkbox"
        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
      >
        Default checkbox
      </label> */}
    </div>
  );
};
