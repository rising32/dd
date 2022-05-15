import { format } from 'date-fns';
import React, { useState } from 'react';
import ReactModal from 'react-modal';
import { useSelector } from 'react-redux';
import { sendTaskWithProjectId, sendUpdateTask, getMyTasks } from '../../../lib/api';
import useRequest from '../../../lib/hooks/useRequest';
import { TaskState } from '../../../modules/task';
import { RootState } from '../../../store';
import { OnChangeValue, StylesConfig } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { DeliverableInfoState } from '../../../modules/deliverable';
import CreateAndEidtTaskTempleate from '../../task/CreateAndEidtTaskTempleate';
import { Control, ControllerRenderProps, useWatch } from 'react-hook-form';
import { IDeliverableFormInput } from '../../deliverable/DeliverablePanel';

const projectStyles: StylesConfig<TaskState> = {
  container: styles => ({ ...styles, width: '100%' }),
  control: styles => ({ ...styles, backgroundColor: 'transparent', width: '100%', border: 'none', boxShadow: 'none' }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      backgroundColor: isSelected ? '#DD0000' : undefined,
      color: data.project_id === null ? 'blue' : isSelected ? 'white' : 'black',
      cursor: isDisabled ? 'not-allowed' : 'default',
    };
  },
  input: styles => ({ ...styles, color: 'white' }),
  menuList: styles => ({ ...styles, padding: 0, margin: 0, borderRadius: '4px' }),
  placeholder: styles => ({ ...styles, color: 'white' }),
  singleValue: (styles, { data }) => ({ ...styles, color: '#DD0000', textAlign: 'end' }),
};
interface Props {
  control: Control<IDeliverableFormInput>;
  deliverableInfo?: DeliverableInfoState | null;
  field: ControllerRenderProps<IDeliverableFormInput, 'task'>;
}
function FormTaskSelect({ control, deliverableInfo, field }: Props) {
  const [taskList, setTaskList] = useState<TaskState[]>([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectableTask, setSelectableTask] = useState<TaskState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreate, setIsCreate] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const project = useWatch<IDeliverableFormInput, 'project'>({
    control,
    name: 'project',
  });

  const { userInfo } = useSelector((state: RootState) => state.user);
  const { admin_info } = useSelector((state: RootState) => state.companyInfo);
  const [_getMyTasks, , getMyTasksRes] = useRequest(getMyTasks);
  const [_sendTaskWithProjectId, , sendTaskWithProjectIdRes] = useRequest(sendTaskWithProjectId);
  const [_sendUpdateTask, , sendUpdateTaskRes] = useRequest(sendUpdateTask);

  React.useEffect(() => {
    if (project) {
      setIsLoading(true);

      if (userInfo?.role_id === 3) {
        const creator_id = userInfo.user_id;
        _getMyTasks(creator_id);
      }
      if (userInfo?.role_id === 1 || userInfo?.role_id === 2) {
        const creator_id = userInfo?.user_id;
        const project_id = project.project_id;
        _sendTaskWithProjectId(creator_id, project_id);
      }
    } else {
      setTaskList([]);
      setIsLoading(false);
      field.onChange(null);
    }
  }, [project, userInfo]);

  React.useEffect(() => {
    if (getMyTasksRes) {
      setTaskList(getMyTasksRes.task);

      if (deliverableInfo) {
        getMyTasksRes.task.map(task => {
          if (task.task_id === deliverableInfo.task_id) {
            field.onChange(task);
          }
        });
      }

      setIsLoading(false);
    }
  }, [getMyTasksRes]);

  React.useEffect(() => {
    if (sendTaskWithProjectIdRes) {
      setTaskList(sendTaskWithProjectIdRes.task);

      if (deliverableInfo) {
        sendTaskWithProjectIdRes.task.map(task => {
          if (task.task_id === deliverableInfo.task_id) {
            field.onChange(task);
          }
        });
      }

      setIsLoading(false);
    }
  }, [sendTaskWithProjectIdRes]);

  const onCancelTaskWithProject = () => {
    setShowTaskModal(false);
    setIsLoading(false);
  };
  const onLinkTaskWithProject = () => {
    if (project && selectableTask) {
      _sendUpdateTask({
        ...selectableTask,
        project_id: project.project_id,
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

      setShowTaskModal(false);
      setIsLoading(false);
      field.onChange(sendUpdateTaskRes);
    }
  }, [sendUpdateTaskRes]);
  const handleChange = (newValue: OnChangeValue<TaskState, false>) => {
    if (newValue) {
      if (newValue.project_id) {
        field.onChange(newValue);
      } else {
        setIsLoading(true);
        setSelectableTask(newValue);
        setShowTaskModal(true);
      }
    } else {
      field.onChange(newValue);
    }
  };

  const handleCreate = (value: string) => {
    setIsCreate(true);
    setIsLoading(true);
    setInputValue(value);
  };
  const onSuccess = (newTask: TaskState) => {
    if (isCreate) {
      const newTaskList = taskList;
      newTaskList.unshift(newTask);
      setTaskList(newTaskList);

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
  const onCancel = () => {
    setIsCreate(false);
    setIsLoading(false);
  };

  return (
    <div className='flex justify-between items-center py-1, text-white'>
      <span className='font-bold'>Task:</span>
      <CreatableSelect<TaskState>
        isClearable
        name={field.name}
        ref={field.ref}
        isLoading={isLoading}
        options={taskList}
        placeholder=''
        value={field.value}
        getOptionValue={option => option.task_id.toString()}
        getOptionLabel={option => option.task_name}
        styles={projectStyles}
        onChange={handleChange}
        getNewOptionData={(inputValue, optionLabel) => ({
          task_id: 0,
          task_name: `Create new project "${inputValue}"`,
          creator_id: 0,
          description: null,
          planned_start_date: null,
          planned_end_date: null,
          actual_start_date: null,
          actual_end_date: null,
          hourly_rate: 0,
          is_add_all: false,
          is_active: true,
          is_deleted: 0,
          __isNew__: true,
        })}
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
          <div className='font-bold'>{project?.project_name}</div>
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
        <CreateAndEidtTaskTempleate value={inputValue} onCancel={onCancel} onSuccess={onSuccess} />
      </ReactModal>
    </div>
  );
}

export default FormTaskSelect;
