import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Home from '../pages/Home';

describe('Home Page', () => {
  it('renders welcome message', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/Welcome to My Personal Website/i)).toBeInTheDocument();
  });

  it('renders navigation cards', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/About Me/i)).toBeInTheDocument();
    expect(screen.getByText(/Resume/i)).toBeInTheDocument();
    expect(screen.getByText(/Car Build/i)).toBeInTheDocument();
    expect(screen.getByText(/Contact/i)).toBeInTheDocument();
  });
});
