import React, { useState } from 'react';
import { format, startOfDay, addHours, getHours, getMinutes } from 'date-fns';
import { ScheduleState } from '../../modules/schedule';

interface Props {
  selectedDate: Date;
}

const DayScheduler = ({ selectedDate }: Props) => {
  const [activeDate, setActiveDate] = useState(selectedDate);
  const scheduleList: ScheduleState[] = [
    {
      id: 1,
      name: 'JF',
      start_time: new Date(2022, 4, 2, 0, 0),
      end_time: new Date(2022, 4, 2, 1, 20),
      description: '',
    },
    {
      id: 2,
      name: 'JF',
      start_time: new Date(2022, 4, 2, 2, 20),
      end_time: new Date(2022, 4, 2, 3, 20),
      description: '',
    },
    {
      id: 3,
      name: 'LU-JF',
      start_time: new Date(2022, 4, 2, 5, 20),
      end_time: new Date(2022, 4, 2, 7, 10),
      description: '',
    },
  ];
  const getTimes = () => {
    const hourStartDate = startOfDay(activeDate);
    const weekDays = [];
    for (let hour = 0; hour < 24; hour++) {
      weekDays.push(
        <div key={format(addHours(hourStartDate, hour), 'T')} className='h-24 border-t-2 border-white border-dotted'>
          <div className='text-white text-lg'>{format(addHours(hourStartDate, hour), 'HH') + ':00'}</div>
        </div>,
      );
    }
    return <div className='flex flex-col'>{weekDays}</div>;
  };
  const getItem = (item: ScheduleState) => {
    const startHour = getHours(item.start_time);
    const startMin = getMinutes(item.start_time);
    const endHour = getHours(item.end_time);
    const endMin = getMinutes(item.end_time);
    return (
      <div
        key={format(item.start_time, 'T')}
        className='flex flex-col w-full rounded-md absolute bg-submit items-center'
        style={{
          top: `${startHour * 6 + startMin * 0.1}rem`,
          height: `${(endHour - startHour) * 6 + (endMin - startMin) * 0.1}rem`,
        }}
      >
        <div className='py-2'>{item.name}</div>
      </div>
    );
  };

  return (
    <section className='w-full flex flex-row p-2'>
      {getTimes()}
      <div className='flex w-12 relative px-2'>{scheduleList.map(item => getItem(item))}</div>
    </section>
  );
};

export default DayScheduler;
