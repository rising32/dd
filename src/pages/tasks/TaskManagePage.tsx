import React from 'react';
import TasksView from '../../components/task/TasksView';
import MainResponsive from '../../container/MainResponsive';

function TaskManagePage() {
  return (
    <MainResponsive>
      <TasksView />
    </MainResponsive>
  );
}

export default TaskManagePage;
