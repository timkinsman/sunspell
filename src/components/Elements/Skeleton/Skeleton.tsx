import clsx from 'clsx';
import React from 'react';

const shapes = {
  square: 'rounded-none',
  rounded: 'rounded',
  circle: 'rounded-full',
};

type SkeletonProps = {
  children?: React.ReactNode;
  className?: string;
  shape?: 'square' | 'rounded' | 'circle';
};

export const Skeleton = ({ children, className = '', shape = 'rounded' }: SkeletonProps) => {
  return (
    <div
      role="status"
      className={clsx('w-full animate-pulse overflow-hidden', shapes[shape], className)}
    >
      <div className="h-full bg-gray-300">{children}</div> {/** dark:bg-gray-700 */}
      <span className="sr-only">Loading...</span>
    </div>
  );
};
