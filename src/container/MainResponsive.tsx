import React from 'react';

interface MainResponsiveProps {
  className?: string;
  children: React.ReactNode;
}

function MainResponsive({ className, children }: MainResponsiveProps): JSX.Element {
  const wholeClassName = 'flex flex-1 flex-col overflow-auto px-4 pt-4 text-white ' + className;

  return <div className={wholeClassName}>{children}</div>;
}

export default MainResponsive;
