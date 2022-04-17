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
import WorkSettingPage from './pages/account/WorkSettingPage';
import ClientManagePage from './pages/client/ClientManagePage';
import ProjectManagePage from './pages/project/ProjectManagePage';
import TaskManagePage from './pages/tasks/TaskManagePage';
import TeamManagePage from './pages/team/TeamManagePage';
import AgendaPage from './pages/agenda/AgendaPage';

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
            path='priorities/agenda-:wp_id'
            element={
              <AuthenticatedRoute>
                <AgendaPage />
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
                <WorkSettingPage />
              </AuthenticatedRoute>
            }
          />
          <Route
            path='account/clients'
            element={
              <AuthenticatedRoute>
                <ClientManagePage />
              </AuthenticatedRoute>
            }
          />
          <Route
            path='account/projects'
            element={
              <AuthenticatedRoute>
                <ProjectManagePage />
              </AuthenticatedRoute>
            }
          />
          <Route
            path='account/tasks'
            element={
              <AuthenticatedRoute>
                <TaskManagePage />
              </AuthenticatedRoute>
            }
          />
          <Route
            path='account/teams'
            element={
              <AuthenticatedRoute>
                <TeamManagePage />
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
