import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoading: false,
  notification: null,
  theme: 'light',
  error: null,  // Added error field
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    showNotification: (state, action) => {
      state.notification = {
        type: action.payload.type,
        message: action.payload.message,
      };
    },
    setError: (state, action) => {  // Correctly defined setError reducer
      state.error = action.payload;
    },
    clearNotification: (state) => {
      state.notification = null;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
  },
});

export const { setLoading, showNotification, setError, clearNotification, toggleTheme } = uiSlice.actions;