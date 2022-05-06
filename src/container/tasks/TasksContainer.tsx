import React, { useState } from 'react';
import TaskCalenar from '../../components/calendar/TaskCalenar';
import TasksControl from '../../components/task/TasksControl';
import { getWeekNumber, getLocalDataString } from '../../lib/utils';
import MainResponsive from '../MainResponsive';

function TasksContainer() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const onSelectDate = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <MainResponsive>
      <TaskCalenar selectedDate={selectedDate} onSelectDate={onSelectDate} />
      <div className='flex items-center p-4'>
        <span className='flex-1 font-bold truncate'>{getLocalDataString(selectedDate)}</span>
        <span>On time: 90%</span>
      </div>
      <TasksControl selectedWeek={getWeekNumber(selectedDate)} />
    </MainResponsive>
  );
}

export default TasksContainer;
