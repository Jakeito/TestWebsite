import { useState, useEffect } from 'react';
import { resumeService } from '../services/api';
import type { ResumeSection } from '../types';
import ImageCarousel from '../components/ImageCarousel';

export default function Resume() {
  const [sections, setSections] = useState<ResumeSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    try {
      const response = await resumeService.getAll();
      setSections(response.data || []);
    } catch (err) {
      setError('Failed to load resume');
      setSections([]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const groupByType = (sections: ResumeSection[]) => {
    return sections.reduce((acc, section) => {
      if (!acc[section.section_type]) {
        acc[section.section_type] = [];
      }
      acc[section.section_type].push(section);
      return acc;
    }, {} as Record<string, ResumeSection[]>);
  };

  const formatDate = (date?: string) => {
    if (!date) return 'Present';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  if (loading) return <div className="page"><div className="container">Loading...</div></div>;
  if (error) return <div className="page"><div className="container error">{error}</div></div>;

  const groupedSections = groupByType(sections);

  return (
    <ImageCarousel folder="gallery" interval={5000}>
      <div className="page">
        <div className="container">
          <div className="page-header">
            <h1>Resume</h1>
            <p>My professional experience and qualifications</p>
          </div>

          {sections.length === 0 ? (
            <>
              <div className="card" style={{ background: 'rgba(26, 26, 26, 0.95)', backdropFilter: 'blur(10px)' }}>
              <h2>💼 Professional Experience</h2>
              <div className="timeline">
                <div className="timeline-item">
                  <h3>Full-Stack Developer</h3>
                  <p className="subtitle">LineLeader • July 2024 - Present</p>
                  <ul>
                    <li>Led a platform upgrade that delivered measurable performance improvements without requiring a full stack rewrite</li>
                    <li>Identified and resolved core performance bottlenecks impacting customer experience</li>
                    <li>Consolidated fragmented engineering documentation into a structured Confluence knowledge base</li>
                    <li>Delivered high-priority enterprise features under tight timelines</li>
                    <li>Implemented robust E2E and unit testing using Cypress and Jest</li>
                  </ul>
                </div>
                <div className="timeline-item">
                  <h3>Senior Full-Stack JavaScript Developer</h3>
                  <p className="subtitle">Aisleworx Media • Feb 2023 - June 2024</p>
                  <ul>
                    <li>Led full-stack development of an IoT device management platform</li>
                    <li>Reduced device onboarding time from ~40 minutes to ~2 minutes through UI/UX collaboration</li>
                    <li>Integrated backend APIs with enterprise firmware management (Mender)</li>
                    <li>Built analytics dashboards for device performance and media consumption</li>
                    <li>Improved application scalability, security, and operational efficiency</li>
                  </ul>
                </div>
                <div className="timeline-item">
                  <h3>Backend Software Engineer Intern</h3>
                  <p className="subtitle">Sabre Corporation • May 2022 - Aug 2022</p>
                  <ul>
                    <li>Developed backend enhancements for airline availability systems</li>
                    <li>Implemented dynamic availability logic to support optimized seat pricing</li>
                    <li>Wrote Groovy-based unit and integration tests</li>
                    <li>Participated in agile sprint planning and technical feasibility reviews</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="card" style={{ background: 'rgba(26, 26, 26, 0.95)', backdropFilter: 'blur(10px)' }}>
              <h2>🎓 Education</h2>
              <div className="timeline">
                <div className="timeline-item">
                  <h3>Bachelor of Science in Computer Science</h3>
                  <p className="subtitle">University of Texas at Dallas • Graduated May 2023</p>
                  <p><strong>GPA: 3.473</strong></p>
                </div>
              </div>
            </div>

            <div className="card" style={{ background: 'rgba(26, 26, 26, 0.95)', backdropFilter: 'blur(10px)' }}>
              <h2>🛠️ Technical Skills</h2>
              <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
                <div>
                  <h3>Languages</h3>
                  <p>JavaScript/TypeScript, Java, Python, Go, C++, Bash</p>
                </div>
                <div>
                  <h3>Frameworks & Libraries</h3>
                  <p>Spring, Apache Camel, Node.js, Meteor.js, Svelte</p>
                </div>
                <div>
                  <h3>Testing</h3>
                  <p>Cypress (E2E), Jest, Spock</p>
                </div>
                <div>
                  <h3>Databases & APIs</h3>
                  <p>MongoDB, Redis, PostgreSQL, REST APIs, WebSockets</p>
                </div>
                <div>
                  <h3>Cloud & Infrastructure</h3>
                  <p>AWS, Docker, Jenkins, Mender (IoT)</p>
                </div>
                <div>
                  <h3>Dev Tools</h3>
                  <p>Git, GitHub, Bitbucket, Gradle, Groovy, JIRA, Confluence</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {Object.entries(groupedSections).map(([type, items]) => (
              <div key={type} className="card" style={{ background: 'rgba(26, 26, 26, 0.95)', backdropFilter: 'blur(10px)' }}>
                <h2>{type.charAt(0).toUpperCase() + type.slice(1)}</h2>
                <div className="timeline">
                  {items.map((item) => (
                    <div key={item.id} className="timeline-item">
                      <h3>{item.title}</h3>
                      {item.subtitle && <p className="subtitle">{item.subtitle}</p>}
                      {(item.start_date || item.end_date) && (
                        <p className="date">
                          {formatDate(item.start_date)} - {formatDate(item.end_date)}
                        </p>
                      )}
                      {item.description && <p>{item.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
        </div>
      </div>
    </ImageCarousel>
  );
}
