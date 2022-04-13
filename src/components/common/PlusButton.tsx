import React, { useState } from 'react';
import { PlusSvg } from '../../assets/svg';

interface Props {
  onPlus: () => void;
  className?: string;
}
function PlusButton({ className, onPlus }: Props) {
  return (
    <div className={className}>
      <div className='flex items-center justify-center bg-white w-8 h-8 rounded-full outline outline-1 shadow-xl' onClick={onPlus}>
        <PlusSvg className='w-6 h-6 stroke-rouge-blue fill-rouge-blue' />
      </div>
    </div>
  );
}

export default PlusButton;
