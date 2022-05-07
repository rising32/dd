import React, { useState } from 'react';
import { PriorityState } from '../../modules/weekPriority';
import CreateAndEditPriority from './CreateAndEditPriority';
import PastNotAchievedPriority from './PastNotAchievedPriority';
import WeeklyPriorities from './WeeklyPriorities';

interface Props {
  selectedWeek: number;
}
function PriorityControl({ selectedWeek }: Props) {
  const [selectedPriority, setSelectedPriority] = useState<PriorityState | null>(null);
  const [newCreatedWeekPriority, setNewCreatedWeekPriority] = useState<PriorityState | null>(null);

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
      <WeeklyPriorities
        selectedWeek={selectedWeek}
        selectedPriority={selectedPriority}
        onSelectPriority={onSelectPriority}
        newCreatedWeekPriority={newCreatedWeekPriority}
      />
      <CreateAndEditPriority selectedWeek={selectedWeek} selectedPriority={selectedPriority} addPriority={addPriority} />
      <PastNotAchievedPriority selectedWeek={selectedWeek} />
    </>
  );
}

export default PriorityControl;
