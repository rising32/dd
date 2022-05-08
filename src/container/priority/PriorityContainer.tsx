import React, { useState } from 'react';
import PriorityCalendar from '../../components/calendar/PriorityCalendar';
import PriorityPanel from '../../components/priority/PriorityPanel';
import { getWeekNumber } from '../../lib/utils';
import MainResponsive from '../MainResponsive';

function PriorityContainer() {
  const [selectedWeek, setSelectedWeek] = useState(getWeekNumber(new Date()));

  const onSelectWeek = (currentWeek: number) => {
    setSelectedWeek(currentWeek);
  };

  return (
    <MainResponsive>
      <PriorityCalendar onSelectWeek={onSelectWeek} />
      <PriorityPanel selectedWeek={selectedWeek} />
    </MainResponsive>
  );
}

export default PriorityContainer;
