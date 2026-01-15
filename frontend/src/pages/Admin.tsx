import { useState, useEffect } from 'react';
import ImageCarousel from '../components/ImageCarousel';
import { aboutService, resumeService, carBuildService, contactService, galleryService } from '../services/api';
import type { AboutContent, ResumeSection, CarBuildEntry, ContactSubmission } from '../types';

export default function Admin() {
  const [activeTab, setActiveTab] = useState<'about' | 'resume' | 'carbuild' | 'contact' | 'images'>('about');
  const [aboutItems, setAboutItems] = useState<AboutContent[]>([]);
  const [resumeItems, setResumeItems] = useState<ResumeSection[]>([]);
  const [carBuildItems, setCarBuildItems] = useState<CarBuildEntry[]>([]);
  const [contactItems, setContactItems] = useState<ContactSubmission[]>([]);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [selectedFolder, setSelectedFolder] = useState('gallery');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadMessage, setUploadMessage] = useState('');

  // About form state
  const [aboutForm, setAboutForm] = useState({ title: '', content: '', image_url: '' });
  const [editingAboutId, setEditingAboutId] = useState<number | null>(null);

  // Resume form state
  const [resumeForm, setResumeForm] = useState({
    section_type: '',
    title: '',
    subtitle: '',
    description: '',
    start_date: '',
    end_date: '',
    display_order: 0,
  });
  const [editingResumeId, setEditingResumeId] = useState<number | null>(null);

  // CarBuild form state
  const [carBuildForm, setCarBuildForm] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
    cost: '',
    image_urls: '',
    display_order: 0,
  });
  const [editingCarBuildId, setEditingCarBuildId] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, [activeTab, selectedFolder]);

  const loadData = async () => {
    try {
      if (activeTab === 'about') {
        const response = await aboutService.getAll();
        setAboutItems(response.data || []);
      } else if (activeTab === 'resume') {
        const response = await resumeService.getAll();
        setResumeItems(response.data || []);
      } else if (activeTab === 'carbuild') {
        const response = await carBuildService.getAll();
        setCarBuildItems(response.data || []);
      } else if (activeTab === 'contact') {
        const response = await contactService.getAll();
        setContactItems(response.data || []);
      } else if (activeTab === 'images') {
        const response = await galleryService.list(selectedFolder);
        setGalleryImages(response.data || []);
      }
    } catch (err) {
      console.error('Error loading data:', err);
    }
  };

  // About handlers
  const handleAboutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAboutId) {
        await aboutService.update(editingAboutId, aboutForm);
        setEditingAboutId(null);
      } else {
        await aboutService.create(aboutForm);
      }
      setAboutForm({ title: '', content: '', image_url: '' });
      loadData();
    } catch (err) {
      console.error('Error submitting about:', err);
    }
  };

  const handleAboutDelete = async (id: number) => {
    if (confirm('Are you sure?')) {
      try {
        await aboutService.delete(id);
        loadData();
      } catch (err) {
        console.error('Error deleting about:', err);
      }
    }
  };

  const handleAboutEdit = (item: AboutContent) => {
    setAboutForm({
      title: item.title,
      content: item.content,
      image_url: item.image_url || '',
    });
    setEditingAboutId(item.id);
  };

  // Resume handlers
  const handleResumeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...resumeForm,
        start_date: resumeForm.start_date || null,
        end_date: resumeForm.end_date || null,
      };
      if (editingResumeId) {
        await resumeService.update(editingResumeId, data);
        setEditingResumeId(null);
      } else {
        await resumeService.create(data);
      }
      setResumeForm({
        section_type: '',
        title: '',
        subtitle: '',
        description: '',
        start_date: '',
        end_date: '',
        display_order: 0,
      });
      loadData();
    } catch (err) {
      console.error('Error submitting resume:', err);
    }
  };

  const handleResumeDelete = async (id: number) => {
    if (confirm('Are you sure?')) {
      try {
        await resumeService.delete(id);
        loadData();
      } catch (err) {
        console.error('Error deleting resume:', err);
      }
    }
  };

  const handleResumeEdit = (item: ResumeSection) => {
    setResumeForm({
      section_type: item.section_type,
      title: item.title,
      subtitle: item.subtitle || '',
      description: item.description || '',
      start_date: item.start_date ? new Date(item.start_date).toISOString().split('T')[0] : '',
      end_date: item.end_date ? new Date(item.end_date).toISOString().split('T')[0] : '',
      display_order: item.display_order,
    });
    setEditingResumeId(item.id);
  };

  // CarBuild handlers
  const handleCarBuildSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const imageUrls = carBuildForm.image_urls
        .split(',')
        .map((url) => url.trim())
        .filter((url) => url);

      const data = {
        ...carBuildForm,
        cost: carBuildForm.cost ? parseFloat(carBuildForm.cost) : null,
        image_urls: imageUrls,
      };

      if (editingCarBuildId) {
        await carBuildService.update(editingCarBuildId, data);
        setEditingCarBuildId(null);
      } else {
        await carBuildService.create(data);
      }
      setCarBuildForm({
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        category: '',
        cost: '',
        image_urls: '',
        display_order: 0,
      });
      loadData();
    } catch (err) {
      console.error('Error submitting car build:', err);
    }
  };

  const handleCarBuildDelete = async (id: number) => {
    if (confirm('Are you sure?')) {
      try {
        await carBuildService.delete(id);
        loadData();
      } catch (err) {
        console.error('Error deleting car build:', err);
      }
    }
  };

  const handleCarBuildEdit = (item: CarBuildEntry) => {
    setCarBuildForm({
      title: item.title,
      description: item.description,
      date: new Date(item.date).toISOString().split('T')[0],
      category: item.category || '',
      cost: item.cost ? item.cost.toString() : '',
      image_urls: (item.image_urls || []).join(', '),
      display_order: item.display_order,
    });
    setEditingCarBuildId(item.id);
  };

  // Contact handlers
  const handleContactDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this contact submission?')) {
      try {
        await contactService.delete(id);
        loadData();
      } catch (err) {
        console.error('Error deleting contact:', err);
      }
    }
  };

  // Gallery handlers
  const handleImageUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      setUploadMessage('Please select a file');
      return;
    }

    try {
      await galleryService.upload(uploadFile, selectedFolder);
      setUploadMessage('Image uploaded successfully!');
      setUploadFile(null);
      const fileInput = document.getElementById('imageUpload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      loadData();
      setTimeout(() => setUploadMessage(''), 3000);
    } catch (err) {
      console.error('Error uploading image:', err);
      setUploadMessage('Error uploading image');
    }
  };

  const handleImageDelete = async (imageUrl: string) => {
    // Extract ID from URL like "/api/image/123"
    const match = imageUrl.match(/\/api\/image\/(\d+)/);
    if (!match) return;
    
    const id = parseInt(match[1]);
    if (confirm('Are you sure you want to delete this image?')) {
      try {
        await galleryService.delete(id);
        loadData();
      } catch (err) {
        console.error('Error deleting image:', err);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadFile(e.target.files[0]);
      setUploadMessage('');
    }
  };

  return (
    <ImageCarousel folder="gallery" interval={5000}>
      <div className="page">
        <div className="container">
          <div className="page-header">
            <h1>Admin Dashboard</h1>
            <p>Manage your website content</p>
          </div>

          {/* Tab Navigation */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid #262626', paddingBottom: '1rem' }}>
            {(['about', 'resume', 'carbuild', 'contact', 'images'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  background: activeTab === tab ? '#dc2626' : '#262626',
                  color: '#fff',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  fontWeight: activeTab === tab ? '700' : '500',
                }}
              >
                {tab === 'carbuild' ? 'Car Build' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* About Tab */}
          {activeTab === 'about' && (
            <div>
              <div className="card" style={{ background: 'rgba(26, 26, 26, 0.95)', backdropFilter: 'blur(10px)' }}>
                <h2>{editingAboutId ? 'Edit' : 'Add'} About Content</h2>
                <form onSubmit={handleAboutSubmit}>
                  <div className="form-group">
                    <label htmlFor="title">Title *</label>
                    <input
                      type="text"
                      id="title"
                      value={aboutForm.title}
                      onChange={(e) => setAboutForm({ ...aboutForm, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="content">Content *</label>
                    <textarea
                      id="content"
                      value={aboutForm.content}
                      onChange={(e) => setAboutForm({ ...aboutForm, content: e.target.value })}
                      rows={6}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="image_url">Image URL</label>
                    <input
                      type="url"
                      id="image_url"
                      value={aboutForm.image_url}
                      onChange={(e) => setAboutForm({ ...aboutForm, image_url: e.target.value })}
                    />
                  </div>
                  <button type="submit" style={{ marginRight: '0.5rem' }}>
                    {editingAboutId ? 'Update' : 'Create'}
                  </button>
                  {editingAboutId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingAboutId(null);
                        setAboutForm({ title: '', content: '', image_url: '' });
                      }}
                      style={{ background: '#404040' }}
                    >
                      Cancel
                    </button>
                  )}
                </form>
              </div>

              <div style={{ marginTop: '2rem' }}>
                <h3 style={{ color: '#fff', marginBottom: '1rem' }}>About Content ({aboutItems.length})</h3>
                {aboutItems.map((item) => (
                  <div key={item.id} className="card" style={{ background: 'rgba(26, 26, 26, 0.95)', backdropFilter: 'blur(10px)', marginBottom: '1rem' }}>
                    <h4>{item.title}</h4>
                    <p style={{ color: '#a3a3a3', marginBottom: '1rem' }}>{item.content.substring(0, 100)}...</p>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleAboutEdit(item)} style={{ background: '#1f2937', flex: 1 }}>
                        Edit
                      </button>
                      <button onClick={() => handleAboutDelete(item.id)} className="danger" style={{ flex: 1 }}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resume Tab */}
          {activeTab === 'resume' && (
            <div>
              <div className="card" style={{ background: 'rgba(26, 26, 26, 0.95)', backdropFilter: 'blur(10px)' }}>
                <h2>{editingResumeId ? 'Edit' : 'Add'} Resume Section</h2>
                <form onSubmit={handleResumeSubmit}>
                  <div className="form-group">
                    <label htmlFor="section_type">Section Type *</label>
                    <input
                      type="text"
                      id="section_type"
                      placeholder="e.g., Experience, Education, Skills"
                      value={resumeForm.section_type}
                      onChange={(e) => setResumeForm({ ...resumeForm, section_type: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="title">Title *</label>
                    <input
                      type="text"
                      id="title"
                      value={resumeForm.title}
                      onChange={(e) => setResumeForm({ ...resumeForm, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="subtitle">Subtitle</label>
                    <input
                      type="text"
                      id="subtitle"
                      value={resumeForm.subtitle}
                      onChange={(e) => setResumeForm({ ...resumeForm, subtitle: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                      id="description"
                      value={resumeForm.description}
                      onChange={(e) => setResumeForm({ ...resumeForm, description: e.target.value })}
                      rows={4}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label htmlFor="start_date">Start Date</label>
                      <input
                        type="date"
                        id="start_date"
                        value={resumeForm.start_date}
                        onChange={(e) => setResumeForm({ ...resumeForm, start_date: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="end_date">End Date</label>
                      <input
                        type="date"
                        id="end_date"
                        value={resumeForm.end_date}
                        onChange={(e) => setResumeForm({ ...resumeForm, end_date: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="display_order">Display Order</label>
                    <input
                      type="number"
                      id="display_order"
                      value={resumeForm.display_order}
                      onChange={(e) => setResumeForm({ ...resumeForm, display_order: parseInt(e.target.value) })}
                    />
                  </div>
                  <button type="submit" style={{ marginRight: '0.5rem' }}>
                    {editingResumeId ? 'Update' : 'Create'}
                  </button>
                  {editingResumeId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingResumeId(null);
                        setResumeForm({
                          section_type: '',
                          title: '',
                          subtitle: '',
                          description: '',
                          start_date: '',
                          end_date: '',
                          display_order: 0,
                        });
                      }}
                      style={{ background: '#404040' }}
                    >
                      Cancel
                    </button>
                  )}
                </form>
              </div>

              <div style={{ marginTop: '2rem' }}>
                <h3 style={{ color: '#fff', marginBottom: '1rem' }}>Resume Sections ({resumeItems.length})</h3>
                {resumeItems.map((item) => (
                  <div key={item.id} className="card" style={{ background: 'rgba(26, 26, 26, 0.95)', backdropFilter: 'blur(10px)', marginBottom: '1rem' }}>
                    <h4>{item.title}</h4>
                    <p style={{ color: '#a3a3a3', fontSize: '0.9rem', marginBottom: '1rem' }}>
                      {item.section_type} {item.subtitle && `• ${item.subtitle}`}
                    </p>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleResumeEdit(item)} style={{ background: '#1f2937', flex: 1 }}>
                        Edit
                      </button>
                      <button onClick={() => handleResumeDelete(item.id)} className="danger" style={{ flex: 1 }}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Car Build Tab */}
          {activeTab === 'carbuild' && (
            <div>
              <div className="card" style={{ background: 'rgba(26, 26, 26, 0.95)', backdropFilter: 'blur(10px)' }}>
                <h2>{editingCarBuildId ? 'Edit' : 'Add'} Car Build Entry</h2>
                <form onSubmit={handleCarBuildSubmit}>
                  <div className="form-group">
                    <label htmlFor="title">Title *</label>
                    <input
                      type="text"
                      id="title"
                      value={carBuildForm.title}
                      onChange={(e) => setCarBuildForm({ ...carBuildForm, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="description">Description *</label>
                    <textarea
                      id="description"
                      value={carBuildForm.description}
                      onChange={(e) => setCarBuildForm({ ...carBuildForm, description: e.target.value })}
                      rows={6}
                      required
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label htmlFor="date">Date *</label>
                      <input
                        type="date"
                        id="date"
                        value={carBuildForm.date}
                        onChange={(e) => setCarBuildForm({ ...carBuildForm, date: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="category">Category</label>
                      <input
                        type="text"
                        id="category"
                        value={carBuildForm.category}
                        onChange={(e) => setCarBuildForm({ ...carBuildForm, category: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="cost">Cost ($)</label>
                    <input
                      type="number"
                      id="cost"
                      step="0.01"
                      value={carBuildForm.cost}
                      onChange={(e) => setCarBuildForm({ ...carBuildForm, cost: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="image_urls">Image URLs (comma-separated)</label>
                    <textarea
                      id="image_urls"
                      value={carBuildForm.image_urls}
                      onChange={(e) => setCarBuildForm({ ...carBuildForm, image_urls: e.target.value })}
                      rows={4}
                      placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="display_order">Display Order</label>
                    <input
                      type="number"
                      id="display_order"
                      value={carBuildForm.display_order}
                      onChange={(e) => setCarBuildForm({ ...carBuildForm, display_order: parseInt(e.target.value) })}
                    />
                  </div>
                  <button type="submit" style={{ marginRight: '0.5rem' }}>
                    {editingCarBuildId ? 'Update' : 'Create'}
                  </button>
                  {editingCarBuildId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCarBuildId(null);
                        setCarBuildForm({
                          title: '',
                          description: '',
                          date: new Date().toISOString().split('T')[0],
                          category: '',
                          cost: '',
                          image_urls: '',
                          display_order: 0,
                        });
                      }}
                      style={{ background: '#404040' }}
                    >
                      Cancel
                    </button>
                  )}
                </form>
              </div>

              <div style={{ marginTop: '2rem' }}>
                <h3 style={{ color: '#fff', marginBottom: '1rem' }}>Car Build Entries ({carBuildItems.length})</h3>
                {carBuildItems.map((item) => (
                  <div key={item.id} className="card" style={{ background: 'rgba(26, 26, 26, 0.95)', backdropFilter: 'blur(10px)', marginBottom: '1rem' }}>
                    <h4>{item.title}</h4>
                    <p style={{ color: '#a3a3a3', fontSize: '0.9rem', marginBottom: '1rem' }}>
                      {new Date(item.date).toLocaleDateString()} {item.category && `• ${item.category}`} {item.cost && `• $${item.cost}`}
                    </p>
                    <p style={{ color: '#d4d4d4', marginBottom: '1rem' }}>{item.description.substring(0, 100)}...</p>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleCarBuildEdit(item)} style={{ background: '#1f2937', flex: 1 }}>
                        Edit
                      </button>
                      <button onClick={() => handleCarBuildDelete(item.id)} className="danger" style={{ flex: 1 }}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <div>
              <h3 style={{ color: '#fff', marginBottom: '1rem' }}>Contact Submissions ({contactItems.length})</h3>
              {contactItems.length === 0 ? (
                <div className="card" style={{ background: 'rgba(26, 26, 26, 0.95)', backdropFilter: 'blur(10px)' }}>
                  <p style={{ color: '#a3a3a3' }}>No contact submissions yet.</p>
                </div>
              ) : (
                contactItems.map((item) => (
                  <div key={item.id} className="card" style={{ background: 'rgba(26, 26, 26, 0.95)', backdropFilter: 'blur(10px)', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                      <div>
                        <h4>{item.name}</h4>
                        <p style={{ color: '#dc2626', fontSize: '0.9rem' }}>{item.email}</p>
                        <p style={{ color: '#a3a3a3', fontSize: '0.85rem' }}>
                          {new Date(item.created_at).toLocaleString()}
                        </p>
                      </div>
                      <span
                        style={{
                          background: item.is_read ? '#262626' : '#dc2626',
                          color: '#fff',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '4px',
                          fontSize: '0.85rem',
                        }}
                      >
                        {item.is_read ? 'Read' : 'Unread'}
                      </span>
                    </div>
                    {item.subject && <h5 style={{ marginBottom: '0.5rem' }}>Subject: {item.subject}</h5>}
                    <p style={{ color: '#d4d4d4', marginBottom: '1rem', whiteSpace: 'pre-wrap' }}>{item.message}</p>
                    <button onClick={() => handleContactDelete(item.id)} className="danger" style={{ width: '100%' }}>
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Images Tab */}
          {activeTab === 'images' && (
            <div>
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ color: '#fff', marginBottom: '1rem' }}>Upload Images</h3>
                
                {/* Folder Selector */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label htmlFor="folder-select" style={{ color: '#d4d4d4', marginBottom: '0.5rem', display: 'block' }}>
                    Select Folder:
                  </label>
                  <select
                    id="folder-select"
                    value={selectedFolder}
                    onChange={(e) => setSelectedFolder(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: '#171717',
                      border: '1px solid #262626',
                      borderRadius: '4px',
                      color: '#fff',
                      fontSize: '1rem',
                    }}
                  >
                    <option value="gallery">Gallery</option>
                    <option value="about">About</option>
                    <option value="carbuild">Car Build</option>
                    <option value="hero">Hero</option>
                  </select>
                </div>

                {/* Upload Form */}
                <form onSubmit={handleImageUpload} className="card" style={{ background: 'rgba(26, 26, 26, 0.95)', backdropFilter: 'blur(10px)' }}>
                  <div className="form-group">
                    <label htmlFor="imageUpload">Choose Image</label>
                    <input
                      type="file"
                      id="imageUpload"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        background: '#171717',
                        border: '1px solid #262626',
                        borderRadius: '4px',
                        color: '#fff',
                      }}
                    />
                  </div>
                  {uploadFile && (
                    <p style={{ color: '#a3a3a3', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                      Selected: {uploadFile.name} ({(uploadFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                  <button type="submit" style={{ marginTop: '1rem', width: '100%' }}>
                    Upload to {selectedFolder}
                  </button>
                  {uploadMessage && (
                    <p style={{
                      marginTop: '1rem',
                      padding: '0.75rem',
                      background: uploadMessage.includes('Error') ? '#dc2626' : '#16a34a',
                      borderRadius: '4px',
                      color: '#fff',
                    }}>
                      {uploadMessage}
                    </p>
                  )}
                </form>
              </div>

              {/* Image Gallery */}
              <div>
                <h3 style={{ color: '#fff', marginBottom: '1rem' }}>
                  Images in {selectedFolder} ({galleryImages.length})
                </h3>
                {galleryImages.length === 0 ? (
                  <div className="card" style={{ background: 'rgba(26, 26, 26, 0.95)', backdropFilter: 'blur(10px)' }}>
                    <p style={{ color: '#a3a3a3' }}>No images uploaded yet. Upload your first image above.</p>
                  </div>
                ) : (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '1rem',
                  }}>
                    {galleryImages.map((imageUrl, index) => (
                      <div
                        key={index}
                        className="card"
                        style={{
                          background: 'rgba(26, 26, 26, 0.95)',
                          backdropFilter: 'blur(10px)',
                          padding: '0.5rem',
                        }}
                      >
                        <img
                          src={`${import.meta.env.VITE_API_URL || ''}${imageUrl}`}
                          alt={`Gallery image ${index + 1}`}
                          style={{
                            width: '100%',
                            height: '150px',
                            objectFit: 'cover',
                            borderRadius: '4px',
                            marginBottom: '0.5rem',
                          }}
                        />
                        <button
                          onClick={() => handleImageDelete(imageUrl)}
                          className="danger"
                          style={{ width: '100%', padding: '0.5rem', fontSize: '0.9rem' }}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </ImageCarousel>
  );
}
