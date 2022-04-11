import React from 'react';
import { Outlet } from 'react-router-dom';
function MainLayout(): JSX.Element {
  return (
    <div className='flex flex-col bg-main-back min-h-screen'>
      <Outlet />
    </div>
  );
}

export default MainLayout;
