import React, { useRef, useState } from 'react';
import ReactModal from 'react-modal';
import { useSelector } from 'react-redux';
import { CheckSvg } from '../../assets/svg';
import { sendTaskWithProjectId, sendUpdateTask } from '../../lib/api';
import useRequest from '../../lib/hooks/useRequest';
import { ProjectState } from '../../modules/project';
import { TaskState } from '../../modules/task';
import { RootState } from '../../store';
import AnimatedView from '../common/AnimatedView';

ReactModal.setAppElement('#root');
interface Props {
  selectedProject: ProjectState | null;
  selectedTask: TaskState | null;
  onSelectTask: (task: TaskState | null) => void;
}
function ShowTaskList({ selectedProject, selectedTask, onSelectTask }: Props) {
  const [taskList, setTaskList] = useState<TaskState[]>([]);
  const [hasFocus, setFocus] = useState(false);
  const [taskValue, setTaskValue] = React.useState('');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectableTask, setSelectableTask] = useState<TaskState>({} as TaskState);

  const { userInfo } = useSelector((state: RootState) => state.user);
  const [_sendTaskWithProjectId, , sendTaskWithProjectIdRes] = useRequest(sendTaskWithProjectId);
  const [_sendUpdateTask, , sendUpdateTaskRes] = useRequest(sendUpdateTask);
  const taskRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (selectedProject) {
      const creator_id = userInfo?.user_id;
      const project_id = selectedProject.project_id;
      _sendTaskWithProjectId(creator_id, project_id);
    } else {
      setTaskList([]);
      setTaskValue('');
    }
  }, [selectedProject]);

  React.useEffect(() => {
    if (sendTaskWithProjectIdRes) {
      setTaskList(sendTaskWithProjectIdRes.task);
    }
  }, [sendTaskWithProjectIdRes]);
  const onClickTask = (task: TaskState) => {
    if (task.project_id) {
      onSelect(task);
    } else {
      setSelectableTask(task);
      setShowTaskModal(true);
      setFocus(true);
    }
  };
  const onSelect = (task: TaskState) => {
    setTaskValue(task.task_name);
    onSelectTask(task);
    setFocus(false);
  };
  const handleTaskChange = (event: React.FormEvent<HTMLInputElement>) => {
    onSelectTask(null);
    setTaskValue(event.currentTarget.value);
  };
  const filtered = !taskValue ? taskList : taskList.filter(task => task.task_name.toLowerCase().includes(taskValue.toLowerCase()));

  const onCancelTaskWithProject = () => {
    setShowTaskModal(false);
  };
  const onLinkTaskWithProject = () => {
    _sendUpdateTask({ ...selectableTask, project_id: selectedProject?.project_id });
  };
  React.useEffect(() => {
    if (sendUpdateTaskRes) {
      const newTaskList = taskList.map(task => {
        if (task.task_id === sendUpdateTaskRes.task_id) {
          return sendUpdateTaskRes;
        }
        return task;
      });
      setTaskList(newTaskList);
      setShowTaskModal(false);
      setFocus(false);
      onSelect(sendUpdateTaskRes);
    }
  }, [sendUpdateTaskRes]);

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
      <ReactModal
        isOpen={showTaskModal}
        className='w-4/5 max-h-96 bg-white p-4 overflow-auto rounded-sm flex flex-col items-center justify-center'
        style={{
          overlay: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.5)',
          },
        }}
      >
        <div className='text-center'>Do you want to link this task with project</div>
        <div className='flex flex-row'>
          <div className='font-bold pr-2'>Project:</div>
          <div className='font-bold'>{selectedProject?.project_name}</div>
        </div>
        <div className='flex flex-row'>
          <div className='font-bold pr-2'>Task:</div>
          <div className='font-bold'>{selectableTask?.task_name}</div>
        </div>
        <div className='flex flex-row items-start justify-between w-full px-8 pt-4'>
          <div className='text-lg font-bold' onClick={onCancelTaskWithProject}>
            No
          </div>
          <div className='text-lg font-bold text-rouge-blue' onClick={onLinkTaskWithProject}>
            Yes
          </div>
        </div>
      </ReactModal>
    </>
  );
}

export default ShowTaskList;
