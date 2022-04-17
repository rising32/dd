import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DeliverableState } from '../../modules/deliverable';

interface Props {
  selectedDeliverableTab: string;
  selectedDeliverable: DeliverableState | null;
  onSelectDeliverableTab: (item: string) => void;
}
function DeliverableTab({ selectedDeliverableTab, selectedDeliverable, onSelectDeliverableTab }: Props) {
  const navigate = useNavigate();
  const onSelectTab = (item: string) => {
    if (!selectedDeliverable) return;
    if (item === 'File') {
      navigate('/deliverables/file');
    }
    onSelectDeliverableTab(item);
  };
  return (
    <div className='absolute -bottom-1 left-0 w-full flex flex-row justify-evenly items-center'>
      {['Details', 'File', 'Picture', 'Screenshot', 'Expenses'].map(item => (
        <div
          key={item}
          className='rounded-t-md px-2'
          onClick={() => onSelectTab(item)}
          style={{ background: selectedDeliverableTab === item ? 'white' : '#365B9D' }}
        >
          <span className='text-sm' style={{ color: selectedDeliverableTab === item ? '#DD0000' : 'white' }}>
            {item}
          </span>
        </div>
      ))}
    </div>
  );
}

export default DeliverableTab;
