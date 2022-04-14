import React from 'react';
import HeaderWithTitle from '../base/HeaderWithTitle';
import CompanyProfile from './CompanyProfile';
import MemberProfile from './MemberProfile';
import UserProfile from './UserProfile';

function UserProfileView() {
  return (
    <>
      <HeaderWithTitle title='Your Account' />
      <UserProfile />
    </>
  );
}

export default UserProfileView;
