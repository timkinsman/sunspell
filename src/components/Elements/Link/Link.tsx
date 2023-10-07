import React from 'react';

export type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement>;

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(({ ...props }, ref) => {
  return (
    <a ref={ref} className="underline font-medium" {...props}>
      {props.children}
    </a>
  );
});
