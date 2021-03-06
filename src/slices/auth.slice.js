import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../axios';
import { decodeJwt } from '../utils/jwt';

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      return (
        await axiosInstance.post('/auth/login', {
          email,
          password,
        })
      ).data;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error.response.data.errs?.join(' - '));
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async ({ email, name, password, address, birth }, { rejectWithValue }) => {
    try {
      return (
        await axiosInstance.post('/auth/register', {
          email,
          name: name,
          password,
          address,
          // birth: birth,
        })
      ).data;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error.response.data.errs?.join(' - '));
    }
  }
);

export const sendConfirmEmail = createAsyncThunk(
  'auth/sendConfirmEmail',
  async (_, { rejectWithValue }) => {
    try {
      return (await axiosInstance.post('/auth/send-confirmation-email')).data;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error.response.data.errs?.join(' - '));
    }
  }
);

export const confirmEmail = createAsyncThunk(
  'auth/verify',
  async ({ code }, { rejectWithValue }) => {
    try {
      return (await axiosInstance.get(`/auth/verify?code=${code}`)).data;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error.response.data.errs?.join(' - '));
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgot',
  async ({ email }, { rejectWithValue }) => {
    try {
      return (
        await axiosInstance.post('/auth/forgot', {
          email: email,
        })
      ).data;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error.response.data.errs?.join(' - '));
    }
  }
);

export const recovery = createAsyncThunk(
  'auth/recovery',
  async ({ code, password }, { rejectWithValue }) => {
    try {
      return (await axiosInstance.post('/auth/recovery', { code, password })).data;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error.response.data.errs?.join(' - '));
    }
  }
);

const initialState = {
  loading: false,
  isAuthenticated: false,
  user: {},
  token: null,
  refresh_token: null,
};

const initReducer = (state) => {
  state.loading = true;
  state.isAuthenticated = false;
  state.user = {};
  state.token = null;
  state.refresh_token = null;
  localStorage.removeItem('token');
  localStorage.removeItem('refresh_token');
};

const authSuccess = (state, action) => {
  const { token, refresh_token } = action.payload;
  state.isAuthenticated = true;
  state.loading = false;
  state.token = token;
  state.refresh_token = refresh_token;
  state.user = decodeJwt(token);

  localStorage.setItem('token', token);
  localStorage.setItem('refresh_token', refresh_token);
};

const authSlice = createSlice({
  name: 'authSlice',
  initialState,
  reducers: {
    verifiedAuth: authSuccess,
    logout: (state) => {
      state.isAuthenticated = false;
      state.loading = false;
      state.token = null;
      state.refresh_token = null;
      state.user = {};
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
    },
  },
  extraReducers: {
    [login.pending]: initReducer,
    [login.rejected]: (state) => {
      state.loading = false;
    },
    [login.fulfilled]: authSuccess,
    [register.pending]: initReducer,
    [register.rejected]: (state) => {
      state.loading = false;
    },
    [register.fulfilled]: authSuccess,
    [confirmEmail.pending]: (state) => {
      state.loading = true;
    },
    [confirmEmail.rejected]: (state) => {
      state.loading = false;
    },
    [confirmEmail.fulfilled]: authSuccess,
    [forgotPassword.pending]: (state) => {
      state.loading = true;
    },
    [forgotPassword.rejected]: (state) => {
      state.loading = false;
    },
    [forgotPassword.fulfilled]: (state) => {
      state.loading = false;
    },
    [recovery.pending]: (state) => {
      state.loading = true;
    },
    [recovery.rejected]: (state) => {
      state.loading = false;
    },
    [recovery.fulfilled]: authSuccess,
    [recovery.pending]: (state) => {
      state.loading = true;
    },
    [recovery.rejected]: (state) => {
      state.loading = false;
    },
    [recovery.fulfilled]: (state) => {
      state.loading = false;
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice;
