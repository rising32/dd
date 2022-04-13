import { getWeek } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import SmallLayout from '../../container/common/SmallLayout';
import { sendPriorityByWeek } from '../../lib/api';
import useRequest from '../../lib/hooks/useRequest';
import { DeliverableState } from '../../modules/deliverable';
import { PriorityState } from '../../modules/weekPriority';
import { RootState } from '../../store';
import SelectedAndCompltedIcon from '../common/SelectedAndCompltedIcon';

interface Props {
  selectedDate: Date;
  selectedDeliverable: DeliverableState | null;
  newCreatedWeekDeliverable: DeliverableState | null;
  onSelectDeliverable: (deliverable: DeliverableState) => void;
}
function TodayDeliverable({ selectedDate, selectedDeliverable, newCreatedWeekDeliverable, onSelectDeliverable }: Props) {
  const [todayDeliverables, setTodayDeliverables] = useState<DeliverableState[]>([]);

  const { userInfo } = useSelector((state: RootState) => state.user);

  const [_sendPriorityByWeek, , sendPriorityByWeekRes] = useRequest(sendPriorityByWeek);

  //   useEffect(() => {
  //     if (newCreatedWeekPriority) {
  //       setWeeklyPriorities([...weeklyPriorities, newCreatedWeekPriority]);
  //     }
  //   }, [newCreatedWeekPriority]);
  //   useEffect(() => {
  //     const user_id = userInfo?.user_id;
  //     const week = selectedWeek;
  //     _sendPriorityByWeek(user_id, week);
  //   }, [selectedWeek]);
  //   React.useEffect(() => {
  //     if (sendPriorityByWeekRes) {
  //       setWeeklyPriorities(sendPriorityByWeekRes.priority);
  //     }
  //   }, [sendPriorityByWeekRes]);
  return (
    <div className='text-white mt-4'>
      <div className='flex justify-center'>
        <span className='text-base'>Weekly priorities</span>
      </div>
      <SmallLayout className='w-full rounded-md flex'>
        <ul role='list' className='p-4'>
          {todayDeliverables.length > 0 ? (
            todayDeliverables.map((deliverable, index) => (
              <li
                key={deliverable.deliverable_id}
                className={`flex items-center pb-2 first:pt-0 last:pb-0 ${
                  selectedDeliverable?.deliverable_id === deliverable.deliverable_id ? 'text-rouge-blue' : 'text-white'
                }`}
                onClick={() => onSelectDeliverable(deliverable)}
              >
                <div className='flex flex-1 overflow-hidden'>{index + 1 + ' : ' + deliverable.deliverable_name}</div>
              </li>
            ))
          ) : (
            <div>{'Deliverable of ' + selectedDate.toDateString() + ' is empty!'}</div>
          )}
        </ul>
      </SmallLayout>
    </div>
  );
}

export default TodayDeliverable;
