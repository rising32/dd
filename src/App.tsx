import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import LogInPage from './pages/auth/LogInPage';
import AuthenticatedRoute from './AuthenticatedRoute';
import MainLayout from './container/MainLayout';
import TasksPage from './pages/tasks/TasksPage';
import PrioritiesPage from './pages/priorities/PrioritiesPage';
import DeliverablesPage from './pages/deliverables/DeliverablesPage';
import StatisticsPage from './pages/statistics/StatisticsPage';
import AccountPage from './pages/account/AccountPage';
import UserProfilePage from './pages/account/UserProfilePage';
import Core from './container/base/Core';
import WorkSetting from './pages/account/WorkSetting';
import ClientsPage from './pages/client/ClientsPage';
import ProjectsPage from './pages/project/ProjectsPage';

function App() {
  return (
    <>
      <Routes>
        <Route index element={<LogInPage />} />
        <Route path='login' element={<LogInPage />} />
        <Route element={<MainLayout />}>
          <Route
            path='tasks'
            element={
              <AuthenticatedRoute>
                <TasksPage />
              </AuthenticatedRoute>
            }
          />
          <Route
            path='priorities'
            element={
              <AuthenticatedRoute>
                <PrioritiesPage />
              </AuthenticatedRoute>
            }
          />
          <Route
            path='deliverables'
            element={
              <AuthenticatedRoute>
                <DeliverablesPage />
              </AuthenticatedRoute>
            }
          />
          <Route
            path='statistics'
            element={
              <AuthenticatedRoute>
                <StatisticsPage />
              </AuthenticatedRoute>
            }
          />
          <Route
            path='account'
            element={
              <AuthenticatedRoute>
                <AccountPage />
              </AuthenticatedRoute>
            }
          />
          <Route
            path='account/user'
            element={
              <AuthenticatedRoute>
                <UserProfilePage />
              </AuthenticatedRoute>
            }
          />
          <Route
            path='account/work-setting'
            element={
              <AuthenticatedRoute>
                <WorkSetting />
              </AuthenticatedRoute>
            }
          />
          <Route
            path='account/clients'
            element={
              <AuthenticatedRoute>
                <ClientsPage />
              </AuthenticatedRoute>
            }
          />
          <Route
            path='account/projects'
            element={
              <AuthenticatedRoute>
                <ProjectsPage />
              </AuthenticatedRoute>
            }
          />
        </Route>
      </Routes>
      <Core />
    </>
  );
}

export default App;
