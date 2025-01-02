import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  courses: [],
  currentCourse: null,
  enrolledCourses: [],
  loading: false,
  error: null,
};

const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    fetchCoursesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCoursesSuccess: (state, action) => {
      state.loading = false;
      state.courses = action.payload;
    },
    fetchCoursesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentCourse: (state, action) => {
      state.currentCourse = action.payload;
    },
    updateEnrolledCourses: (state, action) => {
      state.enrolledCourses = action.payload;
    },
    addCourse: (state, action) => {
      state.courses.push(action.payload);
    },
    updateCourse: (state, action) => {
      const index = state.courses.findIndex(course => course._id === action.payload._id);
      if (index !== -1) {
        state.courses[index] = action.payload;
      }
    },
    deleteCourse: (state, action) => {
      state.courses = state.courses.filter(course => course._id !== action.payload);
    },
  },
});

export const {
  fetchCoursesStart,
  fetchCoursesSuccess,
  fetchCoursesFailure,
  setCurrentCourse,
  updateEnrolledCourses,
  addCourse,
  updateCourse,
  deleteCourse,
} = courseSlice.actions;

export default courseSlice.reducer;
