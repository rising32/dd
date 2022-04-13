import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import LogIn from './pages/auth/LogIn';
import AuthenticatedRoute from './AuthenticatedRoute';
import MainLayout from './container/MainLayout';
import Tasks from './pages/tasks/Tasks';
import Priorities from './pages/priorities/Priorities';
import Deliverables from './pages/deliverables/Deliverables';

function App() {
  return (
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
      </Route>
    </Routes>
  );
}

export default App;
