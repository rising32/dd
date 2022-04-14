import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import SmallLayout from '../../container/common/SmallLayout';
import useRequest from '../../lib/hooks/useRequest';
import { sendGetMyClients } from '../../lib/api';
import { ClientState } from '../../modules/client';
import { RootState } from '../../store';
import HeaderWithTitle from '../base/HeaderWithTitle';

function ClientsView() {
  const [myClientList, setMyClientList] = useState<ClientState[]>([]);
  const [selectedClient, setSelectedClient] = useState<ClientState | null>(null);
  const [showClientCreateView, setShowClientCreateView] = useState(false);

  const { userInfo } = useSelector((state: RootState) => state.user);
  const [_sendGetMyClients, , getMyClientsRes] = useRequest(sendGetMyClients);

  React.useEffect(() => {
    const user_id = userInfo?.user_id;
    _sendGetMyClients(user_id);
  }, [getMyClientsRes]);
  React.useEffect(() => {
    if (getMyClientsRes) {
      setMyClientList(getMyClientsRes.clients);
    }
  }, [getMyClientsRes]);
  const onSelectClient = (client: ClientState) => {
    if (selectedClient?.client_id === client.client_id) {
      setSelectedClient(null);
    } else {
      setShowClientCreateView(false);
      setSelectedClient(client);
    }
  };

  return (
    <>
      <HeaderWithTitle title='Manage Clients' />
      <SmallLayout className='bg-white py-4 mt-4 text-black'>
        <div className='flex flex-row px-4 items-center justify-between pb-2'>
          <div className='text-lg text-black font-bold'>Clients</div>
          <div className='text-base text-blue'>Create</div>
        </div>
        <ul role='list' className='p-4'>
          {myClientList.map(client => (
            <li
              key={client.client_id}
              className='flex rounded-md pb-2 items-center first:pt-0 last:pb-0'
              onClick={() => onSelectClient(client)}
            >
              <div
                className={`flex flex-1 text-lg uppercase truncate ${client.client_id === selectedClient?.client_id && 'text-rouge-blue'}`}
              >
                {client.client_name}
              </div>
              <div
                className={`w-4 h-4 rounded-full ${
                  client.is_active ? 'bg-rouge-blue outline outline-2 outline-rouge-blue' : 'bg-ligth-gray outline outline-2'
                }`}
              />
            </li>
          ))}
        </ul>
      </SmallLayout>
    </>
  );
}

export default ClientsView;
