import { useState, useEffect } from 'react';
import { videosAPI } from '../services/api';
import VideoCard from '../components/VideoCard';
import './Home.css';

const Trending = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrendingVideos();
  }, []);

  const loadTrendingVideos = async () => {
    try {
      const response = await videosAPI.getTrending();
      setVideos(response.data.videos);
    } catch (error) {
      console.error('Failed to load trending videos:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      <h1 style={{ marginBottom: 'var(--spacing-lg)' }}>Trending</h1>

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
    </div>
  );
};

export default Trending;
