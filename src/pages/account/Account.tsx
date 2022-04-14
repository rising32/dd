import React from 'react';
import AccountView from '../../components/account/AccountView';
import StatisticsView from '../../components/statistics/StatisticsView';
import MainResponsive from '../../container/MainResponsive';

function Account() {
  return (
    <MainResponsive>
      <AccountView />
    </MainResponsive>
  );
}

export default Account;
