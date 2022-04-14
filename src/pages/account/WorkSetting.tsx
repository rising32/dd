import React, { useState, useEffect } from 'react';
import MainResponsive from '../../container/MainResponsive';
import { addWeeks, endOfYear, getWeek, getYear, lastDayOfWeek, startOfWeek, startOfYear } from 'date-fns';
import { DisplayWorkSettingState } from '../../modules/setting';
import WorkSettingItem from '../../components/account/WorkSettingItem';
import AnimatedView from '../../components/common/AnimatedView';

const WorkSetting = () => {
  const [year, setYear] = useState(getYear(new Date()));
  const [displayWorkSettingList, setDisplayWorkSetting] = useState<DisplayWorkSettingState[]>([]);
  const [yearOptions, setYearOptions] = useState<number[]>([]);
  const [showYear, setShowYear] = useState(false);

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
    <MainResponsive>
      <div className='flex flex-row w-full h-12 px-4 mb-4 items-center justify-between bg-light-gray'>
        <div className='text-sm text-rouge-blue font-normal'></div>
        <div className='text-lg text-rouge-blue font-bold'>Your Account</div>
        <div className='text-sm text-rouge-blue font-normal'></div>
      </div>
      <div className='w-full mt-4 p-1 bg-white'>
        <div className='flex flex-row items-center justify-between px-8 py-3'>
          <div className='text-lg text-black font-bold'>Work Setting</div>
          <div className='text-lg text-rouge-blue font-bold'>Submit</div>
        </div>
        <div className='flex flex-row items-center justify-between px-10 py-2'>
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
        <div className='flex flex-row items-center justify-between px-1 py-2 w-full'>
          <div className='text-base text-blue font-bold w-1/5 flex items-center justify-center'>Week</div>
          <div className='text-base text-blue font-bold w-2/5 flex items-center justify-center text-center'>First Day of Week</div>
          <div className='text-base text-blue font-bold w-2/5 flex items-center justify-center'>Work on Week</div>
        </div>
        {displayWorkSettingList.map(displayWorkSetting => (
          <WorkSettingItem key={displayWorkSetting.week} displayWorkSetting={displayWorkSetting} onChange={onChange} />
        ))}
      </div>
    </MainResponsive>
  );
};

export default WorkSetting;
