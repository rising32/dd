import React from 'react';

interface Props {
  selectedDeliverableTab: string;
  onSelectDeliverableTab: (index: string) => void;
}
function DeliverableTab({ selectedDeliverableTab, onSelectDeliverableTab }: Props) {
  return (
    <div className='absolute -bottom-1 left-0 w-full flex flex-row justify-evenly items-center'>
      {['Details', 'File', 'Picture', 'Screenshot', 'Expenses'].map(item => (
        <div
          key={item}
          className='rounded-t-md px-2'
          onClick={() => onSelectDeliverableTab(item)}
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
