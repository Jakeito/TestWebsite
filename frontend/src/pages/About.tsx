import { useState, useEffect } from 'react';
import { aboutService } from '../services/api';
import type { AboutContent } from '../types';

export default function About() {
  const [content, setContent] = useState<AboutContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const response = await aboutService.getAll();
      setContent(response.data);
    } catch (err) {
      setError('Failed to load content');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="page"><div className="container">Loading...</div></div>;
  if (error) return <div className="page"><div className="container error">{error}</div></div>;

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>About Me</h1>
          <p>Get to know me better</p>
        </div>

        {content.length === 0 ? (
          <div className="card">
            <h2>Welcome!</h2>
            <p>
              Hi, I'm a passionate developer and automotive enthusiast. This website showcases my
              professional journey and personal projects, including my car build.
            </p>
            <p>
              I love working with modern technologies and building things that make a difference.
              When I'm not coding, you'll find me in the garage working on my project car.
            </p>
          </div>
        ) : (
          content.map((item) => (
            <div key={item.id} className="card">
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt={item.title}
                  style={{ width: '100%', borderRadius: '8px', marginBottom: '1rem' }}
                />
              )}
              <h2>{item.title}</h2>
              <p>{item.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
