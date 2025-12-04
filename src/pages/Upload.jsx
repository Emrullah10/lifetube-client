import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { videosAPI } from '../services/api';
import { FiUpload } from 'react-icons/fi';
import './Upload.css';

const Upload = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'General',
    tags: ''
  });
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!videoFile) {
      setError('Please select a video file');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const data = new FormData();
      data.append('video', videoFile);
      if (thumbnailFile) {
        data.append('thumbnail', thumbnailFile);
      }
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('category', formData.category);
      data.append('tags', formData.tags);

      const response = await videosAPI.upload(data);
      navigate(`/watch/${response.data.video.id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload video');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-page">
      <div className="upload-container">
        <h1>Upload Video</h1>

        <form onSubmit={handleSubmit} className="upload-form">
          {error && <div className="error-message">{error}</div>}

          <div className="file-upload-section">
            <div className="file-upload">
              <label htmlFor="video-file" className="file-upload-label">
                <FiUpload size={48} />
                <p>{videoFile ? videoFile.name : 'Select video file'}</p>
                <span className="file-hint">MP4, AVI, MOV (max 50MB)</span>
              </label>
              <input
                id="video-file"
                type="file"
                accept="video/*"
                onChange={(e) => setVideoFile(e.target.files[0])}
                required
              />
            </div>

            <div className="file-upload">
              <label htmlFor="thumbnail-file" className="file-upload-label">
                <FiUpload size={32} />
                <p>{thumbnailFile ? thumbnailFile.name : 'Select thumbnail (optional)'}</p>
                <span className="file-hint">JPG, PNG (max 5MB)</span>
              </label>
              <input
                id="thumbnail-file"
                type="file"
                accept="image/*"
                onChange={(e) => setThumbnailFile(e.target.files[0])}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="Enter video title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Tell viewers about your video"
              rows="4"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option>General</option>
                <option>Music</option>
                <option>Gaming</option>
                <option>Sports</option>
                <option>News</option>
                <option>Education</option>
                <option>Entertainment</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="tags">Tags</label>
              <input
                id="tags"
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="tag1, tag2, tag3"
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload Video'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Upload;
