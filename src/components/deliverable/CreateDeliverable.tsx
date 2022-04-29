import React, { useState } from 'react';
import SmallLayout from '../../container/common/SmallLayout';
import { ClientState } from '../../modules/client';
import { ProjectState } from '../../modules/project';
import { TaskState } from '../../modules/task';
import SelectClient from '../items/SelectClient';
import SelectProject from '../items/SelectProject';
import SelectTask from '../items/SelectTask';
import PlusButton from '../common/PlusButton';
import DeliverableTab from './DeliverableTab';
import useRequest from '../../lib/hooks/useRequest';
import { sendCreateDeliverable, sendDeliverableInfo, sendUpdateDeliverable } from '../../lib/api';
import { DeliverableInfoState, DeliverableState } from '../../modules/deliverable';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { PriorityState } from '../../modules/weekPriority';
import LoadingModal from '../common/LoadingModal';

interface Props {
  selectedDate: Date;
  addDeliverable: (deliverable: DeliverableState) => void;
  updateDeliverable: (deliverable: DeliverableState) => void;
  selectedPriority?: PriorityState | null;
  selectedDeliverable: DeliverableState | null;
}
function CreateDeliverable({ selectedDate, selectedDeliverable, selectedPriority, addDeliverable, updateDeliverable }: Props) {
  const [selectedClient, setSelectedClient] = useState<ClientState | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectState | null>(null);
  const [selectedTask, setSelectedTask] = useState<TaskState | null>(null);
  const [deliverableValue, setDeliverableValue] = useState('');
  const [selectedDeliverableTab, setSelectedDeliverableTab] = useState<string>('');
  const [deliverableInfo, setDeliverableInfo] = useState<DeliverableInfoState | null>(null);
  const [disabled, setDisabled] = useState(false);
  const [loaded, setLoaded] = useState<string | null>(null);

  const [_sendCreateDeliverable, , sendCreateDeliverableRes] = useRequest(sendCreateDeliverable);
  const [_sendDeliverableInfo, , sendDeliverableInfoRes] = useRequest(sendDeliverableInfo);
  const [_sendUpdateDeliverable, , sendUpdateDeliverableRes] = useRequest(sendUpdateDeliverable);
  const { userInfo } = useSelector((state: RootState) => state.user);

  React.useEffect(() => {
    if (selectedDeliverable) {
      setLoaded('start');
      const deliverable_id = selectedDeliverable.deliverable_id;
      _sendDeliverableInfo(deliverable_id);
      setSelectedDeliverableTab('Details');
    } else {
      setSelectedClient(null);
      setSelectedProject(null);
      setSelectedTask(null);
      setDeliverableValue('');
      setDeliverableInfo(null);
      setSelectedDeliverableTab('');
    }
  }, [selectedDeliverable]);
  React.useEffect(() => {
    if (selectedPriority) {
      setDeliverableValue(selectedPriority.priority);
      setDisabled(true);
    } else {
      setDeliverableValue('');
      setDisabled(false);
    }
  }, [selectedPriority]);
  React.useEffect(() => {
    if (sendDeliverableInfoRes) {
      setDeliverableInfo(sendDeliverableInfoRes.data);
      setDeliverableValue(sendDeliverableInfoRes.data.deliverable_name);
      setLoaded('end');
    }
  }, [sendDeliverableInfoRes]);
  const onSelectClient = (client: ClientState | null) => {
    setSelectedClient(client);
    setSelectedProject(null);
    setSelectedTask(null);
  };
  const onSelectProject = (project: ProjectState | null) => {
    if (selectedProject?.project_id === project?.project_id) {
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
      setLoaded('start');
      if (deliverableInfo && deliverableInfo.task_id === selectedTask?.task_id) {
        _sendUpdateDeliverable({
          ...deliverableInfo,
          task_id: selectedTask.task_id,
          planned_end_date: format(selectedDate, 'yyyy-MM-dd'),
          deliverable_name: deliverableValue,
        });
      }
      if (!deliverableInfo) {
        const deliverable: DeliverableState = {
          deliverable_id: null,
          deliverable_name: deliverableValue,
          user_id: userInfo?.user_id,
          task_id: selectedTask.task_id,
          periority_id: selectedPriority && selectedPriority.wp_id ? selectedPriority.wp_id : null,
          budget: 50,
          planned_end_date: format(selectedDate, 'yyyy-MM-dd'),
          end_date: null,
          is_completed: 0,
        };
        _sendCreateDeliverable(deliverable);
      }
    }
  };
  React.useEffect(() => {
    if (sendCreateDeliverableRes) {
      setSelectedClient(null);
      setSelectedProject(null);
      setSelectedTask(null);
      setDeliverableValue('');
      addDeliverable(sendCreateDeliverableRes);
      setLoaded('end');
    }
  }, [sendCreateDeliverableRes]);
  React.useEffect(() => {
    if (sendUpdateDeliverableRes) {
      setSelectedClient(null);
      setSelectedProject(null);
      setSelectedTask(null);
      setDeliverableValue('');
      updateDeliverable(sendUpdateDeliverableRes);
      setLoaded('end');
    }
  }, [sendUpdateDeliverableRes]);
  const onSelectDeliverableTab = (tab: string) => {
    setSelectedDeliverableTab(preSelectedProject => (preSelectedProject === tab ? '' : tab));
  };

  return (
    <div className='text-white mt-4'>
      <div className='flex justify-center'>
        <span className='text-base'>At least 2 deliverable per day</span>
      </div>
      <SmallLayout className='p-4 bg-card-gray border-rouge-blue border-4 text-white relative'>
        <SelectClient selectedClient={selectedClient} onSelectClient={onSelectClient} deliverableInfo={deliverableInfo} />
        <SelectProject
          selectedClient={selectedClient}
          selectedProject={selectedProject}
          onSelectProject={onSelectProject}
          deliverableInfo={deliverableInfo}
        />
        <SelectTask
          selectedTask={selectedTask}
          selectedProject={selectedProject}
          onSelectTask={onSelectTask}
          deliverableInfo={deliverableInfo}
        />

        <label className='w-full flex items-center'>
          <span className='font-bold'>Deliverable :</span>
          <input
            type='text'
            name='priority'
            autoComplete='off'
            value={deliverableValue}
            onChange={changeDeliverableValue}
            className='ml-2 px-3 py-2 bg-transparent border-none focus:outline-none focus:border-none'
            placeholder='Enter Deliverable Name'
          />
        </label>
        <DeliverableTab
          selectedDeliverableTab={selectedDeliverableTab}
          selectedDeliverable={selectedDeliverable}
          onSelectDeliverableTab={onSelectDeliverableTab}
        />
        <PlusButton className='flex items-center justify-end my-4' onPlus={onCreateDeliverable} />
      </SmallLayout>
      <LoadingModal loaded={loaded} />
    </div>
  );
}

export default CreateDeliverable;
