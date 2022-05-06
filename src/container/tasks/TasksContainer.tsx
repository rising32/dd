import React, { useState } from 'react';
import WeekCalendar from '../../components/calendar/WeekCalendar';
import TasksControl from '../../components/task/TasksControl';
import { getWeekNumber, getLocalDataString } from '../../lib/utils';

function TasksContainer() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const onSelectDate = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <>
      <WeekCalendar selectedDate={selectedDate} onSelectDate={onSelectDate} />
      <div className='flex items-center p-4'>
        <span className='flex-1 font-bold truncate'>{getLocalDataString(selectedDate)}</span>
        <span>On time: 90%</span>
      </div>
      <TasksControl selectedWeek={getWeekNumber(selectedDate)} />
    </>
  );
}

export default TasksContainer;
