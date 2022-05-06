import React, { useState } from 'react';
import { addWeeks, subWeeks } from 'date-fns';
import { CalenderSvg } from '../../assets/svg';
import { LeftArrowSvg, RightArrowSvg } from '../../assets/svg';
import { getWeekNumber } from '../../lib/utils';

interface Props {
  onSelectWeek: (week: number) => void;
}
const PriorityCalendar = ({ onSelectWeek }: Props) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [currentWeek, setCurrentWeek] = useState(getWeekNumber(currentMonth));

  React.useEffect(() => {
    onSelectWeek(currentWeek);
  }, [currentWeek]);
  const changeWeekHandle = (btnType: string) => {
    if (btnType === 'prev') {
      setCurrentMonth(subWeeks(currentMonth, 1));
      setCurrentWeek(getWeekNumber(subWeeks(currentMonth, 1)));
    }
    if (btnType === 'next') {
      setCurrentMonth(addWeeks(currentMonth, 1));
      setCurrentWeek(getWeekNumber(addWeeks(currentMonth, 1)));
    }
  };
  return (
    <div className='w-full flex flex-row justify-between items-center bg-white py-3 px-4 rounded-md font-bold'>
      <div className='flex items-center justify-center' onClick={() => changeWeekHandle('prev')}>
        <LeftArrowSvg className='w-6 h-6 stroke-menu-back stroke-2' />
        <div className='text-rouge-blue pl-2'>{currentWeek - 1}</div>
      </div>
      <div className='flex flex-1 flex-row items-center justify-between pr-2 text-black'>
        <div />
        <div className=''>{'Week priorities ' + currentWeek}</div>
        <CalenderSvg className='w-4 h-4' />
      </div>
      <div className='flex items-center justify-center' onClick={() => changeWeekHandle('next')}>
        <div className='text-rouge-blue pr-2'>{currentWeek + 1}</div>
        <RightArrowSvg className='w-6 h-6 stroke-menu-back stroke-2' />
      </div>
    </div>
  );
};

export default PriorityCalendar;
