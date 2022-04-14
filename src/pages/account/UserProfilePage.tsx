import React from 'react';
import UserProfileView from '../../components/account/UserProfileView';
import MainResponsive from '../../container/MainResponsive';

function UserProfilePage() {
  return (
    <MainResponsive>
      <UserProfileView />
    </MainResponsive>
  );
}

export default UserProfilePage;
