import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { CompleteSvg } from '../../assets/svg';
import SmallLayout from '../../container/common/SmallLayout';
import { sendDeliverablesWithPlanedDate, sendUpdateDeliverable } from '../../lib/api';
import useRequest from '../../lib/hooks/useRequest';
import { DeliverableState } from '../../modules/deliverable';
import { RootState } from '../../store';
import Tag from '../common/Tag';

interface Props {
  selectedDate: Date;
  selectedDeliverable: DeliverableState | null;
  newCreatedDeliverable: DeliverableState | null;
  updatedDeliverable: DeliverableState | null;
  onSelectDeliverable: (deliverable: DeliverableState) => void;
}
function DeliverableOfDate({ selectedDate, selectedDeliverable, newCreatedDeliverable, updatedDeliverable, onSelectDeliverable }: Props) {
  const [deliverables, setDeliverables] = useState<DeliverableState[]>([]);
  const [percentageValue, setPercentageValue] = useState(0);
  const [loaded, setLoaded] = useState<string | null>(null);

  const { userInfo } = useSelector((state: RootState) => state.user);

  const [_sendDeliverablesWithPlanedDate, , sendDeliverablesWithPlanedDateRes] = useRequest(sendDeliverablesWithPlanedDate);
  const [_sendUpdateDeliverable, , sendUpdateDeliverableRes] = useRequest(sendUpdateDeliverable);

  useEffect(() => {
    if (newCreatedDeliverable) {
      setDeliverables([...deliverables, newCreatedDeliverable]);
    }
    if (updatedDeliverable) {
      const newDeliverables = deliverables.map(deliverable => {
        if (deliverable.deliverable_id === updatedDeliverable.deliverable_id) {
          return updatedDeliverable;
        } else {
          return deliverable;
        }
      });
      setDeliverables(newDeliverables);
    }
  }, [newCreatedDeliverable, updatedDeliverable]);
  useEffect(() => {
    setLoaded('start');
    const user_id = userInfo?.user_id;
    const planned_end_date = format(selectedDate, 'yyyy-MM-dd');
    _sendDeliverablesWithPlanedDate(user_id, planned_end_date);
  }, [selectedDate, userInfo]);
  React.useEffect(() => {
    if (sendDeliverablesWithPlanedDateRes) {
      setDeliverables(sendDeliverablesWithPlanedDateRes.deliverable);
      setLoaded('end');
    }
  }, [sendDeliverablesWithPlanedDateRes]);
  const onComplete = (deliverable: DeliverableState) => {
    if (deliverable.is_completed === 0) {
      setLoaded('start');
      _sendUpdateDeliverable({
        ...deliverable,
        planned_end_date: format(selectedDate, 'yyyy-MM-dd'),
        is_completed: 1,
      });
    }
  };
  React.useEffect(() => {
    if (sendUpdateDeliverableRes) {
      const newDeliverables = deliverables.map(deliverable => {
        if (deliverable.deliverable_id === sendUpdateDeliverableRes.deliverable_id) {
          return sendUpdateDeliverableRes;
        }
        return deliverable;
      });
      setDeliverables(newDeliverables);
      setLoaded('end');
    }
  }, [sendUpdateDeliverableRes, deliverables]);

  React.useEffect(() => {
    let percentage = 0;
    deliverables.map(item => {
      if (item.is_completed === 1) {
        percentage += 50;
      }
    });
    setPercentageValue(percentage);
  }, [deliverables]);

  const options: Intl.DateTimeFormatOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };

  return (
    <div className='text-white mt-4'>
      <div className='flex justify-between items-center px-4 pt-4 pb-2 w-full'>
        <span className='font-bold flex-1 truncate'>{new Date(selectedDate).toLocaleDateString(undefined, options)}</span>
        <span>{percentageValue + ' %'}</span>
      </div>
      <SmallLayout className='w-full bg-card-gray rounded-md flex'>
        <ul role='list' className='p-4 w-full'>
          {deliverables.length > 0 ? (
            deliverables.map((deliverable, index) => (
              <li key={deliverable.deliverable_id} className='flex items-center justify-between w-full pb-2 first:pt-0 last:pb-0'>
                <div
                  className={`flex flex-1 mr-2 truncate ${
                    selectedDeliverable?.deliverable_id === deliverable.deliverable_id ? 'text-rouge-blue' : 'text-white'
                  }`}
                  onClick={() => onSelectDeliverable(deliverable)}
                >
                  {index + 1 + ' : ' + deliverable.deliverable_name}
                </div>
                <div className='flex'>
                  {deliverable.periority_id && <Tag className='flex text-white text-sm mx-2'>P</Tag>}
                  <CompleteSvg
                    className={`w-6 h-6 ${deliverable.is_completed === 0 ? 'fill-white' : 'fill-rouge-blue'}`}
                    onClick={() => onComplete(deliverable)}
                  />
                  <p className='flex w-10 items-center justify-center'>{deliverable.is_completed * 50 + ' %'}</p>
                </div>
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
