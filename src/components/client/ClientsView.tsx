import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import SmallLayout from '../../container/common/SmallLayout';
import useRequest from '../../lib/hooks/useRequest';
import { sendCreateClient, sendGetMyClients, sendRegisterMyClient, sendUpdateClient } from '../../lib/api';
import { ClientState } from '../../modules/client';
import { RootState } from '../../store';
import HeaderWithTitle from '../base/HeaderWithTitle';
import ReactModal from 'react-modal';

function ClientsView() {
  const [myClientList, setMyClientList] = useState<ClientState[]>([]);
  const [selectedClient, setSelectedClient] = useState<ClientState | null>(null);
  const [selectableClient, setSelectableClient] = useState<ClientState | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [clientName, setClientName] = useState('');

  const { userInfo } = useSelector((state: RootState) => state.user);
  const [_sendGetMyClients, , getMyClientsRes] = useRequest(sendGetMyClients);
  const [_sendCreateClient, , createClientRes] = useRequest(sendCreateClient);
  const [_sendRegisterMyClient, , sendRegisterMyClientRes] = useRequest(sendRegisterMyClient);
  const [_sendUpdateClient, , sendUpdateClientRes] = useRequest(sendUpdateClient);

  React.useEffect(() => {
    const user_id = userInfo?.user_id;
    _sendGetMyClients(user_id);
  }, []);
  React.useEffect(() => {
    if (getMyClientsRes) {
      setMyClientList(getMyClientsRes.clients);
    }
  }, [getMyClientsRes]);
  const onSelectClient = (client: ClientState) => {
    if (selectedClient?.client_id === client.client_id) {
      setSelectedClient(null);
    } else {
      onOpenAndCloseModal();
      setSelectedClient(client);
    }
  };
  const onOpenAndCloseModal = () => {
    if (showModal) {
      setShowModal(false);
    } else {
      if (selectedClient) {
        setSelectedClient(null);
        setClientName('');
      }
      setShowModal(true);
    }

    setIsConfirmed(false);
  };
  const onChangeClientName = (event: React.FormEvent<HTMLInputElement>) => {
    setClientName(event.currentTarget.value);
  };
  const onOk = () => {
    if (isConfirmed) {
      if (selectedClient) {
        _sendUpdateClient({ ...selectedClient, client_name: clientName });
      } else {
        const client_name = clientName;
        const is_active = true;
        _sendCreateClient(client_name, is_active);
      }
    } else {
      if (selectedClient) {
        setClientName(selectedClient.client_name);
      }
      setIsConfirmed(true);
    }
  };
  React.useEffect(() => {
    if (createClientRes) {
      const user_id = userInfo?.user_id;
      const client_id = createClientRes.client_id;
      const is_active = createClientRes.is_active;
      _sendRegisterMyClient(user_id, client_id, is_active);
      setSelectableClient(createClientRes);
    }
  }, [createClientRes]);
  React.useEffect(() => {
    if (sendRegisterMyClientRes && selectableClient) {
      setMyClientList([...myClientList, selectableClient]);
      setSelectedClient(selectableClient);
      onOpenAndCloseModal();
    }
  }, [sendRegisterMyClientRes]);
  React.useEffect(() => {
    if (sendUpdateClientRes && selectedClient) {
      const newMyClientList = myClientList.map(item => {
        if (item.client_id === selectedClient.client_id) {
          return selectedClient;
        } else {
          return item;
        }
      });
      setMyClientList(newMyClientList);
      onOpenAndCloseModal();
    }
  }, [sendUpdateClientRes]);

  return (
    <>
      <HeaderWithTitle title='Manage Clients' />
      <SmallLayout className='flex flex-1 flex-col bg-white py-4 mt-4 text-black'>
        <div className='flex flex-row px-4 items-center justify-between pb-2'>
          <div className='text-lg text-black font-bold'>Clients</div>
          <div className='text-base text-blue' onClick={onOpenAndCloseModal}>
            Create
          </div>
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
      <ReactModal
        isOpen={showModal}
        onRequestClose={onOpenAndCloseModal}
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
        <div className='text-center font-bold'>
          {selectedClient ? 'Do you want to edit selected Client' : 'Do you want to create a New Client'}
        </div>
        {isConfirmed && (
          <>
            <label className='block w-full mt-4'>
              <span className="after:content-['*'] after:ml-0.5 after:text-rouge-blue block text-sm font-medium">NAME</span>
              <input
                type='text'
                name='name'
                value={clientName}
                onChange={onChangeClientName}
                className='mt-1 px-3 py-2 bg-white border shadow-sm border-dark-gray placeholder-card-gray focus:outline-none focus:border-rouge-blue block w-full rounded-md sm:text-sm focus:ring-1'
                placeholder='Enter Name'
              />
            </label>
          </>
        )}
        <div className='flex flex-row items-start justify-between w-full px-8 pt-4'>
          <div className='text-lg font-bold' onClick={onOpenAndCloseModal}>
            No
          </div>
          <div className='text-lg font-bold text-rouge-blue' onClick={onOk}>
            Yes
          </div>
        </div>
      </ReactModal>
    </>
  );
}

export default ClientsView;
