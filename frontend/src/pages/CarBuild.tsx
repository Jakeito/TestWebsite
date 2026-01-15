import { useState, useEffect } from 'react';
import { carBuildService } from '../services/api';
import type { CarBuildEntry } from '../types';
import ImageGallery from '../components/ImageGallery';
import ImageCarousel from '../components/ImageCarousel';

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
      setEntries(response.data || []);
    } catch (err) {
      setError('Failed to load car build entries');
      setEntries([]);
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
    <ImageCarousel folder="gallery" interval={5000}>
      <div className="page">
        <div className="container">
          <div className="page-header">
            <h1>Car Build Project</h1>
            <p>Follow my automotive build journey</p>
          </div>

          {entries.length === 0 ? (
            <>
              <div className="card" style={{ background: 'rgba(26, 26, 26, 0.95)', backdropFilter: 'blur(10px)' }}>
              <h2>🚗 2022 Toyota GR86</h2>
              <p className="subtitle">Street / Track-Oriented Build • Plano, TX</p>
              <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', marginTop: '1rem' }}>
                <div>
                  <p><strong>Drivetrain:</strong> RWD</p>
                  <p><strong>Transmission:</strong> 6-Speed Manual</p>
                  <p><strong>Mileage:</strong> ~38,000 miles</p>
                </div>
                <div>
                  <p><strong>Color Theme:</strong> Red / White / Black</p>
                  <p><strong>Build Philosophy:</strong> Driver feedback over peak dyno numbers</p>
                  <p><strong>Focus:</strong> OEM+ fitment and reliability</p>
                </div>
              </div>
            </div>

            <div className="card" style={{ background: 'rgba(26, 26, 26, 0.95)', backdropFilter: 'blur(10px)' }}>
              <h2>🏁 Build Philosophy</h2>
              <p>
                This build emphasizes driver feedback over peak dyno numbers, reliability alongside performance,
                and street legality with track readiness. Every modification is researched with the same rigor
                applied to production software systems—prioritizing OEM+ fitment and clean integration.
              </p>
            </div>

            <div className="card" style={{ background: 'rgba(26, 26, 26, 0.95)', backdropFilter: 'blur(10px)' }}>
              <h2>🔥 Powertrain & Exhaust</h2>
              <ul>
                <li>Tomei Expreme V2 UEL Headers</li>
                <li>JDL Ultraquiet Front Pipe / Overpipe Combo</li>
                <li>GR Performance Exhaust (Muffler Deleted)</li>
                <li>K&N Cold Air Intake</li>
                <li>Stage 2 Tune with Pop & Bangs</li>
                <li>J-Style Defouler</li>
              </ul>
            </div>

            <div className="card" style={{ background: 'rgba(26, 26, 26, 0.95)', backdropFilter: 'blur(10px)' }}>
              <h2>⚙️ Drivetrain & Controls</h2>
              <ul>
                <li>MTEC Clutch Spring</li>
                <li>Billetworkz Japanese Weighted Shift Knob</li>
                <li>Billetworkz Reverse Lockout Adapter</li>
              </ul>
            </div>

            <div className="card" style={{ background: 'rgba(26, 26, 26, 0.95)', backdropFilter: 'blur(10px)' }}>
              <h2>🛞 Wheels, Tires & Suspension</h2>
              <ul>
                <li>GramLights 57DR — 18x9.5 +38 (5x100)</li>
                <li>Continental ControlContact Sport SRS Tires</li>
                <li>TPMS Sensors</li>
                <li>GramLights Wheel Caps</li>
              </ul>
            </div>

            <div className="card" style={{ background: 'rgba(26, 26, 26, 0.95)', backdropFilter: 'blur(10px)' }}>
              <h2>🪑 Interior</h2>
              <ul>
                <li>Ballfix Racing Quick Release</li>
                <li>Short Hub Adapter / Boss Kit</li>
                <li>Momo Prototipo Black Edition Steering Wheel</li>
              </ul>
            </div>

            <div className="card" style={{ background: 'rgba(26, 26, 26, 0.95)', backdropFilter: 'blur(10px)' }}>
              <h2>💡 Lighting & Exterior</h2>
              <ul>
                <li>Invoke Concepts Taillights</li>
                <li>Driven Media: JDM Front Sidemarkers, Full LED Upgrade Kit, F1 Blinking Module</li>
                <li>Tail Light Overlay Kit, Reverse Light Overlay, Third Brake Light Overlay</li>
                <li>Carbon Fiber Hood (in transit)</li>
                <li>Hood Hinges</li>
              </ul>
            </div>

            <div className="card" style={{ background: 'rgba(26, 26, 26, 0.95)', backdropFilter: 'blur(10px)' }}>
              <h2>📱 Electronics & Accessories</h2>
              <ul>
                <li>Viofo A229 Dashcam</li>
                <li>Uniden R3 Radar Detector</li>
              </ul>
            </div>

            <div className="card" style={{ background: 'rgba(26, 26, 26, 0.95)', backdropFilter: 'blur(10px)' }}>
              <h2>🧴 Maintenance & Consumables</h2>
              <ul>
                <li>Liqui Moly Molygen 5W-30 Motor Oil</li>
                <li>K&N Oil Filter</li>
                <li>Windshield Wipers</li>
              </ul>
            </div>

            <div className="card" style={{ background: 'rgba(26, 26, 26, 0.95)', backdropFilter: 'blur(10px)' }}>
              <h2>🎨 Aesthetic & Branding</h2>
              <ul>
                <li>Nano-Ceramic Tint (Front: 30% | Sides: 15% | Rear: 5%)</li>
                <li>LxL Banner</li>
                <li>Custom Chaewon Banner</li>
                <li>Never Content License Plate + Stickers</li>
              </ul>
            </div>

            <div className="card" style={{ background: 'rgba(26, 26, 26, 0.95)', backdropFilter: 'blur(10px)' }}>
              <h2>🔨 Repairs / Condition</h2>
              <ul>
                <li>Front bumper repair (completed)</li>
                <li>Two wheels repaired (completed)</li>
              </ul>
            </div>

            <div style={{ marginTop: '2rem' }}>
              <ImageGallery folder="carbuild" />
            </div>
          </>
        ) : (
          <div className="timeline">
            {entries.map((entry) => (
              <div key={entry.id} className="timeline-item">
                <div className="card" style={{ background: 'rgba(26, 26, 26, 0.95)', backdropFilter: 'blur(10px)' }}>
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
    </ImageCarousel>
  );
}
