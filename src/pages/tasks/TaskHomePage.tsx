import React from 'react';
import Task from '../../components/task/Task';
import MainResponsive from '../../container/MainResponsive';

function TaskHomePage() {
  return (
    <MainResponsive>
      <Task />
    </MainResponsive>
  );
}

export default TaskHomePage;
