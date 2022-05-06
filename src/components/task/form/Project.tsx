import React, { useState } from 'react';
import ReactModal from 'react-modal';
import { useSelector } from 'react-redux';
import { sendProjectWithClientId, sendSetClient } from '../../../lib/api';
import useRequest from '../../../lib/hooks/useRequest';
import { DeliverableInfoState } from '../../../modules/deliverable';
import { ProjectState } from '../../../modules/project';
import { RootState } from '../../../store';
import { OnChangeValue, StylesConfig } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import CreateAndEditProjectTemplate from '../../../container/template/CreateAndEditProjectTemplate';
import { Control, ControllerRenderProps, useWatch } from 'react-hook-form';
import { ITaskFilterFormInput } from '../TaskFilter';

const projectStyles: StylesConfig<ProjectState> = {
  container: styles => ({ ...styles, width: '100%' }),
  control: styles => ({ ...styles, backgroundColor: 'transparent', width: '100%', border: 'none', boxShadow: 'none' }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      backgroundColor: isSelected ? '#DD0000' : undefined,
      color: data.client_id === null ? 'blue' : isSelected ? 'white' : 'black',
      cursor: isDisabled ? 'not-allowed' : 'default',
    };
  },
  input: styles => ({ ...styles, color: 'white' }),
  menuList: styles => ({ ...styles, padding: 0, margin: 0, borderRadius: '4px' }),
  placeholder: styles => ({ ...styles, color: 'white' }),
  singleValue: (styles, { data }) => ({ ...styles, color: '#DD0000', textAlign: 'end' }),
};
interface Props {
  control: Control<ITaskFilterFormInput>;
  deliverableInfo?: DeliverableInfoState | null;
  field: ControllerRenderProps<ITaskFilterFormInput, 'project'>;
}
function Project({ control, deliverableInfo, field }: Props) {
  const [projectList, setProjectList] = useState<ProjectState[]>([]);
  const [selectableProject, setSelectableProject] = useState<ProjectState | null>(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreate, setIsCreate] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const client = useWatch({
    control,
    name: 'client',
  });

  const { userInfo } = useSelector((state: RootState) => state.user);
  const [_sendProjectWithClientId, , sendProjectWithClientIdRes] = useRequest(sendProjectWithClientId);
  const [_sendSetClient, , sendSetClientRes] = useRequest(sendSetClient);

  React.useEffect(() => {
    if (client) {
      setIsLoading(true);
      const creator_id = userInfo?.user_id;
      const client_id = client.client_id;
      _sendProjectWithClientId(creator_id, client_id);
    } else {
      setProjectList([]);
      setIsLoading(false);
      field.onChange(null);
    }
  }, [client]);

  React.useEffect(() => {
    if (sendProjectWithClientIdRes) {
      setProjectList(sendProjectWithClientIdRes.project);

      if (deliverableInfo) {
        sendProjectWithClientIdRes.project.map(project => {
          if (project.project_id === deliverableInfo.project_id) {
            field.onChange(project);
          }
        });
      }
      setIsLoading(false);
    }
  }, [sendProjectWithClientIdRes]);
  const onCancelProjectWithClient = () => {
    setShowProjectModal(false);
    setIsLoading(false);
  };
  const onLinkProjectWithClient = () => {
    if (client && selectableProject) {
      const client_id = client.client_id;
      const project_id = selectableProject.project_id;
      _sendSetClient(client_id, project_id);
    }
  };
  React.useEffect(() => {
    if (sendSetClientRes) {
      let newProject: ProjectState = {} as ProjectState;
      const newProjectList = projectList.map(project => {
        if (project.project_id === sendSetClientRes.project_id) {
          project.client_id = sendSetClientRes.client_id;
          newProject = project;
        }
        return project;
      });
      setProjectList(newProjectList);
      setShowProjectModal(false);
      setIsLoading(false);
      field.onChange(newProject);
    }
  }, [sendSetClientRes]);
  const handleChange = (newValue: OnChangeValue<ProjectState, false>) => {
    if (newValue) {
      if (newValue.client_id) {
        field.onChange(newValue);
      } else {
        setIsLoading(true);
        setSelectableProject(newValue);
        setShowProjectModal(true);
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
  const onSuccess = (newProject: ProjectState) => {
    if (isCreate) {
      const newProjectList = projectList;
      newProjectList.unshift(newProject);
      setProjectList(newProjectList);

      setIsCreate(false);

      setIsLoading(true);
      newProjectList.map(project => {
        if (project.project_id === newProject.project_id) {
          setSelectableProject(project);
        }
      });
      setShowProjectModal(true);
    }
  };
  const onCancel = () => {
    setIsCreate(false);
    setIsLoading(false);
  };

  return (
    <div className='flex justify-between items-center py-1, text-white'>
      <span className='font-bold'>Projects:</span>
      <CreatableSelect<ProjectState>
        isClearable
        name={field.name}
        ref={field.ref}
        isLoading={isLoading}
        options={projectList}
        placeholder=''
        value={field.value}
        getOptionValue={option => option.project_id.toString()}
        getOptionLabel={option => option.project_name}
        styles={projectStyles}
        onChange={handleChange}
        getNewOptionData={(inputValue, optionLabel) => ({
          project_id: 0,
          creator_id: 0,
          project_name: `Create new project "${inputValue}"`,
          planned_start_date: null,
          planned_end_date: null,
          actual_start_date: null,
          actual_end_date: null,
          description: null,
          __isNew__: true,
        })}
        onCreateOption={handleCreate}
      />
      <ReactModal
        isOpen={showProjectModal}
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
        <div className='text-center'>Do you want to link this project with client</div>
        <div className='flex flex-row'>
          <div className='font-bold pr-2'>Client:</div>
          <div className='font-bold'>{client?.client_name}</div>
        </div>
        <div className='flex flex-row'>
          <div className='font-bold pr-2'>Project:</div>
          <div className='font-bold'>{selectableProject?.project_name}</div>
        </div>
        <div className='flex flex-row items-start justify-between w-full px-8 pt-4'>
          <div className='text-lg font-bold' onClick={onCancelProjectWithClient}>
            No
          </div>
          <div className='text-lg font-bold text-rouge-blue' onClick={onLinkProjectWithClient}>
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
        <CreateAndEditProjectTemplate value={inputValue} onCancel={onCancel} onSuccess={onSuccess} />
      </ReactModal>
    </div>
  );
}

export default Project;
