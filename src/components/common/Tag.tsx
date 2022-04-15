import React from 'react';

interface Props {
  className?: string;
  children: React.ReactNode;
}

function Tag({ className, children }: Props): JSX.Element {
  const wholeClassName = 'flex justify-center items-center px-2 rounded-md bg-rouge-blue rounded-full capitalize ' + className;

  return <div className={wholeClassName}>{children}</div>;
}

export default Tag;
