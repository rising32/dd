import React from 'react';
import HeaderWithTitle from '../base/HeaderWithTitle';
import CompanyProfile from './CompanyProfile';

function AccountView() {
  return (
    <>
      <HeaderWithTitle title='Your Account' isAccount />
      <CompanyProfile />
    </>
  );
}

export default AccountView;
