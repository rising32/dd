import React, { useState } from 'react';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';

interface Props {
  selectedDate: Date;
  onSelectDate: (selectedDate: Date) => void;
}
const WorkSettingWeekCalendar = ({ selectedDate, onSelectDate }: Props) => {
  const [activeDate, setActiveDate] = useState(selectedDate);
  const getDates = () => {
    const weekStartDate = startOfWeek(activeDate, { weekStartsOn: 1 });
    const weekDays = [];
    for (let day = 0; day < 7; day++) {
      weekDays.push(
        <div
          key={format(addDays(weekStartDate, day), 'T')}
          className={`flex flex-1 flex-col w-full items-center justify-center text-lg font-normal  ${
            isSameDay(addDays(weekStartDate, day), selectedDate) ? 'font-bold text-rouge-blue' : ''
          }`}
          onClick={() => {
            onSelectDate(addDays(weekStartDate, day));
          }}
        >
          <div>{format(addDays(weekStartDate, day), 'EEEEE')}</div>
          <div>{format(addDays(weekStartDate, day), 'd')}</div>
        </div>,
      );
    }
    return <div className='flex flex-row flex-1'>{weekDays}</div>;
  };

  return <section className='w-full bg-white flex flex-row p-2'>{getDates()}</section>;
};

export default WorkSettingWeekCalendar;
