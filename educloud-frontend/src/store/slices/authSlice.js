import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../services/api';
import { setError } from './uiSlice';

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Login failed'));
      return rejectWithValue(error.response?.data);
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      const response = await authAPI.register(userData);
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Registration failed'));
      return rejectWithValue(error.response?.data);
    }
  }
);

export const verifyToken = createAsyncThunk(
  'auth/verifyToken',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await authAPI.verifyToken();
      return response.data;
    } catch (error) {
      localStorage.removeItem('token');
      return rejectWithValue(error.response?.data);
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { dispatch, rejectWithValue }) => {
    try {
      const response = await authAPI.updateProfile(profileData);
      return response.data;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Profile update failed'));
      return rejectWithValue(error.response?.data);
    }
  }
);

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Login failed';
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Registration failed';
      })
      // Verify Token
      .addCase(verifyToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(verifyToken.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Profile update failed';
      });
  },
});

export const { logout, clearError } = authSlice.actions;

export default authSlice.reducer;
