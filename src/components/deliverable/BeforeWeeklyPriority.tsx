import { getWeek } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import SmallLayout from '../../container/common/SmallLayout';
import { sendMyBeforePriorities } from '../../lib/api';
import useRequest from '../../lib/hooks/useRequest';
import { PriorityState } from '../../modules/weekPriority';
import { RootState } from '../../store';
import SelectedAndCompltedIcon from '../common/SelectedAndCompltedIcon';

interface Props {
  selectedDate: Date;
  selectedPriority: PriorityState | null;
  onSelectPriority: (priority: PriorityState) => void;
}
function BeforeWeeklyPriority({ selectedDate, selectedPriority, onSelectPriority }: Props) {
  const [myWeeklyPriorities, setMyWeeklyPriorities] = useState<PriorityState[]>([]);

  const { userInfo } = useSelector((state: RootState) => state.user);

  const [_sendMyBeforePriorities, , sendMyBeforePrioritiesRes] = useRequest(sendMyBeforePriorities);

  useEffect(() => {
    const user_id = userInfo?.user_id;
    const week = getWeek(selectedDate, { weekStartsOn: 1, firstWeekContainsDate: 4 });
    _sendMyBeforePriorities(user_id, week);
  }, [selectedDate]);
  React.useEffect(() => {
    if (sendMyBeforePrioritiesRes) {
      setMyWeeklyPriorities(sendMyBeforePrioritiesRes.priority);
    }
  }, [sendMyBeforePrioritiesRes]);
  return (
    <div className='text-white mt-4'>
      <div className='flex justify-center'>
        <span className='text-base'>Remember your weekly priorities</span>
      </div>
      <SmallLayout className='w-full bg-card-gray rounded-md flex'>
        <ul role='list' className='p-4'>
          {myWeeklyPriorities.length > 0 ? (
            myWeeklyPriorities.map(priority => (
              <li
                key={priority.wp_id}
                className={`flex items-center pb-2 first:pt-0 last:pb-0 ${
                  selectedPriority?.wp_id === priority.wp_id ? 'text-rouge-blue' : 'text-white'
                }`}
                onClick={() => onSelectPriority(priority)}
              >
                <SelectedAndCompltedIcon
                  isSelected={selectedPriority?.wp_id === priority.wp_id}
                  isCompleted={priority.is_completed === 1}
                />
                <div className='flex flex-1 overflow-hidden'>{'W' + priority.week + ' : ' + priority.priority}</div>
              </li>
            ))
          ) : (
            <div>Weekly priority is empty</div>
          )}
        </ul>
      </SmallLayout>
    </div>
  );
}

export default BeforeWeeklyPriority;
