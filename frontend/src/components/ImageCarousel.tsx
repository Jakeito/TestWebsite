import { useState, useEffect } from 'react';
import { useCarousel } from '../context/CarouselContext';

interface ImageCarouselProps {
  folder: string;
  interval?: number;
  children?: React.ReactNode;
}

export default function ImageCarousel({ folder, interval = 5000, children }: ImageCarouselProps) {
  const [images, setImages] = useState<string[]>([]);
  const { currentIndex, setCurrentIndex, isTransitioning, setIsTransitioning } = useCarousel();

  useEffect(() => {
    loadImages();
  }, [folder]);

  useEffect(() => {
    if (images.length === 0) return;

    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev: number) => (prev + 1) % images.length);
        setIsTransitioning(false);
      }, 500);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval, setCurrentIndex, setIsTransitioning]);

  const loadImages = async () => {
    try {
      const response = await fetch(`/api/images?folder=${folder}`);
      const imagePaths = await response.json();
      
      console.log('Loading images from folder:', folder);
      console.log('Found images:', imagePaths);
      
      setImages(imagePaths || []);
    } catch (error) {
      console.error('Error loading images:', error);
      setImages([]);
    }
  };

  if (images.length === 0) {
    return (
      <div 
        className="card"
        style={{ 
          textAlign: 'center',
          padding: '3rem',
          background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)',
          borderColor: '#dc2626'
        }}
      >
        <p style={{ color: '#a3a3a3', fontSize: '1.1rem' }}>
          📸 Drop images into <code style={{ color: '#dc2626', background: '#262626', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>frontend/public/images/{folder}/</code> to see them here
        </p>
      </div>
    );
  }

  // Background carousel mode
  if (children) {
    return (
      <div
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '100vh',
        }}
      >
        {/* Background images */}
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            zIndex: -1,
            overflow: 'hidden',
          }}
        >
          {images.map((image, idx) => (
            <div
              key={idx}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: idx === currentIndex ? (isTransitioning ? 0 : 1) : 0,
                transition: 'opacity 0.8s ease-in-out',
              }}
            >
              <img
                src={image}
                alt=""
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>
          ))}
          {/* Dark overlay for readability */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1,
            }}
          />
        </div>
        
        {/* Content on top */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          {children}
        </div>
      </div>
    );
  }

  // Foreground carousel mode
  return (
    <div 
      style={{ 
        position: 'relative',
        width: '100%',
        minHeight: '500px',
        height: '75vh',
        maxHeight: '900px',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 8px 24px rgba(220, 38, 38, 0.2)',
        border: '2px solid #dc2626'
      }}
    >
      {images.map((image, idx) => (
        <div
          key={idx}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: idx === currentIndex ? (isTransitioning ? 0 : 1) : 0,
            transition: 'opacity 0.5s ease-in-out',
            pointerEvents: idx === currentIndex ? 'auto' : 'none'
          }}
        >
          <img
            src={image}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              backgroundColor: '#000'
            }}
          />
        </div>
      ))}
      
      {/* Navigation Dots */}
      <div 
        style={{ 
          position: 'absolute',
          bottom: '1.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '0.5rem',
          zIndex: 10
        }}
      >
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            style={{
              width: idx === currentIndex ? '32px' : '12px',
              height: '12px',
              borderRadius: '6px',
              border: 'none',
              background: idx === currentIndex ? '#dc2626' : 'rgba(255, 255, 255, 0.5)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              padding: 0
            }}
            aria-label={`Go to image ${idx + 1}`}
          />
        ))}
      </div>

      {/* Image Counter */}
      <div
        style={{
          position: 'absolute',
          top: '1.5rem',
          right: '1.5rem',
          background: 'rgba(0, 0, 0, 0.7)',
          color: '#fff',
          padding: '0.5rem 1rem',
          borderRadius: '20px',
          fontSize: '0.9rem',
          fontWeight: '600'
        }}
      >
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
}
