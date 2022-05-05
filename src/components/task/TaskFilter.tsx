import React, { useState } from 'react';
import SmallLayout from '../../container/common/SmallLayout';
import { ClientState } from '../../modules/client';
import { ProjectState } from '../../modules/project';
import { CPMDState, TaskAssignState, TaskState } from '../../modules/task';
import { UserInfoState } from '../../modules/user';
import ShowCalendar from '../items/ShowCalendar';
import SelectClient from '../items/SelectClient';
import SelectProject from '../items/SelectProject';
import ShowUserList from '../items/ShowTeamMemberList';
import PlusButton from '../common/PlusButton';
import SelectTask from '../items/SelectTask';
import useRequest from '../../lib/hooks/useRequest';
import { sendTasksWithCPMD, sendDeveloperToTask, sendCreateDeliverable } from '../../lib/api';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import SelectedAndCompltedIcon from '../common/SelectedAndCompltedIcon';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { DeliverableState } from '../../modules/deliverable';
import MoreButton from '../common/MoreButton';
import { useNavigate } from 'react-router-dom';
import LoadingModal from '../common/LoadingModal';

interface Props {
  selectedWeek: number;
}
function TaskFilter({ selectedWeek }: Props) {
  const [selectedClient, setSelectedClient] = useState<ClientState | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectState | null>(null);
  const [selectedTask, setSelectedTask] = useState<TaskState | null>(null);
  const [selectedMember, setSelectedMember] = useState<UserInfoState | null>(null);
  const [deliverableValue, setDeliverableValue] = useState('');
  const [selectWhen, setSelectWhen] = useState<Date | null>(null);
  const [weekTasks, setWeekTask] = useState<CPMDState[]>([]);
  const [loaded, setLoaded] = useState<string | null>(null);

  const [_sendTasksWithCPMD, , sendTasksWithCPMDRes] = useRequest(sendTasksWithCPMD);
  const [_sendDeveloperToTask, , sendDeveloperToTaskRes] = useRequest(sendDeveloperToTask);
  const [_sendCreateDeliverable, , sendCreateDeliverableRes] = useRequest(sendCreateDeliverable);
  const { userInfo } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  React.useEffect(() => {
    const params = {
      user_id: userInfo?.user_id,
      member_id: selectedMember?.user_id,
      client_id: selectedClient?.client_id,
      project_id: selectedProject?.project_id,
      planned_end_date: selectWhen || new Date(),
    };
    _sendTasksWithCPMD(params);
  }, [selectedClient, selectedProject, selectedMember, selectWhen]);
  React.useEffect(() => {
    if (sendTasksWithCPMDRes) {
      setWeekTask(sendTasksWithCPMDRes);
    }
  }, [sendTasksWithCPMDRes]);

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
  const onSelectMember = (member: UserInfoState | null) => {
    if (selectedMember?.user_id === member?.user_id) {
      setSelectedMember(null);
    } else {
      setSelectedMember(member);
    }
  };
  const changeDeliverableValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDeliverableValue(event.target.value);
  };
  const onSelectWhen = (date: Date) => {
    setSelectWhen(date);
  };
  const onPlus = () => {
    if (!selectedClient) {
      toast.error('select client');
      return;
    }
    if (!selectedProject) {
      toast.error('select project');
      return;
    }

    if (userInfo) {
      setLoaded('start');
      if (selectedTask?.task_id) {
        const newAssign: TaskAssignState = {
          assign_id: null,
          task_id: selectedTask.task_id,
          member_id: selectedMember?.user_id || userInfo.user_id,
          role_id: 3,
        };
        _sendDeveloperToTask(newAssign);
      }
    }
  };
  React.useEffect(() => {
    if (sendDeveloperToTaskRes) {
      if (deliverableValue === '') {
        setSelectedClient(null);
        setSelectedProject(null);
        setSelectedTask(null);
        setDeliverableValue('');
        setSelectedMember(null);
        setSelectWhen(null);
        toast.success('new task created successfully');
        setLoaded('end');
      } else {
        if (userInfo && selectedTask?.task_id) {
          const deliverable: DeliverableState = {
            deliverable_id: null,
            deliverable_name: deliverableValue,
            user_id: selectedMember?.user_id || userInfo.user_id,
            task_id: selectedTask?.task_id,
            periority_id: null,
            budget: 50,
            planned_end_date: format(selectWhen || new Date(), 'yyyy-MM-dd'),
            end_date: null,
            is_completed: 0,
          };
          _sendCreateDeliverable(deliverable);
        }
      }
    }
  }, [sendDeveloperToTaskRes]);
  React.useEffect(() => {
    if (sendCreateDeliverableRes) {
      setSelectedClient(null);
      setSelectedProject(null);
      setSelectedTask(null);
      setDeliverableValue('');
      setSelectedMember(null);
      setSelectWhen(null);
      toast.success('new deliverable created successfully');
      setLoaded('end');
    }
  }, [sendCreateDeliverableRes]);

  return (
    <>
      <SmallLayout className='p-4 bg-card-gray border-rouge-blue border-4 text-white'>
        <SelectClient selectedClient={selectedClient} onSelectClient={onSelectClient} />
        <SelectProject selectedClient={selectedClient} selectedProject={selectedProject} onSelectProject={onSelectProject} />
        <SelectTask selectedTask={selectedTask} selectedProject={selectedProject} onSelectTask={onSelectTask} />

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
        <ShowUserList selectedMember={selectedMember} onSelectMember={onSelectMember} />
        <ShowCalendar selectedWhen={selectWhen} onSelectWhen={onSelectWhen} />
        <PlusButton className='flex items-center justify-end mt-4' />
      </SmallLayout>
      <div className='mt-4 text-center'>{'Tasks Week ' + selectedWeek}</div>
      <SmallLayout className='p-4 bg-card-gray text-white'>
        {weekTasks.map(item => (
          <div key={item.client_id} className='flex flex-col mb-3'>
            <span className='font-bold mb-2 text-center'>{item.client_name}</span>
            {item.task.map(task => (
              <div key={task.task_id} className='flex items-center'>
                <SelectedAndCompltedIcon isSelected={false} isCompleted={false} />
                <span className='pl-2 truncate'>{task.member_name + '-' + 'W' + selectedWeek + ' : ' + task.task_name}</span>
              </div>
            ))}
          </div>
        ))}
        <MoreButton className='flex items-center justify-end mt-4' onMore={() => navigate('/tasks/taskList')} />
      </SmallLayout>
      <LoadingModal loaded={loaded} />
    </>
  );
}

export default TaskFilter;
