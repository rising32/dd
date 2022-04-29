import React, { useState } from 'react';
import { CalenderSvg } from '../../assets/svg';
import FullCalendar from '../calendar/FullCalendar';
import AnimatedView from '../common/AnimatedView';
interface Props {
  selectedWhen: Date | null;
  onSelectWhen: (date: Date) => void;
}
function ShowCalendar({ selectedWhen, onSelectWhen }: Props) {
  const [showCalendar, setShowCalendar] = useState(false);
  const openCalendar = () => {
    setShowCalendar(!showCalendar);
  };
  const onClickWhen = (date: Date) => {
    onSelectWhen(date);
    setShowCalendar(false);
  };

  return (
    <>
      <div className='flex justify-between items-center py-1, text-white'>
        <span className='font-bold pr-2'>When :</span>
        <div className='text-rouge-blue font-bold px-2'>{selectedWhen?.toDateString()}</div>
        <CalenderSvg className='mr-2' onClick={openCalendar} />
      </div>
      <AnimatedView show={showCalendar}>
        <div className='flex justify-between items-center bg-white text-black'>
          <FullCalendar selectedDate={selectedWhen || new Date()} onSelectDate={onClickWhen} />
        </div>
      </AnimatedView>
    </>
  );
}

export default ShowCalendar;
