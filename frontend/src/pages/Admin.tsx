export default function Admin() {
  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>Admin Dashboard</h1>
          <p>Manage your website content</p>
        </div>

        <div className="grid">
          <div className="card">
            <h2>About Content</h2>
            <p>Manage your about page content</p>
            <button>Manage</button>
          </div>

          <div className="card">
            <h2>Resume Sections</h2>
            <p>Add and edit your resume sections</p>
            <button>Manage</button>
          </div>

          <div className="card">
            <h2>Car Build Entries</h2>
            <p>Document your car build progress</p>
            <button>Manage</button>
          </div>

          <div className="card">
            <h2>Contact Submissions</h2>
            <p>View messages from visitors</p>
            <button>View</button>
          </div>
        </div>
      </div>
    </div>
  );
}
