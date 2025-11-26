import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { videosAPI } from '../services/api';
import VideoCard from '../components/VideoCard';
import './Home.css';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      searchVideos();
    }
  }, [query]);

  const searchVideos = async () => {
    try {
      setLoading(true);
      const response = await videosAPI.getAll({ search: query });
      setVideos(response.data.videos);
    } catch (error) {
      console.error('Failed to search videos:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      <h1 style={{ marginBottom: 'var(--spacing-lg)' }}>
        Search results for "{query}"
      </h1>

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
          <p>No videos found for "{query}"</p>
        </div>
      )}
    </div>
  );
};

export default Search;
