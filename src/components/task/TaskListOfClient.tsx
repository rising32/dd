import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import SmallLayout from '../../container/common/SmallLayout';
import useRequest from '../../lib/hooks/useRequest';
import { RootState } from '../../store';
import { sendTasksWithCPMD, sendGetMyClients } from '../../lib/api';
import { CPMDState } from '../../modules/task';
import SelectedAndCompltedIcon from '../common/SelectedAndCompltedIcon';
import { ClientState } from '../../modules/client';

interface Props {
  client: ClientState;
}
function TaskListOfClient({ client }: Props) {
  const [weekTasks, setWeekTask] = useState<CPMDState[]>([]);
  const [clientList, setClientList] = useState<ClientState[]>([]);

  const { userInfo } = useSelector((state: RootState) => state.user);
  const [_sendTasksWithCPMD, , sendTasksWithCPMDRes] = useRequest(sendTasksWithCPMD);
  const [_sendGetMyClients, , getMyClientsRes] = useRequest(sendGetMyClients);

  React.useEffect(() => {
    const user_id = userInfo?.user_id;
    _sendGetMyClients(user_id);
    const params = {
      user_id: userInfo?.user_id,
    };
    _sendTasksWithCPMD(params);
  }, []);
  React.useEffect(() => {
    if (sendTasksWithCPMDRes) {
      setWeekTask(sendTasksWithCPMDRes);
    }
  }, [sendTasksWithCPMDRes]);
  React.useEffect(() => {
    if (getMyClientsRes) {
      setClientList(getMyClientsRes.clients);
    }
  }, [getMyClientsRes]);
  return (
    <SmallLayout className='p-4 mt-4 bg-white text-black'>
      <div className='font-bold mb-2 text-center'>{client.client_name}</div>
      {weekTasks.map(item => (
        <div key={item.client_id} className='flex flex-col mb-3'>
          {item.task.map(task => (
            <div key={task.task_id} className='flex items-center'>
              <SelectedAndCompltedIcon isSelected={false} isCompleted={false} />
              <span className='pl-2 truncate'>{task.task_name}</span>
            </div>
          ))}
        </div>
      ))}
    </SmallLayout>
  );
}

export default TaskListOfClient;
