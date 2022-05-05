import React, { useState } from 'react';
import { PlusSvg } from '../../assets/svg';

interface Props {
  className?: string;
}
function PlusButton({ className }: Props) {
  return (
    <div className={className}>
      <button type='submit'>
        <div className='flex items-center justify-center bg-white w-8 h-8 rounded-full outline outline-1 shadow-xl'>
          <PlusSvg className='w-6 h-6 stroke-rouge-blue fill-rouge-blue' />
        </div>
      </button>
    </div>
  );
}

export default PlusButton;
