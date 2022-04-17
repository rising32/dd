import { getWeek } from 'date-fns';
import React, { useState } from 'react';
import { PriorityState } from '../../modules/weekPriority';
import PrioritiesCalender from '../calendar/PrioritiesCalender';
import AchievedPriority from './AchievedPriority';
import PastNotAchievedPriority from './PastNotAchievedPriority';
import WeeklyPriorities from './WeeklyPriorities';

function PriorityView() {
  const [selectedWeek, setSelectedWeek] = useState(getWeek(new Date(), { weekStartsOn: 1, firstWeekContainsDate: 4 }));
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
    <>
      <PrioritiesCalender onSelectWeek={onSelectWeek} />
      <WeeklyPriorities
        selectedWeek={selectedWeek}
        selectedPriority={selectedPriority}
        onSelectPriority={onSelectPriority}
        newCreatedWeekPriority={newCreatedWeekPriority}
      />
      <AchievedPriority selectedWeek={selectedWeek} selectedPriority={selectedPriority} addPriority={addPriority} />
      <PastNotAchievedPriority selectedWeek={selectedWeek} />
    </>
  );
}

export default PriorityView;
