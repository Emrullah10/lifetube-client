import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { usersAPI } from '../services/api';
import VideoCard from '../components/VideoCard';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Subscriptions = () => {
  const { isAuthenticated } = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadSubscriptionFeed();
  }, [isAuthenticated]);

  const loadSubscriptionFeed = async () => {
    try {
      const response = await usersAPI.getSubscriptionFeed();
      setVideos(response.data.videos);
    } catch (error) {
      console.error('Failed to load subscription feed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      <h1 style={{ marginBottom: 'var(--spacing-lg)' }}>Subscriptions</h1>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="videos-grid">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}

      {!loading && videos.length === 0 && (
        <div className="empty-state">
          <p>No videos from your subscriptions</p>
          <p style={{ marginTop: 'var(--spacing-sm)', fontSize: '0.875rem' }}>
            Subscribe to channels to see their latest videos here
          </p>
        </div>
      )}
    </div>
  );
};

export default Subscriptions;
