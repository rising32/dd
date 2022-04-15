import React, { useState } from 'react';
import ReactModal from 'react-modal';
import { useSelector } from 'react-redux';
import { CheckSvg } from '../../assets/svg';
import { sendProjectWithClientId, sendSetClient } from '../../lib/api';
import useRequest from '../../lib/hooks/useRequest';
import { ClientState } from '../../modules/client';
import { DeliverableInfoState } from '../../modules/deliverable';
import { ProjectState } from '../../modules/project';
import { RootState } from '../../store';
import AnimatedView from '../common/AnimatedView';
import DownUpIcon from '../common/DownUpIcon';

ReactModal.setAppElement('#root');
interface Props {
  selectedClient: ClientState | null;
  selectedProject: ProjectState | null;
  onSelectProject: (project: ProjectState) => void;
  deliverableInfo?: DeliverableInfoState | null;
}
function ShowProjectList({ selectedClient, selectedProject, deliverableInfo, onSelectProject }: Props) {
  const [showProject, setShowProject] = useState(false);
  const [projectList, setProjectList] = useState<ProjectState[]>([]);
  const [selectableProejct, setSelectableProject] = useState<ProjectState | null>(null);
  const [showProjectModal, setShowProjectModal] = useState(false);

  const { userInfo } = useSelector((state: RootState) => state.user);
  const [_sendProjectWithClientId, , sendProjectWithClientIdRes] = useRequest(sendProjectWithClientId);
  const [_sendSetClient, , sendSetClientRes] = useRequest(sendSetClient);

  const openProjects = () => {
    if (showProject) {
      setShowProject(false);
    } else {
      setShowProject(true);
    }
  };

  React.useEffect(() => {
    if (selectedClient) {
      const creator_id = userInfo?.user_id;
      const client_id = selectedClient.client_id;
      _sendProjectWithClientId(creator_id, client_id);
    } else {
      setProjectList([]);
      setShowProject(false);
    }
  }, [selectedClient]);

  React.useEffect(() => {
    if (sendProjectWithClientIdRes) {
      setProjectList(sendProjectWithClientIdRes.project);

      if (deliverableInfo) {
        sendProjectWithClientIdRes.project.map(project => {
          if (project.project_id === deliverableInfo.project_id) {
            onClickProject(project);
          }
        });
      }
    }
  }, [sendProjectWithClientIdRes]);
  const onClickProject = (project: ProjectState) => {
    if (project.client_id) {
      onSelect(project);
    } else {
      setSelectableProject(project);
      setShowProjectModal(true);
    }
  };
  const onSelect = (project: ProjectState) => {
    onSelectProject(project);
    setShowProject(false);
  };
  const onCancelProjectWithClient = () => {
    setShowProjectModal(false);
  };
  const onLinkProjectWithClient = () => {
    const client_id = selectedClient?.client_id;
    const project_id = selectableProejct?.project_id;
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
      setShowProjectModal(false);
      setShowProject(false);
      onSelectProject(newProject);
    }
  }, [sendSetClientRes]);

  return (
    <>
      <div className='flex justify-between items-center py-1'>
        <span className='text-white text-lg font-bold pr-2'>Project :</span>
        <div className='border-dotted border-b-4 border-white flex-1 self-end' />
        <div className='text-rouge-blue text-lg font-bold px-2'>{selectedProject?.project_name}</div>
        <div className='w-6 h-6 flex items-center justify-center' onClick={openProjects}>
          <DownUpIcon isShow={showProject} />
        </div>
      </div>
      <AnimatedView show={showProject}>
        <ul role='list' className='p-6'>
          {projectList.map(project => (
            <li key={project.project_id} className='flex items-center py-2 first:pt-0 last:pb-0' onClick={() => onClickProject(project)}>
              <div className='flex flex-1 overflow-hidden'>
                <span className={`${project.client_id ? 'text-rouge-blue' : 'text-blue'}`}>{project.project_name}</span>
              </div>
              {selectedProject?.project_id === project.project_id && <CheckSvg strokeWidth={2} className='w-6 h-6 stroke-rouge-blue' />}
            </li>
          ))}
        </ul>
      </AnimatedView>
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
          <div className='font-bold'>{selectableProejct?.project_name}</div>
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
    </>
  );
}

export default ShowProjectList;
