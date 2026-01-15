import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Home from '../pages/Home';
import { CarouselProvider } from '../context/CarouselContext';

describe('Home Page', () => {
  it('renders welcome message', () => {
    render(
      <CarouselProvider>
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      </CarouselProvider>
    );
    
    expect(screen.getByText(/Welcome to My Personal Website/i)).toBeInTheDocument();
  });

  it('renders navigation cards', () => {
    render(
      <CarouselProvider>
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      </CarouselProvider>
    );
    
    expect(screen.getByRole('heading', { name: /About Me/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Resume/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Car Build/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Contact/i })).toBeInTheDocument();
  });
});
