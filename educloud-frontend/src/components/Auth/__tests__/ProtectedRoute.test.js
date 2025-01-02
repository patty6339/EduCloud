import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import ProtectedRoute from '../ProtectedRoute';

const mockStore = configureStore([thunk]);

describe('ProtectedRoute', () => {
  it('shows loading spinner while verifying authentication', () => {
    const store = mockStore({
      auth: {
        isAuthenticated: false,
        loading: true,
        user: null,
      },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Verifying authentication...')).toBeInTheDocument();
  });

  it('redirects to login when not authenticated', async () => {
    const store = mockStore({
      auth: {
        isAuthenticated: false,
        loading: false,
        user: null,
      },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(window.location.pathname).toBe('/login');
    });
  });

  it('renders children when authenticated', () => {
    const store = mockStore({
      auth: {
        isAuthenticated: true,
        loading: false,
        user: { id: 1, name: 'Test User' },
      },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('redirects to unauthorized when user role is not allowed', () => {
    const store = mockStore({
      auth: {
        isAuthenticated: true,
        loading: false,
        user: { id: 1, name: 'Test User', role: 'student' },
      },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProtectedRoute roles={['admin']}>
            <div>Admin Content</div>
          </ProtectedRoute>
        </BrowserRouter>
      </Provider>
    );

    expect(window.location.pathname).toBe('/unauthorized');
  });
});
