import React, { useEffect, useState } from 'react';
import { addWeeks, endOfYear, getWeek, getYear, lastDayOfWeek, startOfWeek, startOfYear } from 'date-fns';

import SmallLayout from '../../container/common/SmallLayout';
import AnimatedView from '../common/AnimatedView';
import { DisplayWorkSettingState } from '../../modules/setting';
import WorkSettingItem from './WorkSettingItem';

const WorkSetting = () => {
  const [year, setYear] = useState(getYear(new Date()));
  const [yearOptions, setYearOptions] = useState<number[]>([]);
  const [showYear, setShowYear] = useState(false);
  const [displayWorkSettingList, setDisplayWorkSetting] = useState<DisplayWorkSettingState[]>([]);

  useEffect(() => {
    const startDay = startOfYear(new Date(year, 1, 1));
    let realStartDay;
    if (getWeek(startDay, { weekStartsOn: 1, firstWeekContainsDate: 4 }) >= 52) {
      realStartDay = startOfWeek(addWeeks(startDay, 1), { weekStartsOn: 1 });
    } else {
      realStartDay = startDay;
    }
    const endDay = endOfYear(new Date());

    const firstWeekNum = getWeek(realStartDay, { weekStartsOn: 1, firstWeekContainsDate: 4 });
    const endWeekNum = getWeek(endDay, { weekStartsOn: 1, firstWeekContainsDate: 4 });
    const newWorkSettingList: DisplayWorkSettingState[] = [];
    for (let i = firstWeekNum; i <= endWeekNum; i++) {
      const startDate = startOfWeek(addWeeks(realStartDay, i - 1), { weekStartsOn: 1 });
      const endDate = lastDayOfWeek(addWeeks(realStartDay, i - 1), { weekStartsOn: 1 });
      const item: DisplayWorkSettingState = {
        week: i,
        first_day_of_week: startDate,
        work_on_week: 5,
        start_work_time: 9,
        end_work_time: 18,
        remainder: 3,
      };
      newWorkSettingList.push(item);
    }
    setDisplayWorkSetting(newWorkSettingList);
  }, [year]);
  const onChange = (item: DisplayWorkSettingState) => {
    const newDisplaySettingList = displayWorkSettingList;
    newDisplaySettingList.map(displayWorkSetting => {
      if (displayWorkSetting.week === item.week) {
        return item;
      }
      return displayWorkSetting;
    });

    setDisplayWorkSetting(newDisplaySettingList);
  };
  const dropYear = () => {
    const yearList: number[] = [];
    for (let i = year - 1; i <= year + 1; i++) {
      yearList.push(i);
    }
    setYearOptions(yearList);
    setShowYear(!showYear);
  };
  const onSelectYear = (year: number) => {
    setYear(year);
    setShowYear(false);
  };
  return (
    <SmallLayout className='flex flex-1 flex-col mt-4 px-1 py-4 bg-white text-black'>
      <div className='flex items-center justify-between px-8 py-3'>
        <div className='text-lg font-bold'>Work Setting</div>
        <div className='text-lg text-rouge-blue font-bold'>Submit</div>
      </div>
      <div className='flex items-center justify-between px-10 py-2'>
        <div className='text-lg text-rouge-blue font-bold'>Year:</div>
        <div className='text-lg text-blue font-bold' onClick={dropYear}>
          {year}
        </div>
      </div>
      <AnimatedView show={showYear}>
        <div className='flex flex-row'>
          {yearOptions.map(year => (
            <div key={year} className='flex flex-1 items-center justify-center text-blue' onClick={() => onSelectYear(year)}>
              {year}
            </div>
          ))}
        </div>
      </AnimatedView>
      <div className='flex flex-row items-center justify-between px-1 py-2 w-full text-blue font-bold'>
        <div className='w-1/5 flex items-center justify-center'>Week</div>
        <div className='w-2/5 flex items-center justify-center text-center'>First Day of Week</div>
        <div className='w-2/5 flex items-center justify-center'>Work on Week</div>
      </div>
      {displayWorkSettingList.map(displayWorkSetting => (
        <WorkSettingItem key={displayWorkSetting.week} displayWorkSetting={displayWorkSetting} onChange={onChange} />
      ))}
    </SmallLayout>
  );
};

export default WorkSetting;
