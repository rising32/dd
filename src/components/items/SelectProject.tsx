import React, { useState } from 'react';
import ReactModal from 'react-modal';
import { useSelector } from 'react-redux';
import { sendProjectWithClientId, sendSetClient } from '../../lib/api';
import useRequest from '../../lib/hooks/useRequest';
import { ClientState } from '../../modules/client';
import { DeliverableInfoState } from '../../modules/deliverable';
import { ProjectState } from '../../modules/project';
import { RootState } from '../../store';
import { SingleValue } from 'react-select';
import { SelectOpionState } from '../../modules/common';
import { colourStyles } from '../../lib/utils/style';
import CreatableSelect from 'react-select/creatable';
import CreateAndEditProjectTemplate from '../../container/template/CreateAndEditProjectTemplate';
import { toast } from 'react-toastify';
interface Props {
  selectedClient: ClientState | null;
  selectedProject: ProjectState | null;
  onSelectProject: (project: ProjectState | null) => void;
  deliverableInfo?: DeliverableInfoState | null;
}
function SelectProject({ selectedClient, selectedProject, deliverableInfo, onSelectProject }: Props) {
  const [projectList, setProjectList] = useState<ProjectState[]>([]);
  const [selectableProject, setSelectableProject] = useState<ProjectState | null>(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [selectOptions, setSelectOptions] = useState<SelectOpionState[]>([]);
  const [selectedOption, setSelectedOption] = useState<SelectOpionState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreate, setIsCreate] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const { userInfo } = useSelector((state: RootState) => state.user);
  const [_sendProjectWithClientId, , sendProjectWithClientIdRes] = useRequest(sendProjectWithClientId);
  const [_sendSetClient, , sendSetClientRes] = useRequest(sendSetClient);

  React.useEffect(() => {
    if (selectedProject) {
      setSelectedOption({ label: selectedProject.project_name, value: selectedProject.project_id });
    } else {
      setSelectedOption(null);
    }
  }, [selectedProject]);
  React.useEffect(() => {
    if (selectedClient) {
      setIsLoading(true);
      const creator_id = userInfo?.user_id;
      const client_id = selectedClient.client_id;
      _sendProjectWithClientId(creator_id, client_id);
    } else {
      setProjectList([]);
      setIsLoading(false);
      setSelectOptions([]);
    }
  }, [selectedClient]);

  React.useEffect(() => {
    if (sendProjectWithClientIdRes) {
      setProjectList(sendProjectWithClientIdRes.project);

      const options: SelectOpionState[] = sendProjectWithClientIdRes.project.map(project => ({
        value: project.project_id,
        label: project.project_name,
        isLinked: project.client_id,
      }));
      setSelectOptions(options);

      if (deliverableInfo) {
        sendProjectWithClientIdRes.project.map(project => {
          if (project.project_id === deliverableInfo.project_id) {
            onSelectProject(project);
          }
        });
      }
      setIsLoading(false);
    }
  }, [sendProjectWithClientIdRes]);
  const onCancelProjectWithClient = () => {
    setShowProjectModal(false);
  };
  const onLinkProjectWithClient = () => {
    const client_id = selectedClient?.client_id;
    const project_id = selectableProject?.project_id;
    _sendSetClient(client_id, project_id);
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

      const options: SelectOpionState[] = newProjectList.map(project => ({
        value: project.project_id,
        label: project.project_name,
        isLinked: project.client_id,
      }));
      setSelectOptions(options);

      setShowProjectModal(false);
      setIsLoading(false);
      onSelectProject(newProject);
    }
  }, [sendSetClientRes]);
  const handleChange = (option: SingleValue<SelectOpionState>) => {
    if (option) {
      if (option.isLinked) {
        projectList.map(project => {
          if (project.project_id === option?.value) {
            onSelectProject(project);
          }
        });
      } else {
        setIsLoading(true);
        projectList.map(project => {
          if (project.project_id === option?.value) {
            setSelectableProject(project);
          }
        });
        setShowProjectModal(true);
      }
    } else {
      onSelectProject(null);
    }
  };
  const handleCreate = (value: string) => {
    if (selectedClient) {
      setIsCreate(true);
      setInputValue(value);
    } else {
      toast.error('Select Client first');
    }
  };
  const onSuccess = (newProject: ProjectState) => {
    if (isCreate) {
      const newProjectList = projectList;
      newProjectList.unshift(newProject);
      setProjectList(newProjectList);

      const options = selectOptions;
      options.unshift({
        value: newProject.project_id,
        label: newProject.project_name,
      });
      setSelectOptions(options);

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

  return (
    <div className='flex justify-between items-center py-1, text-white'>
      <span className='font-bold'>Projects:</span>
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
          <div className='font-bold'>{selectedClient?.client_name}</div>
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
        <CreateAndEditProjectTemplate value={inputValue} onCancel={() => setIsCreate(false)} onSuccess={onSuccess} />
      </ReactModal>
    </div>
  );
}

export default SelectProject;
