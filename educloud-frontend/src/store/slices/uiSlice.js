import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoading: false,
  notification: null,
  theme: 'light',
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
    clearNotification: (state) => {
      state.notification = null;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
  },
});

export const { setLoading, showNotification, clearNotification, toggleTheme } = uiSlice.actions;

export default uiSlice.reducer;
