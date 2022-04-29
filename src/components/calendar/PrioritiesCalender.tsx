import React, { useState } from 'react';
import { getWeek, addWeeks, subWeeks } from 'date-fns';
import { CalenderSvg } from '../../assets/svg';
import { LeftArrowSvg, RightArrowSvg } from '../../assets/svg';

interface Props {
  onSelectWeek: (currentWeek: number) => void;
}
const PrioritiesCalender = ({ onSelectWeek }: Props) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [currentWeek, setCurrentWeek] = useState(getWeek(currentMonth, { weekStartsOn: 1, firstWeekContainsDate: 4 }));

  React.useEffect(() => {
    onSelectWeek(currentWeek);
  }, [currentWeek]);
  const changeWeekHandle = (btnType: string) => {
    if (btnType === 'prev') {
      setCurrentMonth(subWeeks(currentMonth, 1));
      setCurrentWeek(getWeek(subWeeks(currentMonth, 1), { weekStartsOn: 1, firstWeekContainsDate: 4 }));
    }
    if (btnType === 'next') {
      setCurrentMonth(addWeeks(currentMonth, 1));
      setCurrentWeek(getWeek(addWeeks(currentMonth, 1), { weekStartsOn: 1, firstWeekContainsDate: 4 }));
    }
  };
  return (
    <div className='w-full flex flex-row justify-between items-center bg-white py-3 px-4 rounded-md'>
      <div className='flex items-center justify-center' onClick={() => changeWeekHandle('prev')}>
        <LeftArrowSvg stroke='#5B8EAB' strokeWidth={2} />
        <div className='text-lg font-bold text-rouge-blue pl-2'>{currentWeek - 1}</div>
      </div>
      <div className='flex flex-1 flex-row items-center justify-between pr-2 text-black'>
        <div />
        <div className='text-lg font-bold'>{'Week priorities ' + currentWeek}</div>
        <CalenderSvg />
      </div>
      <div className='flex items-center justify-center' onClick={() => changeWeekHandle('next')}>
        <div className='text-lg font-bold text-rouge-blue pr-2'>{currentWeek + 1}</div>
        <RightArrowSvg stroke='#5B8EAB' strokeWidth={2} />
      </div>
    </div>
  );
};

export default PrioritiesCalender;
