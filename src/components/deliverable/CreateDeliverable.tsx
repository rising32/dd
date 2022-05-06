import React, { useState } from 'react';
import SmallLayout from '../../container/common/SmallLayout';
import { ClientState } from '../../modules/client';
import { ProjectState } from '../../modules/project';
import { TaskState } from '../../modules/task';
import PlusButton from '../common/PlusButton';
import DeliverableTab from './DeliverableTab';
import useRequest from '../../lib/hooks/useRequest';
import { sendCreateDeliverable, sendDeliverableInfo, sendUpdateDeliverable } from '../../lib/api';
import { DeliverableInfoState, DeliverableState } from '../../modules/deliverable';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { format } from 'date-fns';
import { PriorityState } from '../../modules/weekPriority';
import LoadingModal from '../common/LoadingModal';
import { Controller, useForm, SubmitHandler } from 'react-hook-form';
import FormClientSelect from './form/FormClientSelect';
import FormProjectSelect from './form/FormProjectSelect';
import FormTaskSelect from './form/FormTaskSelect';

export interface IDeliverableFormInput {
  client: ClientState | null;
  project: ProjectState | null;
  task: TaskState | null;
  deliverable: string;
}
interface Props {
  selectedDate: Date;
  addDeliverable: (deliverable: DeliverableState) => void;
  updateDeliverable: (deliverable: DeliverableState) => void;
  selectedPriority?: PriorityState | null;
  selectedDeliverable: DeliverableState | null;
}
function CreateDeliverable({ selectedDate, selectedDeliverable, selectedPriority, addDeliverable, updateDeliverable }: Props) {
  const [selectedDeliverableTab, setSelectedDeliverableTab] = useState<string>('');
  const [deliverableInfo, setDeliverableInfo] = useState<DeliverableInfoState | null>(null);
  const [disabled, setDisabled] = useState(false);
  const [loaded, setLoaded] = useState<string | null>(null);
  const { handleSubmit, control, reset, setValue, register } = useForm<IDeliverableFormInput>({
    defaultValues: {
      client: null,
      project: null,
      task: null,
      deliverable: '',
    },
  });

  const [_sendCreateDeliverable, , sendCreateDeliverableRes] = useRequest(sendCreateDeliverable);
  const [_sendDeliverableInfo, , sendDeliverableInfoRes] = useRequest(sendDeliverableInfo);
  const [_sendUpdateDeliverable, , sendUpdateDeliverableRes] = useRequest(sendUpdateDeliverable);
  const { userInfo } = useSelector((state: RootState) => state.user);

  React.useEffect(() => {
    if (selectedDeliverable) {
      setLoaded('start');
      const deliverable_id = selectedDeliverable.deliverable_id;
      _sendDeliverableInfo(deliverable_id);
      setSelectedDeliverableTab('Details');
    } else {
      reset();
      setDeliverableInfo(null);
      setSelectedDeliverableTab('');
    }
  }, [selectedDeliverable]);
  React.useEffect(() => {
    // if (selectedPriority) {
    //   setDeliverableValue(selectedPriority.priority);
    //   setDisabled(true);
    // } else {
    //   setDeliverableValue('');
    //   setDisabled(false);
    // }
  }, [selectedPriority]);
  React.useEffect(() => {
    if (sendDeliverableInfoRes) {
      setDeliverableInfo(sendDeliverableInfoRes.data);
      setValue('deliverable', sendDeliverableInfoRes.data.deliverable_name);
      setLoaded('end');
    }
  }, [sendDeliverableInfoRes]);

  React.useEffect(() => {
    if (sendCreateDeliverableRes) {
      addDeliverable(sendCreateDeliverableRes);
      reset();
      setLoaded('end');
    }
  }, [sendCreateDeliverableRes]);
  React.useEffect(() => {
    if (sendUpdateDeliverableRes) {
      reset();
      updateDeliverable(sendUpdateDeliverableRes);
      setLoaded('end');
    }
  }, [sendUpdateDeliverableRes]);
  const onSelectDeliverableTab = (tab: string) => {
    setSelectedDeliverableTab(preSelectedProject => (preSelectedProject === tab ? '' : tab));
  };
  const onSubmit: SubmitHandler<IDeliverableFormInput> = data => {
    if (userInfo && data.task) {
      setLoaded('start');
      if (deliverableInfo && deliverableInfo.task_id === data.task.task_id) {
        _sendUpdateDeliverable({
          ...deliverableInfo,
          task_id: data.task.task_id,
          planned_end_date: format(selectedDate, 'yyyy-MM-dd'),
          deliverable_name: data.deliverable,
        });
      }
      if (!deliverableInfo) {
        const deliverable: DeliverableState = {
          deliverable_id: null,
          deliverable_name: data.deliverable,
          user_id: userInfo.user_id,
          task_id: data.task.task_id,
          periority_id: selectedPriority && selectedPriority.wp_id ? selectedPriority.wp_id : null,
          budget: 50,
          planned_end_date: format(selectedDate, 'yyyy-MM-dd'),
          end_date: null,
          is_completed: 0,
        };
        _sendCreateDeliverable(deliverable);
      }
    }
  };

  return (
    <div className='text-white mt-4'>
      <div className='flex justify-center'>
        <span className='text-base'>At least 2 deliverable per day</span>
      </div>
      <SmallLayout className='p-4 bg-card-gray border-rouge-blue border-4 text-white relative'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            control={control}
            name='client'
            rules={{ required: true }}
            render={({ field }) => <FormClientSelect deliverableInfo={deliverableInfo} field={field} />}
          />
          <Controller
            control={control}
            name='project'
            rules={{ required: true }}
            render={({ field }) => <FormProjectSelect control={control} deliverableInfo={deliverableInfo} field={field} />}
          />
          <Controller
            control={control}
            name='task'
            rules={{ required: true }}
            render={({ field }) => <FormTaskSelect control={control} deliverableInfo={deliverableInfo} field={field} />}
          />
          <label className='w-full flex items-center'>
            <span className='font-bold'>Deliverable:</span>
            <input
              type='text'
              autoComplete='off'
              className='ml-2 py-2 bg-transparent focus:outline-none focus:border-none flex border-none w-full'
              placeholder='Enter Deliverable Name'
              {...register('deliverable', { required: true })}
            />
          </label>

          <DeliverableTab
            selectedDeliverableTab={selectedDeliverableTab}
            selectedDeliverable={selectedDeliverable}
            onSelectDeliverableTab={onSelectDeliverableTab}
          />
          <PlusButton className='flex items-center justify-end my-4' />
        </form>
      </SmallLayout>
      <LoadingModal loaded={loaded} />
    </div>
  );
}

export default CreateDeliverable;
