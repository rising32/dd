import React from 'react';
import DeliverableView from '../../components/deliverable/DeliverableView';
import PriorityView from '../../components/priority/PriorityView';
import MainResponsive from '../../container/MainResponsive';

function DeliverablesPage() {
  return (
    <MainResponsive>
      <DeliverableView />
    </MainResponsive>
  );
}

export default DeliverablesPage;
