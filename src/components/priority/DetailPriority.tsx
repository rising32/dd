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

interface Props {
  selectedWeek: number;
  selectedPriorityTab: string;
  selectedPriority: PriorityState;
}
function DetailPriority({ selectedWeek, selectedPriorityTab, selectedPriority }: Props) {
  const [selectedClient, setSelectedClient] = useState<ClientState | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectState | null>(null);

  const { userInfo } = useSelector((state: RootState) => state.user);

  const onSelectClient = (client: ClientState | null) => {
    setSelectedClient(client);
    setSelectedProject(null);
  };
  const onSelectProject = (project: ProjectState) => {
    if (selectedProject?.project_id === project.project_id) {
      setSelectedProject(null);
    } else {
      setSelectedProject(project);
    }
  };
  const onCreateWeekPriority = () => {
    ///
  };
  return (
    <>
      <div className='flex'>
        <span className='block text-lg font-bold'>Priority :</span>
        <span className='pl-4 truncate'>{selectedPriority.priority}</span>
      </div>
      <div className='flex mt-2'>
        <span className='block text-lg font-bold'>Goal :</span>
        <span className='pl-4 truncate'>{selectedPriority.goal}</span>
      </div>
      <div className='flex mt-2'>
        <span className='block text-lg font-bold'>Detail :</span>
        <div className='flex flex-col pl-8'>
          <div className={`${selectedPriority.is_weekly === 1 ? 'text-rouge-blue' : 'text-white'}`}>A. Weely Priority</div>
          <div className={`${selectedPriority.is_weekly === 2 ? 'text-rouge-blue' : 'text-white'}`}>B. Monthly Priority</div>
        </div>
      </div>
      {selectedPriorityTab === 'Project' && (
        <>
          <ShowClientList selectedClient={selectedClient} onSelectClient={onSelectClient} />
          <ShowProjectList selectedClient={selectedClient} selectedProject={selectedProject} onSelectProject={onSelectProject} />
        </>
      )}
      <PlusButton className='flex items-center justify-end my-4' onPlus={onCreateWeekPriority} />
    </>
  );
}

export default DetailPriority;
