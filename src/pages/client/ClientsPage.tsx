import React from 'react';
import ClientsView from '../../components/client/ClientsView';
import Task from '../../components/task/Task';
import MainResponsive from '../../container/MainResponsive';

function ClientsPage() {
  return (
    <MainResponsive>
      <ClientsView />
    </MainResponsive>
  );
}

export default ClientsPage;
