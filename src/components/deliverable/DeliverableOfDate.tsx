import { format, getWeek } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import SmallLayout from '../../container/common/SmallLayout';
import { sendDeliverablesWithPlanedDate } from '../../lib/api';
import useRequest from '../../lib/hooks/useRequest';
import { DeliverableState } from '../../modules/deliverable';
import { PriorityState } from '../../modules/weekPriority';
import { RootState } from '../../store';
import SelectedAndCompltedIcon from '../common/SelectedAndCompltedIcon';

interface Props {
  selectedDate: Date;
  selectedDeliverable: DeliverableState | null;
  newCreatedDeliverable: DeliverableState | null;
  onSelectDeliverable: (deliverable: DeliverableState) => void;
}
function DeliverableOfDate({ selectedDate, selectedDeliverable, newCreatedDeliverable, onSelectDeliverable }: Props) {
  const [deliverables, setDeliverables] = useState<DeliverableState[]>([]);

  const { userInfo } = useSelector((state: RootState) => state.user);

  const [_sendDeliverablesWithPlanedDate, , sendDeliverablesWithPlanedDateRes] = useRequest(sendDeliverablesWithPlanedDate);

  useEffect(() => {
    if (newCreatedDeliverable) {
      setDeliverables([...deliverables, newCreatedDeliverable]);
    }
  }, [newCreatedDeliverable]);
  useEffect(() => {
    const user_id = userInfo?.user_id;
    const planned_end_date = format(selectedDate, 'yyyy-MM-dd');
    _sendDeliverablesWithPlanedDate(user_id, planned_end_date);
  }, [selectedDate]);
  React.useEffect(() => {
    if (sendDeliverablesWithPlanedDateRes) {
      setDeliverables(sendDeliverablesWithPlanedDateRes.deliverable);
    }
  }, [sendDeliverablesWithPlanedDateRes]);
  return (
    <div className='text-white mt-4'>
      <div className='flex justify-center'>
        <span className='text-base'>Weekly priorities</span>
      </div>
      <SmallLayout className='w-full bg-card-gray rounded-md flex'>
        <ul role='list' className='p-4'>
          {deliverables.length > 0 ? (
            deliverables.map((deliverable, index) => (
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
            <div>empty!</div>
          )}
        </ul>
      </SmallLayout>
    </div>
  );
}

export default DeliverableOfDate;
