import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../lib/api';
import { userURL } from '../../lib/api/URL';
import { UserInfoState } from '../../modules/user';

interface UserState {
  userInfo: UserInfoState | null;
  login_id: number | null;
  token: string | null;
  accountSetting: AccountSettingState;
  error: string | null;
}
export interface AccountSettingState {
  as_id: number | null;
  date_format: number;
  time_format: number;
  currency: number;
  decimal_seperator: number;
}
const initialState: UserState = {
  token: null,
  login_id: null,
  userInfo: null,
  accountSetting: {
    as_id: null,
    date_format: 0,
    time_format: 0,
    currency: 0,
    decimal_seperator: 0,
  },
  error: null,
};

export const onLogin = createAsyncThunk('user/login', async (params: { email: string; password: string }) => {
  const response = await apiClient.post(userURL.login, params);
  return response.data as { login_id: number; token: string; user: UserInfoState };
});
export const onSignUp = createAsyncThunk(
  'user/signup',
  async (params: { email: string; phone_number: string; display_name: string; password: string; role_id: number }) => {
    const response = await apiClient.post(userURL.signup, params);
    return response.data as { login_id: number; token: string; user: UserInfoState };
  },
);
export const onSignout = createAsyncThunk('user/signout', async (params: { user_id: number }) => {
  const response = await apiClient.post(userURL.signout, params);
  return response.data;
});
export const getAccountSetting = createAsyncThunk('user/getSetting', async (params: { user_id: number }) => {
  const response = await apiClient.post(userURL.getAccountSetting, params);
  return response.data as AccountSettingState;
});
export const createAccountSetting = createAsyncThunk('user/createSetting', async (params: AccountSettingState & { user_id: number }) => {
  const response = await apiClient.post(userURL.createAccountSetting, params);
  return response.data as AccountSettingState;
});
export const updateAccountSetting = createAsyncThunk('user/updateSetting', async (params: AccountSettingState & { user_id: number }) => {
  const response = await apiClient.post(userURL.updateAccountSetting, params);
  return response.data as AccountSettingState;
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
    builder.addCase(onLogin.fulfilled, (state, action) => {
      state.userInfo = action.payload.user;
      state.login_id = action.payload.login_id;
      state.token = action.payload.token;
    });
    builder.addCase(onSignUp.fulfilled, (state, action) => {
      state.userInfo = action.payload.user;
      state.login_id = action.payload.login_id;
      state.token = action.payload.token;
    });
    builder.addCase(onLogin.rejected, (state, action) => {
      state.error = action.payload as string;
    });
    builder.addCase(onSignout.fulfilled, state => {
      state.userInfo = null;
      state.login_id = null;
      state.token = null;
      state.accountSetting.as_id = null;
      state.accountSetting.date_format = 0;
      state.accountSetting.time_format = 0;
      state.accountSetting.currency = 0;
      state.accountSetting.decimal_seperator = 0;
    });
    builder.addCase(getAccountSetting.fulfilled, (state, action) => {
      if (action.payload) {
        state.accountSetting.as_id = action.payload.as_id;
        state.accountSetting.date_format = action.payload.date_format;
        state.accountSetting.time_format = action.payload.time_format;
        state.accountSetting.currency = action.payload.currency;
        state.accountSetting.decimal_seperator = action.payload.decimal_seperator;
      }
    });
    builder.addCase(createAccountSetting.fulfilled, (state, action) => {
      if (action.payload) {
        state.accountSetting.as_id = action.payload.as_id;
        state.accountSetting.date_format = action.payload.date_format;
        state.accountSetting.time_format = action.payload.time_format;
        state.accountSetting.currency = action.payload.currency;
        state.accountSetting.decimal_seperator = action.payload.decimal_seperator;
      }
    });
    builder.addCase(updateAccountSetting.fulfilled, (state, action) => {
      if (action.payload) {
        state.accountSetting.as_id = action.payload.as_id;
        state.accountSetting.date_format = action.payload.date_format;
        state.accountSetting.time_format = action.payload.time_format;
        state.accountSetting.currency = action.payload.currency;
        state.accountSetting.decimal_seperator = action.payload.decimal_seperator;
      }
    });
  },
});

export const { updateUser } = userSlice.actions;

export default userSlice.reducer;
