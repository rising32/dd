import { addDays, format } from 'date-fns';
import React, { useRef, useState } from 'react';
import ReactModal from 'react-modal';
import { useSelector } from 'react-redux';
import { sendTaskWithProjectId, sendUpdateTask } from '../../lib/api';
import useRequest from '../../lib/hooks/useRequest';
import { ProjectState } from '../../modules/project';
import { TaskState } from '../../modules/task';
import { RootState } from '../../store';
import { OnChangeValue } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { SelectOpionState } from '../../modules/common';
import { colourStyles } from '../../lib/utils/style';
import { DeliverableInfoState } from '../../modules/deliverable';
import { toast } from 'react-toastify';
import CreateAndEidtTaskTempleate from '../../container/template/CreateAndEidtTaskTempleate';

ReactModal.setAppElement('#root');
interface Props {
  selectedProject: ProjectState | null;
  selectedTask: TaskState | null;
  onSelectTask: (task: TaskState | null) => void;
  deliverableInfo?: DeliverableInfoState | null;
}
function SelectTask({ selectedProject, selectedTask, onSelectTask, deliverableInfo }: Props) {
  const [taskList, setTaskList] = useState<TaskState[]>([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectableTask, setSelectableTask] = useState<TaskState | null>(null);
  const [selectOptions, setSelectOptions] = useState<SelectOpionState[]>([]);
  const [selectedOption, setSelectedOption] = useState<SelectOpionState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreate, setIsCreate] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const { userInfo } = useSelector((state: RootState) => state.user);
  const [_sendTaskWithProjectId, , sendTaskWithProjectIdRes] = useRequest(sendTaskWithProjectId);
  const [_sendUpdateTask, , sendUpdateTaskRes] = useRequest(sendUpdateTask);
  const taskRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (selectedTask) {
      setSelectedOption({ label: selectedTask.task_name, value: selectedTask.task_id });
    } else {
      setSelectedOption(null);
    }
  }, [selectedTask]);
  React.useEffect(() => {
    if (selectedProject) {
      setIsLoading(true);
      const creator_id = userInfo?.user_id;
      const project_id = selectedProject.project_id;
      _sendTaskWithProjectId(creator_id, project_id);
    } else {
      setTaskList([]);
      setSelectOptions([]);
      setSelectedOption(null);
      setIsLoading(false);
    }
  }, [selectedProject]);

  React.useEffect(() => {
    if (sendTaskWithProjectIdRes) {
      setTaskList(sendTaskWithProjectIdRes.task);

      const options: SelectOpionState[] = sendTaskWithProjectIdRes.task.map(task => ({
        value: task.task_id,
        label: task.task_name,
        isLinked: task.project_id,
      }));

      if (deliverableInfo) {
        sendTaskWithProjectIdRes.task.map(task => {
          if (task.task_id === deliverableInfo.task_id) {
            onSelectTask(task);
          }
        });
      }
      setSelectOptions(options);

      setIsLoading(false);
    }
  }, [sendTaskWithProjectIdRes]);

  const onCancelTaskWithProject = () => {
    setShowTaskModal(false);
    setIsLoading(false);
  };
  const onLinkTaskWithProject = () => {
    if (selectedProject && selectableTask) {
      _sendUpdateTask({
        ...selectableTask,
        project_id: selectedProject.project_id,
        planned_start_date:
          selectableTask && selectableTask.planned_start_date !== null
            ? format(new Date(selectableTask.planned_start_date), 'yyyy-MM-dd')
            : null,
        planned_end_date:
          selectableTask && selectableTask.planned_end_date !== null
            ? format(new Date(selectableTask.planned_end_date), 'yyyy-MM-dd')
            : null,
        actual_start_date:
          selectableTask && selectableTask.actual_start_date !== null
            ? format(new Date(selectableTask.actual_start_date), 'yyyy-MM-dd')
            : null,
        actual_end_date:
          selectableTask && selectableTask.actual_end_date !== null ? format(new Date(selectableTask.actual_end_date), 'yyyy-MM-dd') : null,
      });
    }
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

      const options: SelectOpionState[] = newTaskList.map(task => ({
        value: task.task_id,
        label: task.task_name,
        isLinked: task.project_id,
      }));
      setSelectOptions(options);

      setShowTaskModal(false);
      setIsLoading(false);
      onSelectTask(sendUpdateTaskRes);
    }
  }, [sendUpdateTaskRes]);

  const handleChange = (newValue: OnChangeValue<SelectOpionState, false>) => {
    if (newValue) {
      if (newValue.isLinked) {
        taskList.map(task => {
          if (task.task_id === newValue?.value) {
            onSelectTask(task);
          }
        });
      } else {
        setIsLoading(true);
        taskList.map(task => {
          if (task.task_id === newValue?.value) {
            setSelectableTask(task);
          }
        });
        setShowTaskModal(true);
      }
    } else {
      onSelectTask(null);
    }
  };
  const handleCreate = (value: string) => {
    if (selectedProject) {
      setIsCreate(true);
      setInputValue(value);
    } else {
      toast.error('Select Client first');
    }
  };
  const onSuccess = (newTask: TaskState) => {
    if (isCreate) {
      const newTaskList = taskList;
      newTaskList.unshift(newTask);
      setTaskList(newTaskList);

      const options = selectOptions;
      options.unshift({
        value: newTask.task_id,
        label: newTask.task_name,
      });
      setSelectOptions(options);

      setIsCreate(false);

      setIsLoading(true);
      taskList.map(task => {
        if (task.task_id === newTask.task_id) {
          setSelectableTask(task);
        }
      });
      setShowTaskModal(true);
    }
  };

  return (
    <div className='flex justify-between items-center py-1, text-white'>
      <span className='font-bold pr-2'>Task :</span>
      <CreatableSelect<SelectOpionState>
        isClearable
        isLoading={isLoading}
        options={selectOptions}
        placeholder=''
        value={selectedOption}
        styles={colourStyles}
        onChange={handleChange}
        onCreateOption={handleCreate}
      />
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
      <ReactModal
        isOpen={isCreate}
        onRequestClose={() => setIsCreate(false)}
        className='w-4/5 max-h-screen bg-white p-4 overflow-auto rounded-sm flex flex-col items-center justify-center'
        style={{
          overlay: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.5)',
          },
        }}
      >
        <CreateAndEidtTaskTempleate value={inputValue} onCancel={() => setIsCreate(false)} onSuccess={onSuccess} />
      </ReactModal>
    </div>
  );
}

export default SelectTask;
