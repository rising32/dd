import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import SmallLayout from '../../container/common/SmallLayout';
import useRequest from '../../lib/hooks/useRequest';
import { RootState } from '../../store';
import HeaderWithTitle from '../base/HeaderWithTitle';
import { getUserTasks } from '../../lib/api';
import { toast } from 'react-toastify';
import { TaskState } from '../../modules/task';
import TaskSetting from './TaskSetting';

function TasksView() {
  const [myTaskList, setMyTaskList] = useState<TaskState[]>([]);
  const [selectedTask, setSelectedTask] = useState<TaskState | null>(null);
  const [showModal, setShowModal] = useState(false);

  const { userInfo } = useSelector((state: RootState) => state.user);
  const [_getUserTasks, , getUserTasksRes] = useRequest(getUserTasks);

  React.useEffect(() => {
    const creator_id = userInfo?.user_id;
    _getUserTasks(creator_id);
  }, []);
  React.useEffect(() => {
    if (getUserTasksRes) {
      setMyTaskList(getUserTasksRes.task);
    }
  }, [getUserTasksRes]);
  const onCreateTask = () => {
    setSelectedTask(null);
    setShowModal(!showModal);
  };
  const onSelectTask = (task: TaskState) => {
    if (selectedTask?.task_id === task.task_id) {
      setSelectedTask(null);
    } else {
      setShowModal(false);
      setSelectedTask(task);
    }
  };
  const onSuccess = (task: TaskState) => {
    if (selectedTask) {
      const newMyTaskList = myTaskList.map(item => {
        if (item.task_id === task.task_id) {
          return task;
        } else {
          return item;
        }
      });
      toast.success('task updated successfully!');
      setMyTaskList(newMyTaskList);
      onSelectTask(task);
    } else {
      const newMyTaskList = myTaskList;
      newMyTaskList.unshift(task);
      toast.success('task created successfully!');
      setMyTaskList(newMyTaskList);
      onCreateTask();
    }
  };

  return (
    <>
      <HeaderWithTitle title='Manage Tasks' />
      <SmallLayout className='flex flex-1 flex-col bg-white py-4 mt-4 text-black'>
        <div className='flex flex-row px-4 items-center justify-between pb-2'>
          <div className='text-lg text-black font-bold'>Tasks</div>
          <div className='text-base text-blue' onClick={() => setShowModal(true)}>
            Create
          </div>
        </div>
        {showModal && <TaskSetting selectedTask={selectedTask} onCancel={onCreateTask} onSuccess={onSuccess} />}
        <ul role='list' className='p-4 divide-y divide-light-gray'>
          {myTaskList.map(task => (
            <li key={task.task_id} className='py-1 first:pt-0 last:pb-0'>
              <div className='flex bg-dark-gray rounded-md p-2 items-center' onClick={() => onSelectTask(task)}>
                <div className={`flex flex-1 text-lg capitalize truncate ${task.task_id === selectedTask?.task_id && 'text-rouge-blue'}`}>
                  {task.task_name}
                </div>
                <div
                  className={`w-4 h-4 rounded-full ${
                    task.is_active ? 'bg-rouge-blue outline outline-2 outline-rouge-blue' : 'bg-ligth-gray outline outline-2'
                  }`}
                />
              </div>
              {selectedTask && selectedTask.task_id === task.task_id && (
                <TaskSetting selectedTask={selectedTask} onCancel={() => onSelectTask(task)} onSuccess={onSuccess} />
              )}
            </li>
          ))}
        </ul>
      </SmallLayout>
    </>
  );
}

export default TasksView;
