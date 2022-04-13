import React from 'react';

interface Props {
  selectedPriorityTab: string;
  onSelectPriorityTab: (index: string) => void;
}
function AchievedPriorityTab({ selectedPriorityTab, onSelectPriorityTab }: Props) {
  return (
    <div className='absolute -bottom-1 left-0 w-full flex flex-row justify-evenly items-center'>
      {['Details', 'Agenda', 'Project', 'Support', '?'].map(item => (
        <div
          key={item}
          className='rounded-t-md px-2'
          onClick={() => onSelectPriorityTab(item)}
          style={{ background: selectedPriorityTab === item ? 'white' : '#365B9D' }}
        >
          <span className='text-sm' style={{ color: selectedPriorityTab === item ? '#DD0000' : 'white' }}>
            {item}
          </span>
        </div>
      ))}
    </div>
  );
}

export default AchievedPriorityTab;
