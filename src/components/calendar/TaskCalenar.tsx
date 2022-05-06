import React, { useState } from 'react';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { LeftArrowSvg, RightArrowSvg } from '../../assets/svg';
import { subDays } from 'date-fns/esm';

interface Props {
  selectedDate: Date;
  onSelectDate: (selectedDate: Date) => void;
}
const TaskCalenar = ({ selectedDate, onSelectDate }: Props) => {
  const [activeDate, setActiveDate] = useState(selectedDate);
  const changeWeekHandle = (btnType: string) => {
    if (btnType === 'prev') {
      setActiveDate(subDays(activeDate, 7));
    }
    if (btnType === 'next') {
      setActiveDate(addDays(activeDate, 7));
    }
  };
  const getDates = () => {
    const weekStartDate = startOfWeek(activeDate, { weekStartsOn: 1 });
    const weekDays = [];
    for (let day = 0; day < 7; day++) {
      weekDays.push(
        <div
          key={format(addDays(weekStartDate, day), 'T')}
          className={`flex flex-1 flex-col w-full items-center justify-center font-bold ${
            isSameDay(addDays(weekStartDate, day), selectedDate) ? 'text-rouge-blue' : 'text-black'
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

  return (
    <section className='w-full bg-white flex flex-row p-2 rounded-md'>
      <div className='flex items-center justify-center' onClick={() => changeWeekHandle('prev')}>
        <LeftArrowSvg className='w-6 h-6 stroke-menu-back stroke-2' />
      </div>
      {getDates()}
      <div className='flex items-center justify-center' onClick={() => changeWeekHandle('next')}>
        <RightArrowSvg className='w-6 h-6 stroke-menu-back stroke-2' />
      </div>
    </section>
  );
};

export default TaskCalenar;
