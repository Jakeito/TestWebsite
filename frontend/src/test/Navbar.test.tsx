import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Navbar from '../components/Navbar';
import { CarouselProvider } from '../context/CarouselContext';

// Mock the auth service
vi.mock('../services/api', () => ({
  authService: {
    isAuthenticated: () => false,
    isAdmin: () => false,
    logout: vi.fn(),
  },
}));

describe('Navbar Component', () => {
  it('renders navigation links', () => {
    render(
      <CarouselProvider>
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      </CarouselProvider>
    );
    
    expect(screen.getByText('My Portfolio')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About Me')).toBeInTheDocument();
    expect(screen.getByText('Resume')).toBeInTheDocument();
    expect(screen.getByText('Car Build')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('renders login link when not authenticated', () => {
    render(
      <CarouselProvider>
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      </CarouselProvider>
    );
    
    expect(screen.getByText('Login')).toBeInTheDocument();
  });
});
