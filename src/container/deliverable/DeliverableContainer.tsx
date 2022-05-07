import React, { useState } from 'react';
import TaskCalenar from '../../components/calendar/TaskCalenar';
import DeliverablePanel from '../../components/deliverable/DeliverablePanel';
import MainResponsive from '../MainResponsive';

function DeliverableContainer() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const onSelectDate = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <MainResponsive>
      <TaskCalenar selectedDate={selectedDate} onSelectDate={onSelectDate} />
      <DeliverablePanel selectedDate={selectedDate} />
    </MainResponsive>
  );
}

export default DeliverableContainer;
