import { useState, useEffect } from 'react';
import { aboutService } from '../services/api';
import type { AboutContent } from '../types';
import ImageGallery from '../components/ImageGallery';
import ImageCarousel from '../components/ImageCarousel';

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
      setContent(response.data || []);
    } catch (err) {
      setError('Failed to load content');
      setContent([]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="page"><div className="container">Loading...</div></div>;
  if (error) return <div className="page"><div className="container error">{error}</div></div>;

  return (
    <ImageCarousel folder="gallery" interval={5000}>
      <div className="page">
        <div className="container">
          <div className="page-header">
            <h1>About Me</h1>
            <p>Get to know me better</p>
          </div>

          {content.length === 0 ? (
            <>
              <div className="card" style={{ background: 'rgba(26, 26, 26, 0.95)', backdropFilter: 'blur(10px)' }}>
                <h2>👋 Jake Yoo</h2>
                <p className="subtitle">Software Engineer — Plano, TX</p>
                <p>
                  I'm a full-stack software engineer with professional experience building scalable web platforms,
                  IoT management systems, and performance-critical backend services. I focus on creating reliable,
                  maintainable systems that solve real business problems.
                </p>
                <p>
                  When I'm not coding, I enjoy working on my 2022 Toyota GR86 (installing aftermarket parts and modifications),
                  gaming, and playing volleyball. My hobbies keep me balanced and energized for the work I do.
                </p>
              </div>

              <div className="grid">
                <div className="card" style={{ background: 'rgba(26, 26, 26, 0.95)', backdropFilter: 'blur(10px)' }}>
                  <h3>🎯 Engineering Philosophy</h3>
                  <ul>
                    <li>Making mistakes is part of learning</li>
                    <li>Failure leads to consistency and growth</li>
                    <li>Learn from each iteration</li>
                    <li>Clean, maintainable code</li>
                    <li>Systems-level thinking</li>
                  </ul>
                </div>

                <div className="card" style={{ background: 'rgba(26, 26, 26, 0.95)', backdropFilter: 'blur(10px)' }}>
                  <h3>💡 Core Values</h3>
                  <ul>
                    <li>Love thy neighbor</li>
                    <li>Humility in all things</li>
                    <li>Forgiveness and grace</li>
                    <li>Integrity and honesty</li>
                    <li>Continuous learning</li>
                  </ul>
                </div>

                <div className="card" style={{ background: 'rgba(26, 26, 26, 0.95)', backdropFilter: 'blur(10px)' }}>
                  <h3>🎮 Hobbies & Interests</h3>
                  <ul>
                    <li>Cars — modifying my GR86 with aftermarket parts</li>
                    <li>Gaming — competitive and casual</li>
                    <li>Volleyball — recreational play</li>
                    <li>Technology & innovation</li>
                    <li>Learning new skills</li>
                  </ul>
                </div>
              </div>

              <div className="card" style={{ background: 'rgba(26, 26, 26, 0.95)', backdropFilter: 'blur(10px)' }}>
                <h2>🛠️ Tech Stack</h2>
                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                  <div>
                    <h4>Languages</h4>
                    <p>JavaScript/TypeScript, Java, Python, Go, C++, Bash</p>
                  </div>
                  <div>
                    <h4>Frameworks</h4>
                    <p>Spring, Apache Camel, Node.js, Meteor.js, Svelte</p>
                  </div>
                  <div>
                    <h4>Testing</h4>
                    <p>Cypress, Jest, Spock</p>
                  </div>
                  <div>
                    <h4>Databases</h4>
                    <p>MongoDB, Redis, PostgreSQL</p>
                  </div>
                  <div>
                    <h4>Cloud & DevOps</h4>
                    <p>AWS, Docker, Jenkins, Git, GitHub</p>
                  </div>
                  <div>
                    <h4>Tools</h4>
                    <p>Gradle, Groovy, JIRA, Confluence, Mender (IoT)</p>
                  </div>
                </div>
              </div>

              <div className="card" style={{ background: 'rgba(26, 26, 26, 0.95)', backdropFilter: 'blur(10px)' }}>
                <h2>🔗 Connect</h2>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <a href="https://github.com/Jakeito" target="_blank" rel="noopener noreferrer" style={{ color: '#dc2626', textDecoration: 'none', fontWeight: '600' }}>
                    GitHub →
                  </a>
                  <a href="https://www.linkedin.com/in/jungwoo-yoo-1b726621a/" target="_blank" rel="noopener noreferrer" style={{ color: '#dc2626', textDecoration: 'none', fontWeight: '600' }}>
                    LinkedIn →
                  </a>
                </div>
              </div>

              <div style={{ marginTop: '2rem' }}>
                <ImageGallery folder="about" />
              </div>
            </>
          ) : (
            content.map((item) => (
              <div key={item.id} className="card" style={{ background: 'rgba(26, 26, 26, 0.95)', backdropFilter: 'blur(10px)' }}>
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
    </ImageCarousel>
  );
}
