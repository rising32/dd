import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

function FileView() {
  const { userInfo } = useSelector((state: RootState) => state.user);
  return (
    <>
      <div>dfadfs</div>
    </>
  );
}

export default FileView;
