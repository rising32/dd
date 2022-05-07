import React, { useState } from 'react';
import PriorityCalendar from '../../components/calendar/PriorityCalendar';
import PriorityControl from '../../components/priority/PriorityControl';
import { getWeekNumber } from '../../lib/utils';
import { PriorityState } from '../../modules/weekPriority';
import MainResponsive from '../MainResponsive';

function PriorityContainer() {
  const [selectedWeek, setSelectedWeek] = useState(getWeekNumber(new Date()));

  const onSelectWeek = (currentWeek: number) => {
    setSelectedWeek(currentWeek);
  };

  return (
    <MainResponsive>
      <PriorityCalendar onSelectWeek={onSelectWeek} />
      <PriorityControl selectedWeek={selectedWeek} />
    </MainResponsive>
  );
}

export default PriorityContainer;
