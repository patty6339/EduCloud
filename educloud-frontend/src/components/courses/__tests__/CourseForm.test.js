import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CourseForm from '../CourseForm';

describe('CourseForm', () => {
  const mockOnSubmit = jest.fn();
  const defaultProps = {
    onSubmit: mockOnSubmit,
    isEditing: false,
  };

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders all form fields', () => {
    render(<CourseForm {...defaultProps} />);

    expect(screen.getByLabelText(/course title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/level/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/duration/i)).toBeInTheDocument();
  });

  it('shows validation errors for required fields', async () => {
    render(<CourseForm {...defaultProps} />);

    fireEvent.click(screen.getByRole('button', { name: /create course/i }));

    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
      expect(screen.getByText(/description is required/i)).toBeInTheDocument();
      expect(screen.getByText(/category is required/i)).toBeInTheDocument();
      expect(screen.getByText(/level is required/i)).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    render(<CourseForm {...defaultProps} />);

    await userEvent.type(screen.getByLabelText(/course title/i), 'Test Course');
    await userEvent.type(
      screen.getByLabelText(/description/i),
      'This is a test course description that is long enough to pass validation.'
    );
    await userEvent.selectOptions(screen.getByLabelText(/category/i), 'programming');
    await userEvent.selectOptions(screen.getByLabelText(/level/i), 'beginner');
    await userEvent.type(screen.getByLabelText(/price/i), '99.99');
    await userEvent.type(screen.getByLabelText(/duration/i), '8 weeks');

    fireEvent.click(screen.getByRole('button', { name: /create course/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Test Course',
        description: 'This is a test course description that is long enough to pass validation.',
        category: 'programming',
        level: 'beginner',
        price: '99.99',
        duration: '8 weeks',
        prerequisites: [],
        thumbnail: null,
      });
    });
  });

  it('loads initial values when editing', () => {
    const initialValues = {
      title: 'Existing Course',
      description: 'Existing description',
      category: 'programming',
      level: 'intermediate',
      price: '149.99',
      duration: '12 weeks',
      prerequisites: ['Basic Programming'],
    };

    render(<CourseForm {...defaultProps} initialValues={initialValues} isEditing />);

    expect(screen.getByLabelText(/course title/i)).toHaveValue('Existing Course');
    expect(screen.getByLabelText(/description/i)).toHaveValue('Existing description');
    expect(screen.getByLabelText(/category/i)).toHaveValue('programming');
    expect(screen.getByLabelText(/level/i)).toHaveValue('intermediate');
    expect(screen.getByLabelText(/price/i)).toHaveValue('149.99');
    expect(screen.getByLabelText(/duration/i)).toHaveValue('12 weeks');
  });

  it('handles file upload', async () => {
    render(<CourseForm {...defaultProps} />);

    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    const fileInput = screen.getByLabelText(/drop course thumbnail/i);

    await userEvent.upload(fileInput, file);

    expect(fileInput.files[0]).toBe(file);
    expect(fileInput.files).toHaveLength(1);
  });

  it('resets form on reset button click', async () => {
    render(<CourseForm {...defaultProps} />);

    await userEvent.type(screen.getByLabelText(/course title/i), 'Test Course');
    await userEvent.type(
      screen.getByLabelText(/description/i),
      'Test description'
    );

    fireEvent.click(screen.getByRole('button', { name: /reset/i }));

    expect(screen.getByLabelText(/course title/i)).toHaveValue('');
    expect(screen.getByLabelText(/description/i)).toHaveValue('');
  });
});
