export default function Home() {
  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>Welcome to My Personal Website</h1>
          <p>Explore my journey, projects, and passion for automotive engineering</p>
        </div>
        
        <div className="grid">
          <div className="card">
            <h2>👨‍💻 About Me</h2>
            <p>
              Learn more about my background, experience, and what drives me to create and innovate.
            </p>
            <a href="/about">
              <button>Learn More</button>
            </a>
          </div>

          <div className="card">
            <h2>📄 Resume</h2>
            <p>
              Explore my professional experience, education, and skills that define my career journey.
            </p>
            <a href="/resume">
              <button>View Resume</button>
            </a>
          </div>

          <div className="card">
            <h2>🚗 Car Build</h2>
            <p>
              Follow along with my automotive project, from concept to completion with detailed build logs.
            </p>
            <a href="/carbuild">
              <button>View Build</button>
            </a>
          </div>

          <div className="card">
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
  );
}
