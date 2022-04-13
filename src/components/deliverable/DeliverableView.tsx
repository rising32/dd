import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import WeekCalendar from '../../components/calendar/WeekCalendar';
import { DeliverableState } from '../../modules/deliverable';
import { RootState } from '../../store';
import CreateDeliverable from './CreateDeliverable';
import DeliverableOfDate from './DeliverableOfDate';
import BeforeWeeklyPriority from './BeforeWeeklyPriority';
import { PriorityState } from '../../modules/weekPriority';

function DeliverableView() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDeliverable, setSelectedDeliverable] = useState<DeliverableState | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<PriorityState | null>(null);
  const [newCreatedDeliverable, setNewCreatedDeliverable] = useState<DeliverableState | null>(null);

  const { userInfo } = useSelector((state: RootState) => state.user);

  const onSelectDate = (date: Date) => {
    setSelectedDate(date);
  };
  const onSelectDeliverable = (deliverable: DeliverableState) => {
    setSelectedDeliverable(deliverable);
  };
  const onSelectPriority = (priority: PriorityState) => {
    if (selectedPriority?.wp_id === priority.wp_id) {
      setSelectedPriority(null);
    } else {
      setSelectedPriority(priority);
    }
  };
  const addDeliverable = (deliverable: DeliverableState) => {
    setNewCreatedDeliverable(deliverable);
  };

  return (
    <>
      <WeekCalendar selectedDate={selectedDate} onSelectDate={onSelectDate} />
      <DeliverableOfDate
        selectedDate={selectedDate}
        selectedDeliverable={selectedDeliverable}
        onSelectDeliverable={onSelectDeliverable}
        newCreatedDeliverable={newCreatedDeliverable}
      />
      <CreateDeliverable selectedDate={selectedDate} addDeliverable={addDeliverable} />
      <BeforeWeeklyPriority selectedDate={selectedDate} selectedPriority={selectedPriority} onSelectPriority={onSelectPriority} />
    </>
  );
}

export default DeliverableView;
