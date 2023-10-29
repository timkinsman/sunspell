type ConditionalWrapperProps = {
  children: React.ReactElement;
  condition: boolean;
  wrapper: (children: React.ReactElement) => JSX.Element;
};

export const ConditionalWrapper = ({ condition, wrapper, children }: ConditionalWrapperProps) =>
  condition ? wrapper(children) : children;
