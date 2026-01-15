import { createContext, useContext, useState, ReactNode } from 'react';

interface CarouselContextType {
  currentIndex: number;
  setCurrentIndex: (index: number | ((prev: number) => number)) => void;
  isTransitioning: boolean;
  setIsTransitioning: (transitioning: boolean) => void;
}

const CarouselContext = createContext<CarouselContextType | undefined>(undefined);

export function CarouselProvider({ children }: { children: ReactNode }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleSetCurrentIndex = (index: number | ((prev: number) => number)) => {
    if (typeof index === 'function') {
      setCurrentIndex((prev) => index(prev));
    } else {
      setCurrentIndex(index);
    }
  };

  return (
    <CarouselContext.Provider value={{ currentIndex, setCurrentIndex: handleSetCurrentIndex, isTransitioning, setIsTransitioning }}>
      {children}
    </CarouselContext.Provider>
  );
}

export function useCarousel() {
  const context = useContext(CarouselContext);
  if (!context) {
    throw new Error('useCarousel must be used within a CarouselProvider');
  }
  return context;
}
