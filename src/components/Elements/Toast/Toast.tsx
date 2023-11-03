import React from 'react';
import { Button } from '..';
import { IconButton } from '../IconButton';

export const Toast = ({
  title,
  open,
  action,
  onClose,
}: {
  title: string;
  open: boolean;
  action: () => void;
  onClose: () => void;
}) => {
  if (open) {
    return (
      <div
        id="toast"
        className="fixed bottom-5 inset-x-0 mx-auto flex items-center w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow"
        role="alert"
      >
        <div className="text-sm font-normal">{title}</div>
        <div className="flex items-center ml-auto space-x-2">
          <Button variant="ghost" size="xs" onClick={action}>
            Create playlist
          </Button>
          <IconButton onClick={onClose}>
            <span className="sr-only">Close</span>
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
          </IconButton>
        </div>
      </div>
    );
  }

  return null;
};
