import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { CheckSvg } from '../../assets/svg';
import { sendTaskWithProjectId } from '../../lib/api';
import useRequest from '../../lib/hooks/useRequest';
import { ClientState } from '../../modules/client';
import { ProjectState } from '../../modules/project';
import { TaskState } from '../../modules/task';
import { RootState } from '../../store';
import AnimatedView from '../common/AnimatedView';
import DownUpIcon from '../common/DownUpIcon';

interface Props {
  selectedProject: ProjectState | null;
  selectedTask: TaskState | null;
  onSelectTask: (task: TaskState | null) => void;
}
function ShowTaskList({ selectedProject, selectedTask, onSelectTask }: Props) {
  const [taskList, setTaskList] = useState<TaskState[]>([]);
  const [hasFocus, setFocus] = useState(false);
  const [taskValue, setTaskValue] = React.useState('');

  const { userInfo } = useSelector((state: RootState) => state.user);
  const [_sendTaskWithProjectId, , sendTaskWithProjectIdRes] = useRequest(sendTaskWithProjectId);
  const taskRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (selectedProject) {
      const creator_id = userInfo?.user_id;
      const project_id = selectedProject.project_id;
      _sendTaskWithProjectId(creator_id, project_id);
    } else {
      setTaskList([]);
    }
  }, [selectedProject]);

  React.useEffect(() => {
    if (sendTaskWithProjectIdRes) {
      setTaskList(sendTaskWithProjectIdRes.task);
    }
  }, [sendTaskWithProjectIdRes]);
  const onClickTask = (task: TaskState) => {
    setTaskValue(task.task_name);
    onSelectTask(task);
    setFocus(false);
  };
  const handleTaskChange = (event: React.FormEvent<HTMLInputElement>) => {
    onSelectTask(null);
    setTaskValue(event.currentTarget.value);
  };
  const filtered = !taskValue ? taskList : taskList.filter(task => task.task_name.toLowerCase().includes(taskValue.toLowerCase()));

  return (
    <>
      <div className='flex justify-between items-center py-1'>
        <span className='text-lg font-bold pr-2'>Task :</span>
        <div className='ml-4 flex flex-1 w-full relative'>
          <input
            ref={taskRef}
            type='text'
            value={taskValue}
            onChange={handleTaskChange}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            className='w-full bg-card-gray focus:outline-none truncate'
          />
        </div>
      </div>
      <AnimatedView show={hasFocus}>
        <ul role='list' className='p-6'>
          {filtered.map(task => (
            <li key={task.task_id} className='flex items-center py-2 first:pt-0 last:pb-0' onClick={() => onClickTask(task)}>
              <div className='flex flex-1 overflow-hidden'>
                <span className={`${task.project_id ? 'text-rouge-blue' : 'text-blue'}`}>{task.task_name}</span>
              </div>
              {selectedTask?.task_id === task.task_id && <CheckSvg strokeWidth={2} className='w-6 h-6 stroke-rouge-blue' />}
            </li>
          ))}
        </ul>
      </AnimatedView>
    </>
  );
}

export default ShowTaskList;
