import { useState, useEffect } from 'react';
import { videosAPI } from '../services/api';
import VideoCard from '../components/VideoCard';
import './Home.css';

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');

  const categories = ['All', 'Music', 'Gaming', 'Sports', 'News', 'Education', 'Entertainment'];

  useEffect(() => {
    loadVideos();
  }, [category]);

  const loadVideos = async () => {
    try {
      setLoading(true);
      const params = category !== 'All' ? { category } : {};
      const response = await videosAPI.getAll(params);
      setVideos(response.data.videos);
    } catch (error) {
      console.error('Failed to load videos:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      <div className="categories">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-btn ${category === cat ? 'active' : ''}`}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

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
          <p>No videos found</p>
        </div>
      )}
    </div>
  );
};

export default Home;
