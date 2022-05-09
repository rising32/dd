import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PriorityState } from '../../modules/weekPriority';

interface Props {
  selectedPriorityTab: string;
  selectedPriority: PriorityState | null;
  onSelectPriorityTab: (index: string) => void;
}
function PriorityTab({ selectedPriorityTab, selectedPriority, onSelectPriorityTab }: Props) {
  const navigate = useNavigate();
  const onSelectTab = (item: string) => {
    if (!selectedPriority) return;
    if (item === 'Agenda') {
      navigate(`/priorities/agenda-${selectedPriority?.wp_id}`);
    }
    onSelectPriorityTab(item);
  };
  return (
    <div className='absolute -bottom-1 left-0 w-full flex flex-row justify-evenly items-center text-xs'>
      {['Details', 'Agenda', 'Project', 'Support', '?'].map(item => (
        <div
          key={item}
          className='rounded-t-md px-2'
          onClick={() => onSelectTab(item)}
          style={{ background: selectedPriorityTab === item ? 'white' : '#365B9D' }}
        >
          <span style={{ color: selectedPriorityTab === item ? '#DD0000' : 'white' }}>{item}</span>
        </div>
      ))}
    </div>
  );
}

export default PriorityTab;
