import React, { useState } from 'react';
import { PlusSvg } from '../../assets/svg';
import SmallLayout from '../../container/common/SmallLayout';
import { ClientState } from '../../modules/client';
import { ProjectState } from '../../modules/project';
import { TaskState } from '../../modules/task';
import { UserInfoState } from '../../modules/user';
import ShowCalendar from '../client/ShowCalendar';
import ShowClientList from '../client/ShowClientList';
import ShowProjectList from '../client/ShowProjectList';
import ShowTaskList from '../client/ShowTaskList';
import ShowUserList from '../client/ShowTeamMemberList';
import PlusButton from '../common/PlusButton';

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
    setSelectedTask(task);
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
    <SmallLayout className='mx-4 p-4 border-rouge-blue border-4 text-white'>
      <ShowClientList selectedClient={selectedClient} onSelectClient={onSelectClient} />
      <ShowProjectList selectedClient={selectedClient} selectedProject={selectedProject} onSelectProject={onSelectProject} />
      <ShowTaskList selectedTask={selectedTask} selectedProject={selectedProject} onSelectTask={onSelectTask} />
      <div className='flex flex-row items-center text-xl font-bold text-white'>
        <div>Deliverable :</div>
        <div className='ml-4 flex flex-1 w-full'>
          <input
            type='text'
            name='textValue'
            className='w-full bg-card-gray focus:outline-none truncate'
            value={deliverableValue}
            onChange={changeDeliverableValue}
          />
        </div>
      </div>
      <ShowUserList selectedMember={selectedMember} onSelectMember={onSelectMember} />
      <ShowCalendar selectedWhen={selectWhen} onSelectWhen={onSelectWhen} />
      <PlusButton className='flex items-center justify-end mt-4' onPlus={onCreateTaskAndDeliverable} />
    </SmallLayout>
  );
}

export default TaskFilter;
