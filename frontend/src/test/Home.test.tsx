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
    
    expect(screen.getByText(/Welcome to my portfolio/i)).toBeInTheDocument();
  });

  it('renders navigation cards', () => {
    render(
      <CarouselProvider>
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      </CarouselProvider>
    );
    
    expect(screen.getByText(/👨‍💻 About Me/i)).toBeInTheDocument();
    expect(screen.getByText(/📄 Resume/i)).toBeInTheDocument();
    expect(screen.getByText(/🚗 GR86 Build/i)).toBeInTheDocument();
    expect(screen.getByText(/📧 Contact/i)).toBeInTheDocument();
  });
});
