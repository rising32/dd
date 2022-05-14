import { createSlice } from '@reduxjs/toolkit';

export interface CoreState {
  loading: boolean;
}

const initialState: CoreState = {
  loading: false,
};

export const coreSlice = createSlice({
  name: 'core',
  initialState,
  reducers: {
    showLoading: state => {
      state.loading = true;
    },
    removeLoading: state => {
      state.loading = false;
    },
  },
});

export const { showLoading, removeLoading } = coreSlice.actions;

export default coreSlice.reducer;
