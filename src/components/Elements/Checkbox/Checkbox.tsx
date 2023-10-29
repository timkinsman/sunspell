import React from 'react';

export const Checkbox = ({
  checked,
  onCheckedChange,
  disabled,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}) => {
  return (
    <div className="flex items-center mb-4">
      <input
        id="checkbox"
        type="checkbox"
        value=""
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 dark:bg-gray-700"
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
