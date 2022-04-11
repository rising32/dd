import { createSlice, createAsyncThunk, SerializedError } from '@reduxjs/toolkit';
import apiClient from '../../lib/api';
import { userURL } from '../../lib/api/URL';
import { UserEntityState } from '../../modules/user';

interface UserState {
  entity: UserEntityState | null;
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  login_id: number | null;
  token: string | null;
  currentRequestId?: string;
  error: SerializedError | null;
}
interface ResponseUserState {
  entity: UserEntityState;
  login_id: number;
  token: string;
}

const initialState: UserState = {
  loading: 'idle',
  token: null,
  login_id: null,
  entity: null,
  currentRequestId: undefined,
  error: null,
};

export const onLogin = createAsyncThunk('user/login', async (params: { email: string; password: string }) => {
  const response = await apiClient.post(userURL.login, params);
  return response.data;
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAccount: (state, action) => {
      state = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(onLogin.pending, (state, action) => {
        if (state.loading === 'idle') {
          state.loading = 'pending';
          state.currentRequestId = action.meta.requestId;
        }
      })
      .addCase(onLogin.fulfilled, (state, action) => {
        const { requestId } = action.meta;
        if (state.loading === 'pending' && state.currentRequestId === requestId) {
          state.loading = 'idle';
          state.entity = action.payload.user;
          state.login_id = action.payload.login_id;
          state.token = action.payload.token;
          state.currentRequestId = undefined;
        }
      })
      .addCase(onLogin.rejected, (state, action) => {
        const { requestId } = action.meta;
        if (state.loading === 'pending' && state.currentRequestId === requestId) {
          state.loading = 'idle';
          state.error = action.error;
          state.currentRequestId = undefined;
        }
      });
  },
});

export const { setAccount } = userSlice.actions;

export default userSlice.reducer;