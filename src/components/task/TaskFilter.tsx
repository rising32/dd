import React, { useState } from 'react';
import SmallLayout from '../../container/common/SmallLayout';
import { ClientState } from '../../modules/client';
import { ProjectState } from '../../modules/project';
import { TaskState } from '../../modules/task';
import { UserInfoState } from '../../modules/user';
import ShowCalendar from '../items/ShowCalendar';
import ShowClientList from '../items/ShowClientList';
import ShowProjectList from '../items/ShowProjectList';
import ShowUserList from '../items/ShowTeamMemberList';
import PlusButton from '../common/PlusButton';
import ShowCreateAndSelectTaskList from '../items/ShowCreateAndSelectTaskList';

function TaskFilter() {
  const [selectedClient, setSelectedClient] = useState<ClientState | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectState | null>(null);
  const [selectedTask, setSelectedTask] = useState<TaskState | null>(null);
  const [selectedMember, setSelectedMember] = useState<UserInfoState | null>(null);
  const [deliverableValue, setDeliverableValue] = useState('');
  const [selectWhen, setSelectWhen] = useState<Date | null>(null);

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
  const onCreateTaskAndDeliverable = () => {
    // setSelectWhen(date);
  };

  return (
    <SmallLayout className='mx-4 p-4 bg-card-gray border-rouge-blue border-4 text-white'>
      <ShowClientList selectedClient={selectedClient} onSelectClient={onSelectClient} />
      <ShowProjectList selectedClient={selectedClient} selectedProject={selectedProject} onSelectProject={onSelectProject} />
      <ShowCreateAndSelectTaskList selectedTask={selectedTask} selectedProject={selectedProject} onSelectTask={onSelectTask} />

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
  );
}

export default TaskFilter;
