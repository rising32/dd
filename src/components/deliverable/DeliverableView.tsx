import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import WeekCalendar from '../../components/calendar/WeekCalendar';
import { DeliverableState } from '../../modules/deliverable';
import { RootState } from '../../store';
import TodayDeliverable from './TodayDeliverable';

function DeliverableView() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDeliverable, setSelectedDeliverable] = useState<DeliverableState | null>(null);
  const [newCreatedWeekDeliverable, setNewCreatedWeekDeliverable] = useState<DeliverableState | null>(null);
  const { userInfo } = useSelector((state: RootState) => state.user);

  const onSelectDate = (date: Date) => {
    setSelectedDate(date);
  };
  const onSelectDeliverable = (deliverable: DeliverableState) => {
    setNewCreatedWeekDeliverable(deliverable);
  };

  return (
    <>
      <WeekCalendar selectedDate={selectedDate} onSelectDate={onSelectDate} />
      <TodayDeliverable
        selectedDate={selectedDate}
        selectedDeliverable={selectedDeliverable}
        newCreatedWeekDeliverable={newCreatedWeekDeliverable}
        onSelectDeliverable={onSelectDeliverable}
      />
    </>
  );
}

export default DeliverableView;
