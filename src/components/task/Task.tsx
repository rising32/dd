import { getWeek } from 'date-fns';
import React, { useState } from 'react';
import WeekCalendar from '../../components/calendar/WeekCalendar';
import TaskFilter from './TaskFilter';

function Task() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const onSelectDate = (date: Date) => {
    setSelectedDate(date);
  };
  const options: Intl.DateTimeFormatOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };

  return (
    <>
      <WeekCalendar selectedDate={selectedDate} onSelectDate={onSelectDate} />
      <div className='flex items-center p-4'>
        <span className='flex-1 font-bold truncate'>{new Date(selectedDate).toLocaleDateString(undefined, options)}</span>
        <span>On time: 90%</span>
      </div>
      <TaskFilter selectedWeek={getWeek(selectedDate, { weekStartsOn: 1, firstWeekContainsDate: 4 })} />
    </>
  );
}

export default Task;
