import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import LogIn from './pages/auth/LogIn';
import AuthenticatedRoute from './AuthenticatedRoute';
import MainLayout from './container/MainLayout';
import Tasks from './pages/tasks/Tasks';
import Priorities from './pages/priorities/Priorities';
import Deliverables from './pages/deliverables/Deliverables';
import Statistics from './pages/statistics/Statistics';
import Account from './pages/account/Account';
import UserProfile from './pages/account/UserProfile';
import Core from './container/base/Core';
import WorkSetting from './pages/account/WorkSetting';

function App() {
  return (
    <>
      <Routes>
        <Route index element={<LogIn />} />
        <Route path='login' element={<LogIn />} />
        <Route element={<MainLayout />}>
          <Route
            path='tasks'
            element={
              <AuthenticatedRoute>
                <Tasks />
              </AuthenticatedRoute>
            }
          />
          <Route
            path='priorities'
            element={
              <AuthenticatedRoute>
                <Priorities />
              </AuthenticatedRoute>
            }
          />
          <Route
            path='deliverables'
            element={
              <AuthenticatedRoute>
                <Deliverables />
              </AuthenticatedRoute>
            }
          />
          <Route
            path='statistics'
            element={
              <AuthenticatedRoute>
                <Statistics />
              </AuthenticatedRoute>
            }
          />
          <Route
            path='account'
            element={
              <AuthenticatedRoute>
                <Account />
              </AuthenticatedRoute>
            }
          />
          <Route
            path='account/user'
            element={
              <AuthenticatedRoute>
                <UserProfile />
              </AuthenticatedRoute>
            }
          />
        </Route>
        <Route
          path='account/work-setting'
          element={
            <AuthenticatedRoute>
              <WorkSetting />
            </AuthenticatedRoute>
          }
        />
      </Routes>
      <Core />
    </>
  );
}

export default App;
