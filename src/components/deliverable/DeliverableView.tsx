import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import WeekCalendar from '../../components/calendar/WeekCalendar';
import { DeliverableState } from '../../modules/deliverable';
import { RootState } from '../../store';
import CreateDeliverable from './CreateDeliverable';
import DeliverableOfDate from './DeliverableOfDate';
import BeforeWeeklyPriority from './BeforeWeeklyPriority';
import { PriorityState } from '../../modules/weekPriority';
import ReactModal from 'react-modal';
import useRequest from '../../lib/hooks/useRequest';
import { sendUpdatePriority } from '../../lib/api';

function DeliverableView() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDeliverable, setSelectedDeliverable] = useState<DeliverableState | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<PriorityState | null>(null);
  const [selectablePriority, setSelectablePriority] = useState<PriorityState | null>(null);
  const [newCreatedDeliverable, setNewCreatedDeliverable] = useState<DeliverableState | null>(null);
  const [updatedDeliverable, setUpdatedDeliverable] = useState<DeliverableState | null>(null);
  const [updatedPriority, setUpdatededPriority] = useState<PriorityState | null>(null);
  const [isDeliverableFromPriority, setIsDeliverableFromPriority] = useState(false);

  const { userInfo } = useSelector((state: RootState) => state.user);
  const [_sendUpdatePriority, , sendUpdatePriorityRes] = useRequest(sendUpdatePriority);

  const onSelectDate = (date: Date) => {
    setSelectedDate(date);
  };
  const onSelectDeliverable = (deliverable: DeliverableState) => {
    if (selectedDeliverable?.deliverable_id === deliverable.deliverable_id) {
      setSelectedDeliverable(null);
    } else {
      setSelectedDeliverable(deliverable);
      setSelectedPriority(null);
    }
  };
  const onSelectPriority = (priority: PriorityState) => {
    if (selectedPriority?.wp_id === priority.wp_id) {
      setSelectedPriority(null);
    } else {
      setSelectablePriority(priority);
      setSelectedDeliverable(null);
      setIsDeliverableFromPriority(true);
    }
  };
  const addDeliverable = (deliverable: DeliverableState) => {
    setNewCreatedDeliverable(deliverable);
    if (selectedPriority) {
      _sendUpdatePriority({ ...selectedPriority, is_completed: 1 });
    } else {
      setSelectedPriority(null);
      setSelectedDeliverable(null);
    }
  };
  React.useEffect(() => {
    if (sendUpdatePriorityRes) {
      setSelectedPriority(null);
      setSelectedDeliverable(null);
      setUpdatededPriority(sendUpdatePriorityRes);
    }
  }, [sendUpdatePriorityRes]);
  const updateDeliverable = (deliverable: DeliverableState) => {
    setUpdatedDeliverable(deliverable);
    setSelectedPriority(null);
    setSelectedDeliverable(null);
  };
  const onCancelDeliverableFromPriority = () => {
    setSelectablePriority(null);
    setIsDeliverableFromPriority(false);
  };
  const onDeliverableFromPriority = () => {
    setSelectedPriority(selectablePriority);
    setIsDeliverableFromPriority(false);
  };

  return (
    <>
      <WeekCalendar selectedDate={selectedDate} onSelectDate={onSelectDate} />
      <DeliverableOfDate
        selectedDate={selectedDate}
        selectedDeliverable={selectedDeliverable}
        onSelectDeliverable={onSelectDeliverable}
        newCreatedDeliverable={newCreatedDeliverable}
        updatedDeliverable={updatedDeliverable}
      />
      <CreateDeliverable
        selectedDate={selectedDate}
        addDeliverable={addDeliverable}
        selectedDeliverable={selectedDeliverable}
        selectedPriority={selectedPriority}
        updateDeliverable={updateDeliverable}
      />
      <BeforeWeeklyPriority
        selectedDate={selectedDate}
        selectedPriority={selectedPriority}
        onSelectPriority={onSelectPriority}
        updatedPriority={updatedPriority}
      />
      <ReactModal
        isOpen={isDeliverableFromPriority}
        className='w-4/5 max-h-96 bg-white p-4 overflow-auto rounded-sm flex flex-col items-center justify-center'
        style={{
          overlay: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.5)',
          },
        }}
      >
        <div className='text-center'>Deliverable from priority?</div>
        <div className='flex flex-row'>
          <div className='font-bold pr-2'>Deliverable:</div>
          <div className='font-bold'>{selectedPriority?.priority}</div>
        </div>
        <div className='flex flex-row items-start justify-between w-full px-8 pt-4'>
          <div className='text-lg font-bold' onClick={onCancelDeliverableFromPriority}>
            No
          </div>
          <div className='text-lg font-bold text-rouge-blue' onClick={onDeliverableFromPriority}>
            Yes
          </div>
        </div>
      </ReactModal>
    </>
  );
}

export default DeliverableView;
