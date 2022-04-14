import React, { useState } from 'react';
import SmallLayout from '../../container/common/SmallLayout';
import { ClientState } from '../../modules/client';
import { ProjectState } from '../../modules/project';
import { TaskState } from '../../modules/task';
import ShowClientList from '../items/ShowClientList';
import ShowProjectList from '../items/ShowProjectList';
import ShowTaskList from '../items/ShowTaskList';
import PlusButton from '../common/PlusButton';
import DeliverableTab from './DeliverableTab';
import useRequest from '../../lib/hooks/useRequest';
import { sendCreateDeliverable } from '../../lib/api';
import { DeliverableState } from '../../modules/deliverable';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

interface Props {
  selectedDate: Date;
  addDeliverable: (deliverable: DeliverableState) => void;
}
function CreateDeliverable({ selectedDate, addDeliverable }: Props) {
  const [selectedClient, setSelectedClient] = useState<ClientState | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectState | null>(null);
  const [selectedTask, setSelectedTask] = useState<TaskState | null>(null);
  const [deliverableValue, setDeliverableValue] = useState('');
  const [selectedDeliverableTab, setSelectedDeliverableTab] = useState<string>('');

  const [_sendCreateDeliverable, , sendCreateDeliverableRes] = useRequest(sendCreateDeliverable);
  const { userInfo } = useSelector((state: RootState) => state.user);

  const onSelectClient = (client: ClientState) => {
    if (selectedClient?.client_id === client.client_id) {
      setSelectedClient(null);
    } else {
      setSelectedClient(client);
    }
    setSelectedProject(null);
    setSelectedTask(null);
  };
  const onSelectProject = (project: ProjectState) => {
    if (selectedProject?.project_id === project.project_id) {
      setSelectedProject(null);
    } else {
      setSelectedProject(project);
    }
  };
  const onSelectTask = (task: TaskState | null) => {
    if (selectedTask?.task_id === task?.task_id) {
      setSelectedTask(null);
    } else {
      setSelectedTask(task);
    }
  };
  const changeDeliverableValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDeliverableValue(event.target.value);
  };
  const onCreateDeliverable = () => {
    if (!deliverableValue) {
      toast.error('select deliverable!');
      return;
    }
    if (userInfo && selectedTask && selectedTask.task_id) {
      const deliverable: DeliverableState = {
        deliverable_id: null,
        deliverable_name: deliverableValue,
        user_id: userInfo?.user_id,
        task_id: selectedTask.task_id,
        periority_id: null,
        budget: 50,
        planned_end_date: format(selectedDate, 'yyyy-MM-dd'),
        end_date: null,
        is_completed: 0,
      };
      _sendCreateDeliverable(deliverable);
    }
  };
  React.useEffect(() => {
    if (sendCreateDeliverableRes) {
      setSelectedClient(null);
      setSelectedProject(null);
      setSelectedTask(null);
      setDeliverableValue('');
      addDeliverable(sendCreateDeliverableRes);
    }
  }, [sendCreateDeliverableRes]);
  const onSelectDeliverableTab = (tab: string) => {
    setSelectedDeliverableTab(preSelectedProject => (preSelectedProject === tab ? '' : tab));
  };

  return (
    <div className='text-white mt-4'>
      <div className='flex justify-center'>
        <span className='text-base'>At least 2 deliverable per day</span>
      </div>
      <SmallLayout className='p-4 bg-card-gray border-rouge-blue border-4 text-white relative'>
        <ShowClientList selectedClient={selectedClient} onSelectClient={onSelectClient} />
        <ShowProjectList selectedClient={selectedClient} selectedProject={selectedProject} onSelectProject={onSelectProject} />
        <ShowTaskList selectedTask={selectedTask} selectedProject={selectedProject} onSelectTask={onSelectTask} />

        <label className='block mt-4 w-full'>
          <span className="after:content-['*'] after:ml-0.5 after:text-rouge-blue block font-bold">Deliverable</span>
          <input
            type='text'
            name='priority'
            value={deliverableValue}
            onChange={changeDeliverableValue}
            className='mt-1 px-3 py-2 bg-transparent border shadow-sm border-dark-gray focus:outline-none focus:border-rouge-blue block w-full rounded-md sm:text-sm focus:ring-1'
            placeholder='Enter Deliverable Name'
          />
        </label>
        <DeliverableTab selectedDeliverableTab={selectedDeliverableTab} onSelectDeliverableTab={onSelectDeliverableTab} />
        <PlusButton className='flex items-center justify-end my-4' onPlus={onCreateDeliverable} />
      </SmallLayout>
    </div>
  );
}

export default CreateDeliverable;
