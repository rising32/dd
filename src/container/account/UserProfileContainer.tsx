import React from 'react';
import Profile from '../../components/account/Profile';
import HeaderWithTitle from '../../components/base/HeaderWithTitle';
import MainResponsive from '../MainResponsive';

function UserProfileContainer() {
  return (
    <MainResponsive>
      <HeaderWithTitle title='Your Account' />
      <Profile />
    </MainResponsive>
  );
}

export default UserProfileContainer;
