import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import useRequest from '../../lib/hooks/useRequest';
import { RootState } from '../../store';
import HeaderWithTitle from '../base/HeaderWithTitle';
import { sendTasksWithCPMD, sendGetMyClients } from '../../lib/api';
import { CPMDState } from '../../modules/task';
import { ClientState } from '../../modules/client';
import TaskListOfClient from './TaskListOfClient';

function TaskListView() {
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
    <>
      <HeaderWithTitle title='All Tasks' />
      {clientList.map(client => (
        <TaskListOfClient key={client.client_id} client={client} />
      ))}
    </>
  );
}

export default TaskListView;
