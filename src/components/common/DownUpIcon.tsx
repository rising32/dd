import React, { useState } from 'react';
import { DownSvg, UpSvg } from '../../assets/svg';

interface Props {
  isShow: boolean;
}

function DownUpIcon({ isShow }: Props): JSX.Element {
  return (
    <>
      {isShow ? (
        <UpSvg strokeWidth={3} className='w-6 h-6 text-white' />
      ) : (
        <DownSvg stroke='white' strokeWidth={2} className='w-6 h-6 rotate-90' />
      )}
    </>
  );
}

export default DownUpIcon;
