import React from 'react';
import UserProfileView from '../../components/account/UserProfileView';
import MainResponsive from '../../container/MainResponsive';

function UserProfile() {
  return (
    <MainResponsive>
      <UserProfileView />
    </MainResponsive>
  );
}

export default UserProfile;
