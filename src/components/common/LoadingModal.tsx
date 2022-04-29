import React, { useEffect, useState } from 'react';
import { RotatingLines } from 'react-loader-spinner';
import ReactModal from 'react-modal';
import { HomeSvg } from '../../assets/svg';

interface Props {
  loaded: string | null;
}

function LoadingModal({ loaded }: Props): JSX.Element {
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    if (loaded === 'start') {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [loaded]);
  return (
    <ReactModal
      isOpen={showModal}
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
      <RotatingLines width='50' />
    </ReactModal>
  );
}

export default LoadingModal;
