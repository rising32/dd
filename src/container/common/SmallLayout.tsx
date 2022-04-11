import React from 'react';

interface Props {
  className?: string;
  children: React.ReactNode;
}

function SmallLayout({ className, children }: Props): JSX.Element {
  const wholeClassName = 'bg-card-gray shadow-xl' + className;

  return <div className={wholeClassName}>{children}</div>;
}

export default SmallLayout;
