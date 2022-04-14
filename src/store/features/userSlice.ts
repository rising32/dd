import { createSlice, createAsyncThunk, SerializedError } from '@reduxjs/toolkit';
import apiClient from '../../lib/api';
import { userURL } from '../../lib/api/URL';
import { UserInfoState } from '../../modules/user';

interface UserState {
  userInfo: UserInfoState | null;
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  login_id: number | null;
  token: string | null;
  currentRequestId?: string;
  error: SerializedError | null;
}
const initialState: UserState = {
  loading: 'idle',
  token: null,
  login_id: null,
  userInfo: null,
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
    updateUser: (state, action) => {
      state.userInfo = action.payload;
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
          state.userInfo = action.payload.user;
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

export const { updateUser } = userSlice.actions;

export default userSlice.reducer;
