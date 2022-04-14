import React from 'react';

interface Props {
  title: string;
  isAccount?: boolean;
}
function HeaderWithTitle({ title, isAccount }: Props) {
  return (
    <div className='flex flex-row w-full p-4 items-center justify-between bg-light-gray text-rouge-blue rounded-md'>
      {isAccount ? <div className='text-sm font-normal'>Terms</div> : <div />}
      <div className='text-lg font-bold capitalize'>{title}</div>
      {isAccount ? <div className='text-sm font-normal'>Sign Out</div> : <div />}
    </div>
  );
}

export default HeaderWithTitle;
