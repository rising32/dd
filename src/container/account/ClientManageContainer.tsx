import React from 'react';
import HeaderWithTitle from '../../components/base/HeaderWithTitle';
import ClientsView from '../../components/client/ClientsView';
import MainResponsive from '../MainResponsive';

function ClientManageContainer() {
  return (
    <MainResponsive>
      <HeaderWithTitle title='Manage Clients' />
      <ClientsView />
    </MainResponsive>
  );
}

export default ClientManageContainer;
