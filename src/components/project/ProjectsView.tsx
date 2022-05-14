import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import SmallLayout from '../../container/common/SmallLayout';
import useRequest from '../../lib/hooks/useRequest';
import { RootState, useAppDispatch } from '../../store';
import { ProjectState } from '../../modules/project';
import SelectedAndCompltedIcon from '../common/SelectedAndCompltedIcon';
import { sendMyProject, sendProjectOfCreater } from '../../lib/api';
import { PenSvg } from '../../assets/svg';
import { removeLoading, showLoading } from '../../store/features/coreSlice';
import ModalView from '../base/ModalView';
import CreateAndEditProjectTemplate from './CreateAndEditProjectTemplate';
import { toast } from 'react-toastify';

function ProjectsView() {
  const [myProjectList, setMyProjectList] = useState<ProjectState[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectState | null>(null);
  const [showModal, setShowModal] = useState(false);

  const { userInfo } = useSelector((state: RootState) => state.user);
  const [_sendMyProject, , sendMyProjectRes] = useRequest(sendMyProject);

  const dispatch = useAppDispatch();

  React.useEffect(() => {
    if (userInfo?.user_id) {
      dispatch(showLoading());
      const user_id = userInfo.user_id;
      _sendMyProject(user_id);
    }
  }, [userInfo]);
  React.useEffect(() => {
    if (sendMyProjectRes) {
      setMyProjectList(sendMyProjectRes.project);
      dispatch(removeLoading());
    }
  }, [sendMyProjectRes]);
  const onSelectProject = (project: ProjectState) => {
    if (selectedProject?.project_id === project.project_id) {
      setSelectedProject(null);
    } else {
      setSelectedProject(project);
      setShowModal(true);
    }
  };
  const onSuccess = (project: ProjectState) => {
    if (selectedProject) {
      const newList = myProjectList.map(item => {
        if (item.project_id === project.project_id) {
          return project;
        } else {
          return item;
        }
      });
      setMyProjectList(newList);
      setSelectedProject(null);
      onClose();
    } else {
      const newList = myProjectList;
      newList.unshift(project);
      setMyProjectList(newList);
      setSelectedProject(null);
      onClose();
    }
    dispatch(removeLoading());
  };

  const onClose = () => {
    setShowModal(false);
    setSelectedProject(null);
  };
  const onCreateProject = () => {
    if (userInfo?.role_id === 3) {
      toast.error('Administrator and Manager only can create client!');
      return;
    }
    setShowModal(true);
    setSelectedProject(null);
  };

  return (
    <>
      <SmallLayout className='flex flex-1 flex-col bg-white py-4 mt-4 text-black'>
        <div className='flex flex-row px-4 items-center justify-between pb-2'>
          <div className='text-lg text-black font-bold'>Projects</div>
          <div className='text-base text-blue' onClick={onCreateProject}>
            Create
          </div>
        </div>
        <ul role='list' className='p-4'>
          {myProjectList.map(project => (
            <li key={project.project_id} className='py-1 first:pt-0 last:pb-0'>
              <div className='flex'>
                <SelectedAndCompltedIcon isSelected={project.project_id === selectedProject?.project_id} />
                <div
                  className={`ml-2 flex-1 overflow-hidden ${
                    project.project_id === selectedProject?.project_id && 'text-rouge-blue rounded-full'
                  }`}
                >
                  {project.project_name}
                </div>
                <PenSvg
                  className={`w-6 h-6 ${project.project_id === selectedProject?.project_id && 'stroke-rouge-blue'}`}
                  onClick={() => onSelectProject(project)}
                />
              </div>
            </li>
          ))}
        </ul>
      </SmallLayout>
      <ModalView isOpen={showModal} onClose={onClose}>
        <CreateAndEditProjectTemplate selectedProject={selectedProject} onCancel={onClose} onSuccess={onSuccess} />
      </ModalView>
    </>
  );
}

export default ProjectsView;
