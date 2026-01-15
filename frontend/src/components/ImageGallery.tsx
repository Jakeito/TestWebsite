import { useState, useEffect } from 'react';

interface ImageGalleryProps {
  folder: string;
}

export default function ImageGallery({ folder }: ImageGalleryProps) {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    loadImages();
  }, [folder]);

  const loadImages = async () => {
    try {
      const response = await fetch(`/api/images?folder=${folder}`);
      const imagePaths = await response.json();
      
      console.log('Gallery loading images from folder:', folder);
      console.log('Gallery found images:', imagePaths);
      
      setImages(imagePaths || []);
    } catch (error) {
      console.error('Error loading images:', error);
      setImages([]);
    }
  };

  if (images.length === 0) {
    return null;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {images.map((image, idx) => (
        <div 
          key={idx}
          style={{ 
            width: '100%',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            border: '1px solid #262626'
          }}
        >
          <img 
            src={image} 
            alt=""
            style={{ 
              width: '100%',
              height: 'auto',
              display: 'block'
            }}
          />
        </div>
      ))}
    </div>
  );
}
