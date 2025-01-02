import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const LiveClassScheduler = ({ onSchedule, courses }) => {
  const [selectedStudents, setSelectedStudents] = useState([]);

  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    courseId: Yup.string().required('Course is required'),
    startTime: Yup.date()
      .required('Start time is required')
      .min(new Date(), 'Start time must be in the future'),
    duration: Yup.number()
      .required('Duration is required')
      .min(15, 'Minimum duration is 15 minutes')
      .max(180, 'Maximum duration is 180 minutes'),
  });

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      courseId: '',
      startTime: null,
      duration: 60,
    },
    validationSchema,
    onSubmit: (values) => {
      onSchedule({ ...values, students: selectedStudents });
    },
  });

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Schedule Live Class
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="title"
              name="title"
              label="Class Title"
              value={formik.values.title}
              onChange={formik.handleChange}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              id="description"
              name="description"
              label="Class Description"
              value={formik.values.description}
              onChange={formik.handleChange}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Course</InputLabel>
              <Select
                id="courseId"
                name="courseId"
                value={formik.values.courseId}
                onChange={formik.handleChange}
                error={formik.touched.courseId && Boolean(formik.errors.courseId)}
              >
                {courses?.map((course) => (
                  <MenuItem key={course.id} value={course.id}>
                    {course.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="duration"
              name="duration"
              label="Duration (minutes)"
              type="number"
              value={formik.values.duration}
              onChange={formik.handleChange}
              error={formik.touched.duration && Boolean(formik.errors.duration)}
              helperText={formik.touched.duration && formik.errors.duration}
              InputProps={{
                inputProps: { min: 15, max: 180 },
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <DateTimePicker
              label="Start Time"
              value={formik.values.startTime}
              onChange={(value) => formik.setFieldValue('startTime', value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  error={formik.touched.startTime && Boolean(formik.errors.startTime)}
                  helperText={formik.touched.startTime && formik.errors.startTime}
                />
              )}
              minDateTime={new Date()}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Selected Students
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {selectedStudents.map((student) => (
                <Chip
                  key={student.id}
                  label={student.name}
                  onDelete={() => {
                    setSelectedStudents(
                      selectedStudents.filter((s) => s.id !== student.id)
                    );
                  }}
                />
              ))}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                type="button"
                variant="outlined"
                onClick={() => {
                  formik.resetForm();
                  setSelectedStudents([]);
                }}
              >
                Reset
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
              >
                Schedule Class
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default LiveClassScheduler;
