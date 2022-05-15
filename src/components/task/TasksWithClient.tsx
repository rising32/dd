import React, { useEffect, useState } from 'react';
import SmallLayout from '../../container/common/SmallLayout';
import SelectedAndCompltedIcon from '../common/SelectedAndCompltedIcon';
import MoreButton from '../common/MoreButton';
import { CPMDState } from '../../modules/task';
import { useNavigate } from 'react-router-dom';
import useRequest from '../../lib/hooks/useRequest';
import { sendTasksWithCPMD } from '../../lib/api';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../store';
import { removeLoading, showLoading } from '../../store/features/coreSlice';
import { ITasksControlFormInput } from './TasksControl';
import { Control, useWatch } from 'react-hook-form';
import { getShortName } from '../../lib/utils';

interface Props {
  selectedWeek: number;
  control: Control<ITasksControlFormInput>;
}
function TasksWithClient({ selectedWeek, control }: Props) {
  const [taskList, setTaskList] = useState<CPMDState[]>([]);
  const { userInfo } = useSelector((state: RootState) => state.user);
  const { admin_info } = useSelector((state: RootState) => state.companyInfo);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [_sendTasksWithCPMD, , sendTasksWithCPMDRes] = useRequest(sendTasksWithCPMD);

  const client = useWatch({
    control,
    name: 'client',
  });
  const project = useWatch({
    control,
    name: 'project',
  });
  const member = useWatch({
    control,
    name: 'member',
  });
  const when = useWatch({
    control,
    name: 'when',
  });

  useEffect(() => {
    if (admin_info?.user_id) {
      dispatch(showLoading());
      const params = {
        user_id: admin_info?.user_id,
        member_id: member?.user_id || null,
        client_id: client?.client_id || null,
        project_id: project?.project_id || null,
        planned_end_date: when || null,
      };
      _sendTasksWithCPMD(params);
    }
  }, [admin_info, client, project, member, when]);
  useEffect(() => {
    if (sendTasksWithCPMDRes) {
      setTaskList(sendTasksWithCPMDRes);
      dispatch(removeLoading());
    }
  }, [sendTasksWithCPMDRes]);
  return (
    <>
      <div className='mt-4 text-center'>{'Tasks Week ' + selectedWeek}</div>
      <SmallLayout className='p-4 bg-card-gray text-white'>
        {taskList.map(item => (
          <div key={item.client_id} className='flex flex-col mb-3'>
            <span className='font-bold mb-2 text-center'>{item.client_name}</span>
            {item.task.map(task => (
              <div key={task.task_id} className='flex items-center'>
                <SelectedAndCompltedIcon isSelected={false} isCompleted={false} />
                <span className='pl-2 truncate'>{getShortName(task.member_name) + '-' + 'W' + selectedWeek + ' : ' + task.task_name}</span>
              </div>
            ))}
          </div>
        ))}
        <MoreButton className='flex items-center justify-end mt-4' />
      </SmallLayout>
    </>
  );
}

export default TasksWithClient;
