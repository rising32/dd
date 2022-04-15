import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import SmallLayout from '../../container/common/SmallLayout';
import useRequest from '../../lib/hooks/useRequest';
import { RootState } from '../../store';
import HeaderWithTitle from '../base/HeaderWithTitle';
import { ProjectState } from '../../modules/project';
import ReactModal from 'react-modal';
import SelectedAndCompltedIcon from '../common/SelectedAndCompltedIcon';
import { sendProjectOfCreater, sendCreateProject } from '../../lib/api';
import { toast } from 'react-toastify';
import ProjectSetting from './ProjectSetting';

function ProjectsView() {
  const [myProjectList, setMyProjectList] = useState<ProjectState[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectState | null>(null);
  const [showModal, setShowModal] = useState(false);

  const { userInfo } = useSelector((state: RootState) => state.user);
  const [_sendProjectOfCreater, , sendProjectOfCreaterRes] = useRequest(sendProjectOfCreater);
  const [_sendCreateProject, , sendCreateProjectRes] = useRequest(sendCreateProject);

  React.useEffect(() => {
    const creator_id = userInfo?.user_id;
    _sendProjectOfCreater(creator_id);
  }, []);
  React.useEffect(() => {
    if (sendProjectOfCreaterRes) {
      setMyProjectList(sendProjectOfCreaterRes.project);
    }
  }, [sendProjectOfCreaterRes]);
  const onSelectProject = (project: ProjectState) => {
    if (selectedProject?.project_id === project.project_id) {
      setSelectedProject(null);
    } else {
      setSelectedProject(project);
    }
  };
  const onCreateProject = () => {
    if (userInfo) {
      const newProject: ProjectState = {
        project_id: null,
        creator_id: userInfo.user_id,
        project_name: 'New Project',
        description: null,
        planned_start_date: null,
        planned_end_date: null,
        actual_start_date: null,
        actual_end_date: null,
      };
      _sendCreateProject(newProject);
    }
  };
  React.useEffect(() => {
    if (sendCreateProjectRes) {
      const newMyProjectList = myProjectList;
      newMyProjectList.unshift(sendCreateProjectRes);
      setShowModal(false);
      toast.success('project created successfully!');
      setMyProjectList(newMyProjectList);
      onSelectProject(sendCreateProjectRes);
    }
  }, [sendCreateProjectRes]);
  const onUpdateSuccess = (project: ProjectState) => {
    const newMyProjectList = myProjectList.map(item => {
      if (item.project_id === project.project_id) {
        return project;
      } else {
        return item;
      }
    });
    setMyProjectList(newMyProjectList);
    setSelectedProject(null);
  };

  return (
    <>
      <HeaderWithTitle title='Manage Projects' />
      <SmallLayout className='flex flex-1 flex-col bg-white py-4 mt-4 text-black'>
        <div className='flex flex-row px-4 items-center justify-between pb-2'>
          <div className='text-lg text-black font-bold'>Projects</div>
          <div className='text-base text-blue' onClick={() => setShowModal(true)}>
            Create
          </div>
        </div>
        <ul role='list' className='p-4'>
          {myProjectList.map(project => (
            <li key={project.project_id} className='py-1 first:pt-0 last:pb-0'>
              <div className='flex' onClick={() => onSelectProject(project)}>
                <SelectedAndCompltedIcon isSelected={project.project_id === selectedProject?.project_id} />
                <div
                  className={`ml-2 overflow-hidden ${project.project_id === selectedProject?.project_id && 'text-rouge-blue rounded-full'}`}
                >
                  {project.project_name}
                </div>
              </div>
              {selectedProject && selectedProject.project_id === project.project_id && (
                <ProjectSetting selectedProject={selectedProject} onCancel={() => onSelectProject(project)} onSuccess={onUpdateSuccess} />
              )}
            </li>
          ))}
        </ul>
      </SmallLayout>
      <ReactModal
        isOpen={showModal}
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
        <div className='text-center'>Do you want to create new Project?</div>
        <div className='flex flex-row items-start justify-between w-full px-8 pt-4'>
          <div className='text-lg font-bold' onClick={() => setShowModal(false)}>
            No
          </div>
          <div className='text-lg font-bold text-rouge-blue' onClick={onCreateProject}>
            Yes
          </div>
        </div>
      </ReactModal>
    </>
  );
}

export default ProjectsView;
