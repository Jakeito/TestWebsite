import { useState, useEffect } from 'react';
import { carBuildService } from '../services/api';
import type { CarBuildEntry } from '../types';

export default function CarBuild() {
  const [entries, setEntries] = useState<CarBuildEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const response = await carBuildService.getAll();
      setEntries(response.data);
    } catch (err) {
      setError('Failed to load car build entries');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric' 
    });
  };

  if (loading) return <div className="page"><div className="container">Loading...</div></div>;
  if (error) return <div className="page"><div className="container error">{error}</div></div>;

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>Car Build Project</h1>
          <p>Follow my automotive build journey</p>
        </div>

        {entries.length === 0 ? (
          <div className="card">
            <h2>🚗 Project Overview</h2>
            <p>
              This is my dream car build project. I'm documenting every step of the process,
              from initial teardown to final assembly. Each modification is carefully planned
              and executed to create the ultimate driving machine.
            </p>

            <h3>Current Mods</h3>
            <ul>
              <li>Performance exhaust system</li>
              <li>Upgraded suspension</li>
              <li>Custom wheels and tires</li>
              <li>Engine tuning</li>
            </ul>

            <h3>Planned Upgrades</h3>
            <ul>
              <li>Turbo kit installation</li>
              <li>Brake upgrade</li>
              <li>Interior restoration</li>
              <li>Paint and body work</li>
            </ul>
          </div>
        ) : (
          <div className="timeline">
            {entries.map((entry) => (
              <div key={entry.id} className="timeline-item">
                <div className="card">
                  <h2>{entry.title}</h2>
                  <p className="subtitle">
                    {formatDate(entry.date)}
                    {entry.category && ` • ${entry.category}`}
                    {entry.cost && ` • $${entry.cost.toFixed(2)}`}
                  </p>
                  
                  {entry.image_urls && entry.image_urls.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', margin: '1rem 0' }}>
                      {entry.image_urls.map((url, idx) => (
                        <img
                          key={idx}
                          src={url}
                          alt={`${entry.title} - ${idx + 1}`}
                          style={{ width: '100%', borderRadius: '4px' }}
                        />
                      ))}
                    </div>
                  )}
                  
                  <p>{entry.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
