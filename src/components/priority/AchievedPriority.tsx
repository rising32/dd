import React, { useState } from 'react';
import SmallLayout from '../../container/common/SmallLayout';
import { PriorityState } from '../../modules/weekPriority';
import AchievedPriorityTab from './AchievedPriorityTab';
import CreatePriority from './CreatePriority';
import DetailPriority from './DetailPriority';

interface Props {
  selectedWeek: number;
  selectedPriority: PriorityState | null;
  addPriority: (priority: PriorityState) => void;
}
function AchievedPriority({ selectedWeek, selectedPriority, addPriority }: Props) {
  const [selectedPriorityTab, setSelectedPriorityTab] = useState<string>('');

  React.useEffect(() => {
    if (selectedPriority) {
      setSelectedPriorityTab('Details');
    } else {
      setSelectedPriorityTab('');
    }
  }, [selectedPriority]);

  const onSelectPriorityTab = (tab: string) => {
    setSelectedPriorityTab(preSelectedProject => (preSelectedProject === tab ? '' : tab));
  };
  return (
    <div className='text-white mt-4'>
      <div className='flex justify-center'>
        <span className='text-center'>Priority achieved this week with clear goal defined</span>
      </div>
      <SmallLayout className='w-full bg-card-gray rounded-md flex flex-col border-rouge-blue border-4 p-4 relative'>
        {selectedPriority ? (
          <DetailPriority selectedPriority={selectedPriority} selectedPriorityTab={selectedPriorityTab} />
        ) : (
          <CreatePriority selectedWeek={selectedWeek} addPriority={addPriority} />
        )}
        <AchievedPriorityTab
          selectedPriorityTab={selectedPriorityTab}
          selectedPriority={selectedPriority}
          onSelectPriorityTab={onSelectPriorityTab}
        />
      </SmallLayout>
    </div>
  );
}

export default AchievedPriority;
