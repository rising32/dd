import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import SmallLayout from '../../container/common/SmallLayout';
import { sendPastNotAchievedPriorities } from '../../lib/api';
import useRequest from '../../lib/hooks/useRequest';
import { PriorityState } from '../../modules/weekPriority';
import { RootState } from '../../store';

interface Props {
  selectedWeek: number;
}
function PastNotAchievedPriority({ selectedWeek }: Props) {
  const [pastNotAchievedPriorities, setPastNotAchievedPriorities] = useState<PriorityState[]>([]);

  const { userInfo } = useSelector((state: RootState) => state.user);

  const [_sendPastNotAchievedPriorities, , sendPastNotAchievedPrioritiesRes] = useRequest(sendPastNotAchievedPriorities);

  useEffect(() => {
    const user_id = userInfo?.user_id;
    const week = selectedWeek;
    _sendPastNotAchievedPriorities(user_id, week);
  }, [selectedWeek]);
  React.useEffect(() => {
    if (sendPastNotAchievedPrioritiesRes) {
      setPastNotAchievedPriorities(sendPastNotAchievedPrioritiesRes.priority);
    }
  }, [sendPastNotAchievedPrioritiesRes]);
  return (
    <div className='text-white mt-4'>
      <div className='flex justify-center'>
        <span className='text-base'>Past priorities not achieved</span>
      </div>
      <SmallLayout className='w-full bg-card-gray rounded-md flex'>
        <ul role='list' className='p-4'>
          {pastNotAchievedPriorities.length > 0 ? (
            pastNotAchievedPriorities.map((priority, index) => (
              <li key={priority.wp_id} className='flex items-center pb-2 first:pt-0 last:pb-0'>
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

export default PastNotAchievedPriority;
