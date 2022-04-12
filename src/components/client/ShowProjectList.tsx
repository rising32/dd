import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { CheckSvg } from '../../assets/svg';
import { sendProjectWithClientId } from '../../lib/api';
import useRequest from '../../lib/hooks/useRequest';
import { ClientState } from '../../modules/client';
import { ProjectState } from '../../modules/project';
import { RootState } from '../../store';
import AnimatedView from '../common/AnimatedView';
import DownUpIcon from '../common/DownUpIcon';

interface Props {
  selectedClient: ClientState | null;
  selectedProject: ProjectState | null;
  onSelectProject: (project: ProjectState) => void;
}
function ShowProjectList({ selectedClient, selectedProject, onSelectProject }: Props) {
  const [showProject, setShowProject] = useState(false);
  const [projectList, setProjectList] = useState<ProjectState[]>([]);

  const { userInfo } = useSelector((state: RootState) => state.user);
  const [_sendProjectWithClientId, , sendProjectWithClientIdRes] = useRequest(sendProjectWithClientId);

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
    }
  }, [sendProjectWithClientIdRes]);
  const onClickProject = (project: ProjectState) => {
    onSelectProject(project);
    setShowProject(false);
  };

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
    </>
  );
}

export default ShowProjectList;
