import React, { useEffect, useState } from 'react';
import { RotatingLines } from 'react-loader-spinner';
import ReactModal from 'react-modal';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

ReactModal.setAppElement('#root');

function LoaderSpinner(): JSX.Element {
  const { loading } = useSelector((state: RootState) => state.core);

  return (
    <ReactModal
      isOpen={loading}
      className='w-full h-full flex items-center justify-center'
      style={{
        overlay: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0, 0, 0, 0.5)',
        },
      }}
    >
      <RotatingLines width='30' strokeColor='white' />
    </ReactModal>
  );
}

export default LoaderSpinner;
