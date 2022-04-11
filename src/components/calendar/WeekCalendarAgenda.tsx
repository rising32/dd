import React, { useState } from 'react';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { subDays } from 'date-fns/esm';

interface Props {
  selectedDate: Date;
  onSelectDate: (selectedDate: Date) => void;
}
const WeekCalendarAgenda = ({ selectedDate, onSelectDate }: Props) => {
  const [activeDate, setActiveDate] = useState(selectedDate);
  const goBeforeWeek = () => {
    // setActiveDate(subDays(activeDate, 7));
  };
  const getDates = () => {
    const weekStartDate = startOfWeek(activeDate, { weekStartsOn: 1 });
    const weekDays = [];
    for (let day = 0; day < 7; day++) {
      weekDays.push(
        <div
          key={format(addDays(weekStartDate, day), 'T')}
          className='flex flex-1 flex-col w-full items-center justify-center'
          onClick={() => {
            onSelectDate(addDays(weekStartDate, day));
          }}
        >
          <div
            className={`flex-1 text-lg font-bold ${isSameDay(addDays(weekStartDate, day), selectedDate) ? 'text-[#166DE1]' : 'text-white'}`}
          >
            {format(addDays(weekStartDate, day), 'EEEEE')}
          </div>
          <div
            className={`w-8 h-8 rounded-full flex flex-1 items-center justify-center ${
              isSameDay(addDays(weekStartDate, day), selectedDate) ? 'bg-[#365B9D]' : ''
            }`}
          >
            <span className='text-lg font-normal text-white'>{format(addDays(weekStartDate, day), 'd')}</span>
          </div>
        </div>,
      );
    }
    return (
      <div className='flex flex-row flex-1'>
        <div className='flex flex-1 flex-col w-full items-center justify-end' onClick={goBeforeWeek}>
          <div>
            <span className='text-lg font-normal text-white'>{format(subDays(weekStartDate, 1), 'd')}</span>
          </div>
        </div>
        {weekDays}
      </div>
    );
  };

  return <section className='w-full flex flex-row py-2'>{getDates()}</section>;
};

export default WeekCalendarAgenda;
