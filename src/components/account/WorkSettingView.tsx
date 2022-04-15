import React from 'react';
import HeaderWithTitle from '../base/HeaderWithTitle';
import WorkSetting from './WorkSetting';

const WorkSettingView = () => {
  return (
    <>
      <HeaderWithTitle title='Your Account' />
      <WorkSetting />
    </>
  );
};

export default WorkSettingView;
