import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { liveClassAPI } from '../../services/api';

export const fetchLiveClasses = createAsyncThunk(
  'liveClass/fetchLiveClasses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await liveClassAPI.getAllClasses();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const joinLiveClass = createAsyncThunk(
  'liveClass/joinLiveClass',
  async (classId, { rejectWithValue }) => {
    try {
      const response = await liveClassAPI.joinClass(classId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const initialState = {
  classes: [],
  activeClass: null,
  participants: [],
  status: 'inactive', // inactive, starting, active, ended
  loading: false,
  error: null,
};

const liveClassSlice = createSlice({
  name: 'liveClass',
  initialState,
  reducers: {
    setActiveClass: (state, action) => {
      state.activeClass = action.payload;
    },
    updateLiveClassStatus: (state, action) => {
      const { classId, status } = action.payload;
      if (state.activeClass?.id === classId) {
        state.status = status;
      }
      state.classes = state.classes.map((cls) =>
        cls.id === classId ? { ...cls, status } : cls
      );
    },
    updateParticipants: (state, action) => {
      state.participants = action.payload;
    },
    addParticipant: (state, action) => {
      if (!state.participants.find((p) => p.id === action.payload.id)) {
        state.participants.push(action.payload);
      }
    },
    removeParticipant: (state, action) => {
      state.participants = state.participants.filter(
        (p) => p.id !== action.payload.id
      );
    },
    clearLiveClass: (state) => {
      state.activeClass = null;
      state.participants = [];
      state.status = 'inactive';
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Live Classes
      .addCase(fetchLiveClasses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLiveClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.classes = action.payload;
        state.error = null;
      })
      .addCase(fetchLiveClasses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch live classes';
      })
      // Join Live Class
      .addCase(joinLiveClass.pending, (state) => {
        state.loading = true;
      })
      .addCase(joinLiveClass.fulfilled, (state, action) => {
        state.loading = false;
        state.activeClass = action.payload.class;
        state.participants = action.payload.participants;
        state.status = action.payload.status;
        state.error = null;
      })
      .addCase(joinLiveClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to join live class';
      });
  },
});

export const {
  setActiveClass,
  updateLiveClassStatus,
  updateParticipants,
  addParticipant,
  removeParticipant,
  clearLiveClass,
} = liveClassSlice.actions;

export default liveClassSlice.reducer;
