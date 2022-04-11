import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/home/Home';
import LogIn from './pages/auth/LogIn';
import AuthenticatedRoute from './AuthenticatedRoute';
import MainLayout from './container/MainLayout';
import Tasks from './pages/task/Tasks';

function App() {
  return (
    <Routes>
      <Route index element={<Home />} />
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
      </Route>
    </Routes>
  );
}

export default App;
