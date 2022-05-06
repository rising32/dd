import React, { useState } from 'react';
import PriorityCalendar from '../../components/calendar/PriorityCalendar';
import AchievedPriority from '../../components/priority/AchievedPriority';
import PastNotAchievedPriority from '../../components/priority/PastNotAchievedPriority';
import WeeklyPriorities from '../../components/priority/WeeklyPriorities';
import { getWeekNumber } from '../../lib/utils';
import { PriorityState } from '../../modules/weekPriority';
import MainResponsive from '../MainResponsive';

function PriorityContainer() {
  const [selectedWeek, setSelectedWeek] = useState(getWeekNumber(new Date()));
  const [selectedPriority, setSelectedPriority] = useState<PriorityState | null>(null);
  const [newCreatedWeekPriority, setNewCreatedWeekPriority] = useState<PriorityState | null>(null);

  const onSelectWeek = (currentWeek: number) => {
    setSelectedWeek(currentWeek);
  };
  const addPriority = (priority: PriorityState) => {
    setNewCreatedWeekPriority(priority);
  };
  const onSelectPriority = (priority: PriorityState) => {
    if (selectedPriority?.wp_id === priority.wp_id) {
      setSelectedPriority(null);
    } else {
      setSelectedPriority(priority);
    }
  };

  return (
    <MainResponsive>
      <PriorityCalendar onSelectWeek={onSelectWeek} />
      <WeeklyPriorities
        selectedWeek={selectedWeek}
        selectedPriority={selectedPriority}
        onSelectPriority={onSelectPriority}
        newCreatedWeekPriority={newCreatedWeekPriority}
      />
      <AchievedPriority selectedWeek={selectedWeek} selectedPriority={selectedPriority} addPriority={addPriority} />
      <PastNotAchievedPriority selectedWeek={selectedWeek} />
    </MainResponsive>
  );
}

export default PriorityContainer;
