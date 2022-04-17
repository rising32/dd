import React, { useState } from 'react';
import SmallLayout from '../../container/common/SmallLayout';
import { ClientState } from '../../modules/client';
import { ProjectState } from '../../modules/project';
import { CPMDState, TaskAssignState, TaskState } from '../../modules/task';
import { UserInfoState } from '../../modules/user';
import ShowCalendar from '../items/ShowCalendar';
import ShowClientList from '../items/ShowClientList';
import ShowProjectList from '../items/ShowProjectList';
import ShowUserList from '../items/ShowTeamMemberList';
import PlusButton from '../common/PlusButton';
import ShowCreateAndSelectTaskList from '../items/ShowCreateAndSelectTaskList';
import useRequest from '../../lib/hooks/useRequest';
import { sendTasksWithCPMD, sendCreateTask, sendDeveloperToTask, sendCreateDeliverable } from '../../lib/api';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import SelectedAndCompltedIcon from '../common/SelectedAndCompltedIcon';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { DeliverableState } from '../../modules/deliverable';

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
  const [taskValue, setTaskValue] = React.useState('');

  const [_sendTasksWithCPMD, , sendTasksWithCPMDRes] = useRequest(sendTasksWithCPMD);
  const [_sendCreateTask, , createTaskRes] = useRequest(sendCreateTask);
  const [_sendDeveloperToTask, , sendDeveloperToTaskRes] = useRequest(sendDeveloperToTask);
  const [_sendCreateDeliverable, , sendCreateDeliverableRes] = useRequest(sendCreateDeliverable);
  const { userInfo } = useSelector((state: RootState) => state.user);

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
      console.log(sendTasksWithCPMDRes);
      setWeekTask(sendTasksWithCPMDRes);
    }
  }, [sendTasksWithCPMDRes]);

  const onSelectClient = (client: ClientState | null) => {
    setSelectedClient(client);
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
  const onSelectMember = (member: UserInfoState) => {
    if (selectedMember?.user_id === member.user_id) {
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
  const sendTaskValue = (value: string) => {
    setTaskValue(value);
  };
  const onCreateTaskAndDeliverable = () => {
    if (!selectedClient) {
      toast.error('select client');
      return;
    }
    if (!selectedProject) {
      toast.error('select project');
      return;
    }

    if (userInfo) {
      if (selectedTask?.task_id) {
        const newAssign: TaskAssignState = {
          assign_id: null,
          task_id: selectedTask.task_id,
          member_id: selectedMember?.user_id || userInfo.user_id,
          role_id: 3,
        };
        _sendDeveloperToTask(newAssign);
      } else {
        const newTask: TaskState = {
          task_id: null,
          creator_id: userInfo?.user_id,
          project_id: selectedProject.project_id,
          task_name: taskValue,
          description: null,
          planned_start_date: null,
          planned_end_date: format(new Date(), 'yyyy-MM-dd'),
          actual_start_date: null,
          actual_end_date: null,
          hourly_rate: 50,
          is_add_all: false,
          is_active: true,
          is_deleted: 0,
        };
        _sendCreateTask(newTask);
      }
    }
  };
  React.useEffect(() => {
    if (createTaskRes && createTaskRes.task.task_id) {
      setSelectedTask(createTaskRes.task);
      if (userInfo) {
        const newAssign: TaskAssignState = {
          assign_id: null,
          task_id: createTaskRes.task.task_id,
          member_id: selectedMember?.user_id || userInfo.user_id,
          role_id: 3,
        };
        _sendDeveloperToTask(newAssign);
      }
    }
  }, [createTaskRes]);
  React.useEffect(() => {
    if (sendDeveloperToTaskRes) {
      if (deliverableValue === '') {
        setSelectedClient(null);
        setSelectedProject(null);
        setSelectedTask(null);
        setTaskValue('');
        setDeliverableValue('');
        setSelectedMember(null);
        setSelectWhen(null);
        toast.success('new task created successfully');
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
      setTaskValue('');
      setDeliverableValue('');
      setSelectedMember(null);
      setSelectWhen(null);
      toast.success('new deliverable created successfully');
    }
  }, [sendCreateDeliverableRes]);

  return (
    <>
      <SmallLayout className='p-4 bg-card-gray border-rouge-blue border-4 text-white'>
        <ShowClientList selectedClient={selectedClient} onSelectClient={onSelectClient} />
        <ShowProjectList selectedClient={selectedClient} selectedProject={selectedProject} onSelectProject={onSelectProject} />
        <ShowCreateAndSelectTaskList
          selectedTask={selectedTask}
          selectedProject={selectedProject}
          onSelectTask={onSelectTask}
          sendTaskValue={sendTaskValue}
        />

        <label className='block mt-4 w-full'>
          <span className='block font-bold'>Deliverable</span>
          <input
            type='text'
            name='priority'
            value={deliverableValue}
            onChange={changeDeliverableValue}
            className='mt-1 px-3 py-2 bg-transparent border shadow-sm border-dark-gray focus:outline-none focus:border-rouge-blue block w-full rounded-md sm:text-sm focus:ring-1'
            placeholder='Enter Deliverable Name'
          />
        </label>
        <ShowUserList selectedMember={selectedMember} onSelectMember={onSelectMember} />
        <ShowCalendar selectedWhen={selectWhen} onSelectWhen={onSelectWhen} />
        <PlusButton className='flex items-center justify-end mt-4' onPlus={onCreateTaskAndDeliverable} />
      </SmallLayout>
      <div className='mt-4 text-center'>{'Tasks Week ' + selectedWeek}</div>
      <SmallLayout className='p-4 bg-card-gray text-white'>
        {weekTasks.map(item => (
          <div key={item.client_id} className='flex flex-col mb-3'>
            <span className='font-bold mb-2 text-center'>{item.client_name}</span>
            {item.task.map(task => (
              <div key={task.task_id} className='flex items-center'>
                <SelectedAndCompltedIcon isSelected={false} isCompleted={false} />
                <span className='pl-2 truncate'>{'JEF' + '-' + 'W' + selectedWeek + ': ' + task.task_name}</span>
              </div>
            ))}
          </div>
        ))}
      </SmallLayout>
    </>
  );
}

export default TaskFilter;
