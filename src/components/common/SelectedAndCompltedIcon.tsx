import React from 'react';
import { documentThumbnail, redDocumentThumbnail } from '../../assets/images';
import { CheckSvg } from '../../assets/svg';

interface Props {
  isSelected: boolean;
  isCompleted?: boolean;
}
const SelectedAndCompltedIcon = ({ isCompleted, isSelected }: Props) => {
  return (
    <div className='w-6 h-6 flex items-center justify-center relative bg-transparent'>
      {isSelected ? <img src={redDocumentThumbnail} className='h-5 w-auto' /> : <img src={documentThumbnail} className='h-5 w-auto' />}
      {isCompleted ? (
        <div className='absolute top-0 left-0 w-full h-full flex items-center justify-center'>
          <CheckSvg stroke='red' strokeWidth={4} className='w-4 h-4' />
        </div>
      ) : (
        <div />
      )}
    </div>
  );
};

export default SelectedAndCompltedIcon;
