import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useRequest from '../../lib/hooks/useRequest';
import { RootState } from '../../store';
import HeaderWithTitle from '../base/HeaderWithTitle';
import { sendMyBeforePriorities } from '../../lib/api';
import { PriorityState } from '../../modules/weekPriority';
import { getWeek } from 'date-fns';
import SmallLayout from '../../container/common/SmallLayout';
import SelectedAndCompltedIcon from '../common/SelectedAndCompltedIcon';

function PriorityListView() {
  const [myWeeklyPriorities, setMyWeeklyPriorities] = useState<PriorityState[]>([]);
  const [selectedPriority, setSelectedPriority] = useState<PriorityState | null>(null);

  const { userInfo } = useSelector((state: RootState) => state.user);
  const [_sendMyBeforePriorities, , sendMyBeforePrioritiesRes] = useRequest(sendMyBeforePriorities);

  useEffect(() => {
    const user_id = userInfo?.user_id;
    const week = getWeek(new Date(), { weekStartsOn: 1, firstWeekContainsDate: 4 });
    _sendMyBeforePriorities(user_id, week);
  }, []);
  React.useEffect(() => {
    if (sendMyBeforePrioritiesRes) {
      setMyWeeklyPriorities(sendMyBeforePrioritiesRes.priority);
    }
  }, [sendMyBeforePrioritiesRes]);

  return (
    <>
      <HeaderWithTitle title='All Priority' />

      <SmallLayout className='mt-4 bg-white text-black rounded-md py-4'>
        <ul role='list' className='px-4'>
          {myWeeklyPriorities.length > 0 ? (
            myWeeklyPriorities.map(priority => (
              <li
                key={priority.wp_id}
                className={`flex items-center py-1 ${selectedPriority?.wp_id === priority.wp_id && 'text-rouge-blue'}`}
                onClick={() => setSelectedPriority(priority)}
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
      </SmallLayout>
    </>
  );
}

export default PriorityListView;
