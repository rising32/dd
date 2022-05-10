import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DeliverableState } from '../../modules/deliverable';
import { Control, useWatch } from 'react-hook-form';
import { IDeliverableFormInput } from './DeliverablePanel';

interface Props {
  selectedDeliverableTab: string;
  selectedDeliverable: DeliverableState | null;
  onSelectDeliverableTab: (item: string) => void;
  control: Control<IDeliverableFormInput>;
}
function DeliverableTab({ selectedDeliverableTab, selectedDeliverable, control, onSelectDeliverableTab }: Props) {
  const navigate = useNavigate();
  const client = useWatch({
    control,
    name: 'client',
  });
  const onSelectTab = (item: string) => {
    if (!selectedDeliverable) return;
    if (item === 'File') {
      navigate('/deliverables/file');
    }
    if (item === 'Picture') {
      navigate(`/deliverables/camera${client?.client_id}`);
    }
    onSelectDeliverableTab(item);
  };
  return (
    <div className='absolute -bottom-1 left-0 w-full flex flex-row justify-evenly items-center text-xs'>
      {['Details', 'File', 'Picture', 'Screenshot', 'Expenses'].map(item => (
        <div
          key={item}
          className='rounded-t-md px-2'
          onClick={() => onSelectTab(item)}
          style={{ background: selectedDeliverableTab === item ? 'white' : '#365B9D' }}
        >
          <span style={{ color: selectedDeliverableTab === item ? '#DD0000' : 'white' }}>{item}</span>
        </div>
      ))}
    </div>
  );
}

export default DeliverableTab;
