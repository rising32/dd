import React, { useState } from 'react';
import { DisplayWorkSettingState } from '../../modules/setting';
import Select, { SingleValue } from 'react-select';
import MultiRangeSlider from '../common/MultiRangeSlider';
import WorkSettingWeekCalendar from '../calendar/WorkSettingWeekCalendar';
import { PenSvg } from '../../assets/svg';
import SelectedAndCompltedIcon from '../common/SelectedAndCompltedIcon';
import AnimatedView from '../common/AnimatedView';

interface Props {
  displayWorkSetting: DisplayWorkSettingState;
  onChange: (displayWorkSetting: DisplayWorkSettingState) => void;
}
const WorkSettingItem = ({ displayWorkSetting, onChange }: Props) => {
  const [show, setShow] = useState(false);
  const [selectedDate, setSelectedDate] = useState(displayWorkSetting.first_day_of_week);
  const [isPriorityChecked, setIsPriorityChecked] = useState(
    displayWorkSetting.remainder === 1 || displayWorkSetting.remainder === 3 ? true : false,
  );
  const [isDeliverableChecked, setIsDeliverableChecked] = useState(
    displayWorkSetting.remainder === 2 || displayWorkSetting.remainder === 3 ? true : false,
  );
  const [values, setValues] = useState([9, 18]);
  const [workOnWeek, setWorkOnWeek] = useState(displayWorkSetting.work_on_week);

  const onSelectDay = (cloneDay: Date) => {
    setSelectedDate(cloneDay);
  };
  const onSetValue = (value: number[]) => {
    setValues(value);
  };
  const daysOptions = [
    { value: 1, label: 1 },
    { value: 2, label: 2 },
    { value: 3, label: 3 },
    { value: 4, label: 4 },
    { value: 5, label: 5 },
    { value: 6, label: 6 },
    { value: 7, label: 7 },
  ];
  const onSelectDays = (newValue: SingleValue<any>) => {
    console.log(newValue);
    setWorkOnWeek(newValue.value);
  };
  const onChangeItem = () => {
    const newDisplaySettingItem = displayWorkSetting;
    newDisplaySettingItem.first_day_of_week = selectedDate;
    newDisplaySettingItem.work_on_week = workOnWeek;
    newDisplaySettingItem.start_work_time = values[0];
    newDisplaySettingItem.end_work_time = values[1];

    let reminderValue = 0;
    if (!isPriorityChecked && !isDeliverableChecked) {
      reminderValue = 0;
    }
    if (isPriorityChecked) {
      reminderValue = 1;
    }
    if (isDeliverableChecked) {
      reminderValue = 2;
    }
    if (isPriorityChecked && isDeliverableChecked) {
      reminderValue = 3;
    }
    newDisplaySettingItem.remainder = reminderValue;
    onChange(newDisplaySettingItem);
    setShow(false);
  };

  return (
    <>
      <div key={displayWorkSetting.week} className='flex flex-row items-center justify-between px-1 py-2 w-full'>
        <div className='text-base font-normal w-1/5 flex items-center justify-center'>{displayWorkSetting.week}</div>
        <div className='text-base font-normal w-2/5 flex items-center justify-center truncate'>
          {displayWorkSetting.first_day_of_week.toDateString()}
        </div>
        <div className='w-2/5 flex items-center justify-center relative' onClick={() => setShow(!show)}>
          <div className='text-base font-normal'>{displayWorkSetting.work_on_week}</div>
          <div className='text-base font-normal absolute right-4 flex flex-row items-center'>
            <PenSvg className='h-4 w-auto' />
          </div>
        </div>
      </div>
      <AnimatedView show={show}>
        <div className='flex items-center justify-center flex-col p-4 border-2 border-dark-gray'>
          <div className='text-base font-bold pb-4'>FIRST DAY OF THE WEEK</div>
          <div className='flex flex-row items-center'>
            <Select isSearchable={false} options={daysOptions} defaultValue={daysOptions[workOnWeek - 1]} onChange={onSelectDays} />
            <div className='text-base font-normal text-black pr-2'>Days in</div>
            <div className='text-xl font-bold text-rouge-blue pr-2'>{displayWorkSetting.week}</div>
            <div className='text-base font-normal text-black'>Week</div>
          </div>
          <WorkSettingWeekCalendar selectedDate={selectedDate} onSelectDate={onSelectDay} />
          <div className='text-base font-bold py-4'>DAILY WORK ROUTINE</div>
          <div className='flex flex-row justify-between px-12 w-full'>
            <div>{values[0] + ':00'}</div>
            <div>{values[1] + ':00'}</div>
          </div>
          <div className='flex justify-center m-4 px-8 w-full'>
            <MultiRangeSlider values={values} onSetValue={onSetValue} />
          </div>
          <div className='text-base font-bold py-4'>Reminders</div>
          <div className='flex flex-row items-start justify-between w-full px-4'>
            <div className='flex text-center'>Get a notification to start:</div>
            <div className='flex flex-col flex-1 justify-center pl-6'>
              <div className='flex flex-row' onClick={() => setIsPriorityChecked(!isPriorityChecked)}>
                <SelectedAndCompltedIcon isSelected={isPriorityChecked} isCompleted={false} />
                <div style={isPriorityChecked ? { color: 'red' } : { color: 'black' }}>Priorities</div>
              </div>
              <div className='flex flex-row' onClick={() => setIsDeliverableChecked(!isDeliverableChecked)}>
                <SelectedAndCompltedIcon isSelected={isDeliverableChecked} isCompleted={false} />
                <div style={isDeliverableChecked ? { color: 'red' } : { color: 'black' }}>Deliverables</div>
              </div>
            </div>
          </div>
          <div className='flex flex-row items-start justify-between w-full px-8 pt-4'>
            <div className='text-lg font-bold' onClick={() => setShow(!show)}>
              Cancel
            </div>
            <div className='text-lg font-bold text-rouge-blue' onClick={onChangeItem}>
              Save
            </div>
          </div>
        </div>
      </AnimatedView>
    </>
  );
};

export default WorkSettingItem;
