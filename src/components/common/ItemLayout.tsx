import React from 'react';

interface Props {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

function ItemLayout({ className, children, onClick }: Props): JSX.Element {
  const wholeClassName = 'flex flex-row px-2 py-2 rounded-md items-center justify-between ' + className;

  return (
    <div className={wholeClassName} onClick={onClick}>
      {children}
    </div>
  );
}

export default ItemLayout;
