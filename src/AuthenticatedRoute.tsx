import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './store';

function AuthenticatedRoute({ children }: { children: JSX.Element }) {
  const { userInfo, loading, error, token } = useSelector((state: RootState) => state.user);
  const location = useLocation();

  if (!userInfo) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
}
export default AuthenticatedRoute;
