import React, { useState } from 'react';
import { OtherSvg, PlusSvg } from '../../assets/svg';

interface Props {
  onMore?: () => void;
  className?: string;
}
function MoreButton({ className, onMore }: Props) {
  return (
    <div className={className}>
      <div className='flex items-center justify-center bg-white w-8 h-8 rounded-full outline outline-1 shadow-xl' onClick={onMore}>
        <OtherSvg className='w-6 h-6 stroke-rouge-blue fill-rouge-blue' />
      </div>
    </div>
  );
}

export default MoreButton;
