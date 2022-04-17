import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import SmallLayout from '../../container/common/SmallLayout';
import { sendCreatePriority } from '../../lib/api';
import useRequest from '../../lib/hooks/useRequest';
import { ClientState } from '../../modules/client';
import { ProjectState } from '../../modules/project';
import { PriorityState } from '../../modules/weekPriority';
import { RootState } from '../../store';
import PlusButton from '../common/PlusButton';
import ShowClientList from '../items/ShowClientList';
import ShowProjectList from '../items/ShowProjectList';
import AchievedPriorityTab from './AchievedPriorityTab';
import CreatePriority from './CreatePriority';
import DetailPriority from './DetailPriority';

interface Props {
  selectedWeek: number;
  selectedPriority: PriorityState | null;
  addWeekPriority: (priority: PriorityState) => void;
}
function AchievedPriority({ selectedWeek, selectedPriority, addWeekPriority }: Props) {
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
        <span className='text-base'>Priority achieved this week with clear goal defined</span>
      </div>
      <SmallLayout className='w-full bg-card-gray rounded-md flex flex-col border-rouge-blue border-4 p-4 relative'>
        {selectedPriority ? (
          <DetailPriority selectedWeek={selectedWeek} selectedPriority={selectedPriority} selectedPriorityTab={selectedPriorityTab} />
        ) : (
          <CreatePriority selectedWeek={selectedWeek} addWeekPriority={addWeekPriority} />
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
