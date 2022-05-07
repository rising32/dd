import React from 'react';
import HeaderWithTitle from '../../components/base/HeaderWithTitle';
import ProjectsView from '../../components/project/ProjectsView';
import MainResponsive from '../MainResponsive';

function ProjectManageContainer() {
  return (
    <MainResponsive>
      <HeaderWithTitle title='Manage Projects' />
      <ProjectsView />
    </MainResponsive>
  );
}

export default ProjectManageContainer;
