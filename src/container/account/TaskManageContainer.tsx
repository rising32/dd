import React from 'react';
import HeaderWithTitle from '../../components/base/HeaderWithTitle';
import TasksView from '../../components/task/TasksView';
import MainResponsive from '../MainResponsive';

function TaskManageContainer() {
  return (
    <MainResponsive>
      <HeaderWithTitle title='Manage Tasks' />
      <TasksView />
    </MainResponsive>
  );
}

export default TaskManageContainer;
