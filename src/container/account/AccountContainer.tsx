import React from 'react';
import CompanyInfo from '../../components/account/CompanyInfo';
import UserInfo from '../../components/account/UserInfo';
import HeaderWithTitle from '../../components/base/HeaderWithTitle';
import MainResponsive from '../MainResponsive';

function AccountContainer() {
  return (
    <MainResponsive>
      <HeaderWithTitle title='Your Account' isAccount />
      <CompanyInfo />
      <UserInfo />
    </MainResponsive>
  );
}

export default AccountContainer;
