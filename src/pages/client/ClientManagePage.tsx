import React from 'react';
import ClientsView from '../../components/client/ClientsView';
import MainResponsive from '../../container/MainResponsive';

function ClientManagePage() {
  return (
    <MainResponsive>
      <ClientsView />
    </MainResponsive>
  );
}

export default ClientManagePage;
