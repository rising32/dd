import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { CalenderSvg, MenuSvg, SearchSvg } from '../../assets/svg';
import SmallLayout from '../../container/common/SmallLayout';
import { RootState } from '../../store';
import HeaderWithTitle from '../base/HeaderWithTitle';
import DayScheduler from '../calendar/DayScheduler';
import WeekCalendarAgenda from '../calendar/WeekCalendarAgenda';

function AgendaView() {
  const [shortName, setShortName] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { userInfo } = useSelector((state: RootState) => state.user);
  useEffect(() => {
    if (userInfo) {
      const name = userInfo.display_name;
      const short = name
        .split(' ')
        .map(x => x[0])
        .join('');
      setShortName(short);
    }
  }, [userInfo]);
  const onSelectDate = (cloneDay: Date) => {
    setSelectedDate(cloneDay);
  };
  return (
    <>
      <div className='w-full flex flex-row justify-between items-center text-black bg-white rounded-md py-3 px-4'>
        <div className='flex items-center'>
          <MenuSvg className='h-4 w-4 stroke-background' />
          <span className='text-2xl font-bold capitalize ml-2'>{new Date().toLocaleDateString('en', { month: 'long' })}</span>
        </div>
        <div className='flex flex-row items-center justify-between'>
          <SearchSvg className='h-5 w-5' />
          <CalenderSvg className='h-5 w-5 mx-2' />
          <div className='bg-[#3F414E] w-10 h-10 rounded-full flex items-center justify-center text-white text-xl '>{shortName}</div>
        </div>
      </div>
      <SmallLayout className='flex flex-1 flex-col bg-card-gray py-4 mt-4 text-black'>
        <WeekCalendarAgenda selectedDate={selectedDate} onSelectDate={onSelectDate} />
        <DayScheduler selectedDate={selectedDate} />
      </SmallLayout>
    </>
  );
}

export default AgendaView;
