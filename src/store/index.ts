import { Action, ThunkDispatch, configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import companySlice from './features/companySlice';
import coreSlice from './features/coreSlice';
import userSlice from './features/userSlice';

export const store = configureStore({
  reducer: {
    core: coreSlice,
    user: userSlice,
    companyInfo: companySlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type ThunkAppDispatch = ThunkDispatch<RootState, void, Action>;
export const useAppDispatch = () => useDispatch<ThunkAppDispatch>();
