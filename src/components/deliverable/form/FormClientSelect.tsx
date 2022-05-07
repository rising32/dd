import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { sendGetMyClients } from '../../../lib/api';
import useRequest from '../../../lib/hooks/useRequest';
import { ClientState } from '../../../modules/client';
import { DeliverableInfoState } from '../../../modules/deliverable';
import { RootState } from '../../../store';
import CreatableSelect from 'react-select/creatable';
import { OnChangeValue, StylesConfig } from 'react-select';
import ReactModal from 'react-modal';
import CreateAndEditClientTemplate from '../../../container/template/CreateAndEditClientTemplate';
import { ControllerRenderProps } from 'react-hook-form';
import { IDeliverableFormInput } from '../../deliverable/DeliverablePanel';

const clientStyles: StylesConfig<ClientState> = {
  container: styles => ({ ...styles, width: '100%' }),
  control: styles => ({ ...styles, backgroundColor: 'transparent', width: '100%', border: 'none', boxShadow: 'none' }),
  option: (styles, { isDisabled, isSelected }) => {
    return {
      ...styles,
      backgroundColor: isSelected ? '#DD0000' : undefined,
      color: isSelected ? 'white' : 'black',
      cursor: isDisabled ? 'not-allowed' : 'default',
    };
  },
  input: styles => ({ ...styles, color: 'white' }),
  menuList: styles => ({ ...styles, padding: 0, margin: 0, borderRadius: '4px' }),
  placeholder: styles => ({ ...styles, color: 'white' }),
  singleValue: styles => ({ ...styles, color: '#DD0000', textAlign: 'end' }),
};

interface Props {
  deliverableInfo?: DeliverableInfoState | null;
  field: ControllerRenderProps<IDeliverableFormInput, 'client'>;
}
function FormClientSelect({ deliverableInfo, field }: Props) {
  const [clientList, setClientList] = useState<ClientState[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreate, setIsCreate] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const { userInfo } = useSelector((state: RootState) => state.user);
  const [_sendGetMyClients, , getMyClientsRes] = useRequest(sendGetMyClients);

  React.useEffect(() => {
    if (deliverableInfo) {
      setIsLoading(true);
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
      if (deliverableInfo) {
        getMyClientsRes.clients.map(client => {
          if (client.client_id === deliverableInfo.client_id) {
            field.onChange(client);
          }
        });
      }
      setIsLoading(false);
    }
  }, [getMyClientsRes]);
  const handleChange = (newValue: OnChangeValue<ClientState, false>) => {
    field.onChange(newValue);
  };
  const handleCreate = (value: string) => {
    console.log(value);
    setIsCreate(true);
    setIsLoading(true);
    setInputValue(value);
  };

  const onSuccess = (client: ClientState) => {
    if (isCreate) {
      const newClientList = clientList;
      newClientList.unshift(client);
      setClientList(newClientList);

      field.onChange(client);
      setIsCreate(false);
      setIsLoading(false);
    }
  };

  const onCancel = () => {
    setIsCreate(false);
    setIsLoading(false);
  };

  return (
    <div className='flex justify-between items-center py-1, text-white'>
      <span className='font-bold flex'>Client:</span>
      <CreatableSelect<ClientState>
        isClearable
        name={field.name}
        ref={field.ref}
        isLoading={isLoading}
        options={clientList}
        placeholder=''
        value={field.value}
        getOptionValue={option => option.client_id.toString()}
        getOptionLabel={option => option.client_name}
        styles={clientStyles}
        onChange={handleChange}
        getNewOptionData={(inputValue, optionLabel) => ({
          client_id: 0,
          client_name: `Create new client "${inputValue}"`,
          is_active: 1,
          client_address: null,
          client_detail: null,
          __isNew__: true,
        })}
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
        <CreateAndEditClientTemplate value={inputValue} onCancel={onCancel} onSuccess={onSuccess} />
      </ReactModal>
    </div>
  );
}

export default FormClientSelect;
