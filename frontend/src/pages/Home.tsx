import ImageCarousel from '../components/ImageCarousel';

export default function Home() {
  return (
    <ImageCarousel folder="gallery" interval={5000}>
      <div className="page">
        <div className="container">
          <div className="page-header" style={{ marginBottom: '3rem' }}>
            <h1 style={{ fontSize: '3rem' }}>Jake Yoo</h1>
            <p style={{ fontSize: '1.4rem', color: '#dc2626', fontWeight: '600', marginBottom: '0.5rem' }}>
              Software Engineer & GR86 Enthusiast
            </p>
            <p style={{ fontSize: '1.1rem', color: '#a3a3a3' }}>
              Full-Stack Web Development | Plano, TX
            </p>
          </div>

          <div className="card" style={{ background: 'rgba(26, 26, 26, 0.95)', backdropFilter: 'blur(10px)', borderColor: '#dc2626' }}>
            <h2>Welcome to my portfolio</h2>
            <p>
              I'm a full-stack software engineer with professional experience building scalable web platforms,
              IoT management systems, and performance-critical backend services. I focus on creating reliable,
              maintainable systems that solve real business problems.
            </p>
            <p style={{ marginTop: '1rem' }}>
              This site showcases my professional experience and technical expertise. I also share my hobbies,
              including working on my 2022 Toyota GR86 with aftermarket parts, gaming, and volleyball.
            </p>
          </div>
          
          <div className="grid">
            <div className="card" style={{ background: 'rgba(26, 26, 26, 0.95)', backdropFilter: 'blur(10px)' }}>
              <h2>👨‍💻 About Me</h2>
              <p>
                My engineering philosophy, core values, and personal interests including cars, gaming, and volleyball.
              </p>
              <a href="/about">
                <button>Learn More</button>
              </a>
            </div>

            <div className="card" style={{ background: 'rgba(26, 26, 26, 0.95)', backdropFilter: 'blur(10px)' }}>
              <h2>📄 Resume</h2>
              <p>
                Professional experience at LineLeader, Aisleworx Media, and Sabre Corporation. UTD CS graduate.
              </p>
              <a href="/resume">
                <button>View Resume</button>
              </a>
            </div>

            <div className="card" style={{ background: 'rgba(26, 26, 26, 0.95)', backdropFilter: 'blur(10px)' }}>
              <h2>🚗 GR86 Build</h2>
              <p>
                My 2022 Toyota GR86 build log. Aftermarket parts and modifications for street and track use.
              </p>
              <a href="/carbuild">
                <button>View Build</button>
              </a>
            </div>

            <div className="card" style={{ background: 'rgba(26, 26, 26, 0.95)', backdropFilter: 'blur(10px)' }}>
              <h2>📧 Contact</h2>
              <p>
                Have a question or want to connect? Feel free to reach out through the contact form.
              </p>
              <a href="/contact">
                <button>Contact Me</button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </ImageCarousel>
  );
}
