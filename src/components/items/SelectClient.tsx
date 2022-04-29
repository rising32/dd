import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { sendGetMyClients } from '../../lib/api';
import useRequest from '../../lib/hooks/useRequest';
import { ClientState } from '../../modules/client';
import { DeliverableInfoState } from '../../modules/deliverable';
import { RootState } from '../../store';
import { OnChangeValue } from 'react-select';
import { SelectOpionState } from '../../modules/common';
import { colourStyles } from '../../lib/utils/style';
import CreatableSelect from 'react-select/creatable';
import ReactModal from 'react-modal';
import CreateAndEditClientTemplate from '../../container/template/CreateAndEditClientTemplate';

interface Props {
  selectedClient: ClientState | null;
  onSelectClient: (client: ClientState | null) => void;
  deliverableInfo?: DeliverableInfoState | null;
}
function SelectClient({ selectedClient, deliverableInfo, onSelectClient }: Props) {
  const [clientList, setClientList] = useState<ClientState[]>([]);
  const [selectOptions, setSelectOptions] = useState<SelectOpionState[]>([]);
  const [selectedOption, setSelectedOption] = useState<SelectOpionState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreate, setIsCreate] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const { userInfo } = useSelector((state: RootState) => state.user);
  const [_sendGetMyClients, , getMyClientsRes] = useRequest(sendGetMyClients);

  React.useEffect(() => {
    if (selectedClient) {
      setSelectedOption({ label: selectedClient.client_name, value: selectedClient.client_id });
    } else {
      setSelectedOption(null);
    }
  }, [selectedClient]);
  React.useEffect(() => {
    if (deliverableInfo) {
      getMyClients();
    }
  }, [deliverableInfo]);
  React.useEffect(() => {
    setIsLoading(true);
    getMyClients();
  }, []);
  const getMyClients = () => {
    const user_id = userInfo?.user_id;
    _sendGetMyClients(user_id);
  };
  React.useEffect(() => {
    if (getMyClientsRes) {
      setClientList(getMyClientsRes.clients);

      const options: SelectOpionState[] = getMyClientsRes.clients.map(client => ({
        value: client.client_id,
        label: client.client_name,
      }));
      setSelectOptions(options);
      if (deliverableInfo) {
        getMyClientsRes.clients.map(client => {
          if (client.client_id === deliverableInfo.client_id) {
            onSelectClient(client);
          }
        });
      }
      setIsLoading(false);
    }
  }, [getMyClientsRes]);

  const handleChange = (newValue: OnChangeValue<SelectOpionState, false>) => {
    if (newValue) {
      clientList.map(client => {
        if (client.client_id === newValue.value) {
          onSelectClient(client);
        }
      });
    } else {
      onSelectClient(null);
    }
  };
  const handleCreate = (value: string) => {
    console.log(value);
    setIsCreate(true);
    setInputValue(value);
  };
  const onSuccess = (client: ClientState) => {
    if (isCreate) {
      const newClientList = clientList;
      newClientList.unshift(client);
      setClientList(newClientList);

      const options: SelectOpionState[] = newClientList.map(client => ({
        value: client.client_id,
        label: client.client_name,
      }));
      setSelectOptions(options);

      onSelectClient(client);
      setIsCreate(false);
    }
  };

  return (
    <div className='flex justify-between items-center py-1, text-white'>
      <span className='font-bold flex'>Client:</span>
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
        isOpen={isCreate}
        onRequestClose={() => setIsCreate(false)}
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
        <CreateAndEditClientTemplate value={inputValue} onCancel={() => setIsCreate(false)} onSuccess={onSuccess} />
      </ReactModal>
    </div>
  );
}

export default SelectClient;
