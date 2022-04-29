import React from 'react';
import TaskListView from '../../components/task/TaskListView';
import MainResponsive from '../../container/MainResponsive';

function TaskListPage() {
  return (
    <MainResponsive>
      <TaskListView />
    </MainResponsive>
  );
}

export default TaskListPage;
