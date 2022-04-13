import { getWeek } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import SmallLayout from '../../container/common/SmallLayout';
import { sendPriorityByWeek } from '../../lib/api';
import useRequest from '../../lib/hooks/useRequest';
import { PriorityState } from '../../modules/weekPriority';
import { RootState } from '../../store';
import SelectedAndCompltedIcon from '../common/SelectedAndCompltedIcon';

interface Props {
  selectedWeek: number;
  selectedPriority: PriorityState | null;
  newCreatedWeekPriority: PriorityState | null;
  onSelectPriority: (priority: PriorityState) => void;
}
function WeeklyPriorities({ selectedWeek, selectedPriority, newCreatedWeekPriority, onSelectPriority }: Props) {
  const [weeklyPriorities, setWeeklyPriorities] = useState<PriorityState[]>([]);

  const { userInfo } = useSelector((state: RootState) => state.user);

  const [_sendPriorityByWeek, , sendPriorityByWeekRes] = useRequest(sendPriorityByWeek);

  useEffect(() => {
    if (newCreatedWeekPriority) {
      setWeeklyPriorities([...weeklyPriorities, newCreatedWeekPriority]);
    }
  }, [newCreatedWeekPriority]);
  useEffect(() => {
    const user_id = userInfo?.user_id;
    const week = selectedWeek;
    _sendPriorityByWeek(user_id, week);
  }, [selectedWeek]);
  React.useEffect(() => {
    if (sendPriorityByWeekRes) {
      setWeeklyPriorities(sendPriorityByWeekRes.priority);
    }
  }, [sendPriorityByWeekRes]);
  return (
    <div className='text-white mt-4'>
      <div className='flex justify-center'>
        <span className='text-base'>Weekly priorities</span>
      </div>
      <SmallLayout className='w-full rounded-md flex'>
        <ul role='list' className='p-4'>
          {weeklyPriorities.length > 0 ? (
            weeklyPriorities.map((priority, index) => (
              <li
                key={priority.wp_id}
                className={`flex items-center pb-2 first:pt-0 last:pb-0 ${
                  selectedPriority?.wp_id === priority.wp_id ? 'text-rouge-blue' : 'text-white'
                }`}
                onClick={() => onSelectPriority(priority)}
              >
                {selectedWeek !== getWeek(new Date(), { weekStartsOn: 1, firstWeekContainsDate: 4 }) && (
                  <SelectedAndCompltedIcon
                    isSelected={selectedPriority?.wp_id === priority.wp_id}
                    isCompleted={priority.is_completed === 1}
                  />
                )}
                <div className='flex flex-1 overflow-hidden'>{index + 1 + ' : ' + priority.priority}</div>
              </li>
            ))
          ) : (
            <div>{'Weekly priority of ' + selectedWeek + ' week is empty'}</div>
          )}
        </ul>
      </SmallLayout>
    </div>
  );
}

export default WeeklyPriorities;
