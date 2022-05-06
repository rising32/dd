import React from 'react';
import MainResponsive from '../../container/MainResponsive';
import TasksContainer from '../../container/tasks/TasksContainer';

function MainTasks() {
  return (
    <MainResponsive>
      <TasksContainer />
    </MainResponsive>
  );
}

export default MainTasks;
