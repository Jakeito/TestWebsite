import { useState, useEffect } from 'react';
import { resumeService } from '../services/api';
import type { ResumeSection } from '../types';

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
      setSections(response.data);
    } catch (err) {
      setError('Failed to load resume');
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
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>Resume</h1>
          <p>My professional experience and qualifications</p>
        </div>

        {sections.length === 0 ? (
          <div className="card">
            <h2>Experience</h2>
            <div className="timeline">
              <div className="timeline-item">
                <h3>Software Developer</h3>
                <p className="subtitle">Tech Company • 2020 - Present</p>
                <p>Building modern web applications with Go and React</p>
              </div>
            </div>

            <h2>Education</h2>
            <div className="timeline">
              <div className="timeline-item">
                <h3>Bachelor of Science in Computer Science</h3>
                <p className="subtitle">University • 2016 - 2020</p>
              </div>
            </div>

            <h2>Skills</h2>
            <div className="card">
              <p>Go, React, TypeScript, PostgreSQL, Docker, Git</p>
            </div>
          </div>
        ) : (
          <>
            {Object.entries(groupedSections).map(([type, items]) => (
              <div key={type} className="card">
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
  );
}
