import React, { useEffect, useState } from 'react';
import { addWeeks, endOfYear, format, getWeek, getYear, lastDayOfWeek, startOfWeek, startOfYear } from 'date-fns';

import SmallLayout from '../../container/common/SmallLayout';
import AnimatedView from '../common/AnimatedView';
import { WorkSettingState } from '../../modules/setting';
import WorkSettingItem from './WorkSettingItem';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../store';
import useRequest from '../../lib/hooks/useRequest';
import { sendCreateWorkSetting, sendGetWorkSetting } from '../../lib/api';
import { removeLoading, showLoading } from '../../store/features/coreSlice';

const WorkSetting = () => {
  const [year, setYear] = useState(getYear(new Date()));
  const [yearOptions, setYearOptions] = useState<number[]>([]);
  const [showYear, setShowYear] = useState(false);
  const [workSettingList, setWorkSetting] = useState<WorkSettingState[]>([]);
  const [isNew, setIsNew] = useState(true);

  const { userInfo } = useSelector((state: RootState) => state.user);
  const [_sendCreateWorkSetting, , sendCreateWorkSettingRes] = useRequest(sendCreateWorkSetting);
  const [_sendGetWorkSetting, , sendGetWorkSettingRes] = useRequest(sendGetWorkSetting);
  const dispach = useAppDispatch();

  useEffect(() => {
    if (userInfo) {
      dispach(showLoading());
      const user_id = userInfo.user_id;
      _sendGetWorkSetting(user_id);
    }
  }, [userInfo]);
  useEffect(() => {
    if (sendGetWorkSettingRes && userInfo?.user_id) {
      dispach(showLoading());
      const newWorkSettingList: WorkSettingState[] = [];
      if (sendGetWorkSettingRes?.length > 0) {
        setIsNew(false);
        sendGetWorkSettingRes.map(value => {
          const item: WorkSettingState = {
            ws_id: value.ws_id,
            user_id: value.user_id,
            week: value.week,
            year: value.year,
            first_day_of_week: new Date(value.first_day_of_week),
            work_on_week: value.work_on_week,
            start_work_time: value.start_work_time,
            end_work_time: value.end_work_time,
            remainder: value.remainder,
          };
          newWorkSettingList.push(item);
        });
        setWorkSetting(newWorkSettingList);
      } else {
        setIsNew(true);
        makeWorkSettingList();
      }
    }
    dispach(removeLoading());
  }, [sendGetWorkSettingRes]);

  const makeWorkSettingList = () => {
    if (userInfo?.user_id) {
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
      const newWorkSettingList: WorkSettingState[] = [];
      for (let i = firstWeekNum; i <= endWeekNum; i++) {
        const startDate = startOfWeek(addWeeks(realStartDay, i - 1), { weekStartsOn: 1 });
        // const endDate = lastDayOfWeek(addWeeks(realStartDay, i - 1), { weekStartsOn: 1 });
        const item: WorkSettingState = {
          // ws_id: null,
          user_id: userInfo?.user_id,
          week: i,
          year,
          first_day_of_week: startDate,
          work_on_week: 5,
          start_work_time: 9,
          end_work_time: 18,
          remainder: 3,
        };
        newWorkSettingList.push(item);
      }
      setWorkSetting(newWorkSettingList);
    }
  };
  const onChange = (item: WorkSettingState) => {
    const newSettingList = workSettingList;
    newSettingList.map(workSetting => {
      if (workSetting.week === item.week) {
        return item;
      }
      return workSetting;
    });

    setWorkSetting(newSettingList);
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
  const onSubmit = () => {
    if (isNew) {
      dispach(showLoading());
      const params: any[] = [];
      workSettingList.map(worksetting => {
        const valueList: any[] = [];
        const iterator = Object.values({
          ...worksetting,
          first_day_of_week: format(new Date(worksetting.first_day_of_week), 'yyyy-MM-dd'),
        });

        for (const value of iterator) {
          valueList.push(value);
        }
        params.push(valueList);
      });

      _sendCreateWorkSetting({ workSettingArray: params });
    }
  };
  React.useEffect(() => {
    if (sendCreateWorkSettingRes) {
      dispach(removeLoading());
    }
  }, [sendCreateWorkSettingRes]);
  return (
    <SmallLayout className='flex flex-1 flex-col mt-4 px-1 py-4 bg-white text-black'>
      <div className='flex items-center justify-between px-8 py-3'>
        <div className='text-lg font-bold'>Work Setting</div>
        {isNew && (
          <div className='text-lg text-rouge-blue font-bold' onClick={onSubmit}>
            Submit
          </div>
        )}
      </div>
      {/* <div className='flex items-center justify-between px-10 py-2'>
        <div className='text-lg text-rouge-blue font-bold'>Year:</div>
        <div className='text-lg text-blue font-bold' onClick={dropYear}>
          {year}
        </div>
      </div> */}
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
      {workSettingList.map(workSetting => (
        <WorkSettingItem key={workSetting.week} displayWorkSetting={workSetting} onChange={onChange} />
      ))}
    </SmallLayout>
  );
};

export default WorkSetting;
