import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from '../components/nav/Navigation';

function MainLayout(): JSX.Element {
  return (
    <div className='flex flex-col bg-background h-screen text-sm'>
      <Outlet />
      <Navigation />
    </div>
  );
}

export default MainLayout;
