import { format, getWeek } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import SmallLayout from '../../container/common/SmallLayout';
import { sendMyBeforePriorities, sendUpdatePriority } from '../../lib/api';
import useRequest from '../../lib/hooks/useRequest';
import { DeliverableState } from '../../modules/deliverable';
import { PriorityState } from '../../modules/weekPriority';
import { RootState } from '../../store';
import MoreButton from '../common/MoreButton';
import SelectedAndCompltedIcon from '../common/SelectedAndCompltedIcon';

interface Props {
  selectedDate: Date;
  newCreatedDeliverable: DeliverableState | null;
  selectedPriority: PriorityState | null;
  onSelectPriority: (priority: PriorityState | null) => void;
}
function BeforeWeeklyPriority({ selectedDate, selectedPriority, newCreatedDeliverable, onSelectPriority }: Props) {
  const [myWeeklyPriorities, setMyWeeklyPriorities] = useState<PriorityState[]>([]);

  const { userInfo } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const [_sendMyBeforePriorities, , sendMyBeforePrioritiesRes] = useRequest(sendMyBeforePriorities);
  const [_sendUpdatePriority, , sendUpdatePriorityRes] = useRequest(sendUpdatePriority);

  useEffect(() => {
    if (newCreatedDeliverable && selectedPriority) {
      _sendUpdatePriority({
        wp_id: selectedPriority.wp_id,
        user_id: selectedPriority.user_id,
        week: selectedPriority.week,
        priority: selectedPriority.priority,
        goal: selectedPriority.goal,
        detail: selectedPriority.detail,
        is_completed: 1,
        is_weekly: selectedPriority.is_weekly,
        end_date: format(new Date(), 'yyyy-MM-dd'),
      });
    }
  }, [newCreatedDeliverable]);
  React.useEffect(() => {
    if (sendUpdatePriorityRes) {
      const newMyWeeklyPriorities = myWeeklyPriorities.map(priority => {
        if (priority.wp_id === sendUpdatePriorityRes.wp_id) {
          return sendUpdatePriorityRes;
        } else {
          return priority;
        }
      });
      setMyWeeklyPriorities(newMyWeeklyPriorities);
      onSelectPriority(null);
    }
  }, [sendUpdatePriorityRes]);
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
      <SmallLayout className='w-full bg-card-gray rounded-md py-4'>
        <ul role='list' className='px-4'>
          {myWeeklyPriorities.length > 0 ? (
            myWeeklyPriorities.map(priority => (
              <li
                key={priority.wp_id}
                className={`flex items-center py-1 ${selectedPriority?.wp_id === priority.wp_id ? 'text-rouge-blue' : 'text-white'}`}
                onClick={() => onSelectPriority(priority)}
              >
                <SelectedAndCompltedIcon
                  isSelected={selectedPriority?.wp_id === priority.wp_id}
                  isCompleted={priority.is_completed === 1}
                />
                <div className='flex truncate'>{'W' + priority.week + ' : ' + priority.priority}</div>
              </li>
            ))
          ) : (
            <div>Weekly priority is empty</div>
          )}
        </ul>
        <MoreButton className='flex items-center justify-end mr-4' onMore={() => navigate('/priorities/priorityList')} />
      </SmallLayout>
    </div>
  );
}

export default BeforeWeeklyPriority;
