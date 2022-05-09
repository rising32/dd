import React, { useState } from 'react';
import { CalenderSvg } from '../../../assets/svg';
import FullCalendar from '../../calendar/FullCalendar';
import AnimatedView from '../../common/AnimatedView';
import { ControllerRenderProps } from 'react-hook-form';
import { IProjectControlFormInput } from '../CreateAndEditProjectTemplate';
import { format } from 'date-fns';
import ModalView from '../../base/ModalView';

interface Props {
  field:
    | ControllerRenderProps<IProjectControlFormInput, 'planStartDate'>
    | ControllerRenderProps<IProjectControlFormInput, 'planEndDate'>
    | ControllerRenderProps<IProjectControlFormInput, 'actualStartDate'>
    | ControllerRenderProps<IProjectControlFormInput, 'actualEndDate'>;
}
function DateSelect({ field }: Props) {
  const [showCalendar, setShowCalendar] = useState(false);
  const openCalendar = () => {
    setShowCalendar(!showCalendar);
  };
  const onClickWhen = (date: Date) => {
    field.onChange(date);
    setShowCalendar(false);
  };

  return (
    <>
      <div className='flex flex-1 justify-center bg-dark-gray rounded-md py-1 text-rouge-blue' onClick={openCalendar}>
        {format(field.value, 'yyyy-MM-dd')}
      </div>
      <ModalView isOpen={showCalendar}>
        <div className='flex justify-between items-center bg-white text-black'>
          <FullCalendar selectedDate={field.value || new Date()} onSelectDate={onClickWhen} />
        </div>
      </ModalView>
    </>
  );
}

export default DateSelect;
