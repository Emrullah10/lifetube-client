import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import VideoCard from '../components/VideoCard';
import './Channel.css';

const Channel = () => {
  const { id } = useParams();
  const { user: currentUser, isAuthenticated } = useAuth();
  const [channel, setChannel] = useState(null);
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChannel();
    if (isAuthenticated && id !== currentUser?.id) {
      checkSubscription();
    }
  }, [id]);

  const loadChannel = async () => {
    try {
      const response = await usersAPI.getProfile(id);
      setChannel(response.data.user);
    } catch (error) {
      console.error('Failed to load channel:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkSubscription = async () => {
    try {
      const response = await usersAPI.checkSubscription(id);
      setSubscribed(response.data.subscribed);
    } catch (error) {
      console.error('Failed to check subscription:', error);
    }
  };

  const handleSubscribe = async () => {
    try {
      const response = await usersAPI.subscribe(id);
      setSubscribed(response.data.subscribed);
      // Update subscriber count
      setChannel(prev => ({
        ...prev,
        subscriberCount: prev.subscriberCount + (response.data.subscribed ? 1 : -1)
      }));
    } catch (error) {
      console.error('Failed to subscribe:', error);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="channel-page">
      <div className="channel-header">
        <img src={channel.avatar_url} alt={channel.username} className="channel-avatar-large" />
        <div className="channel-info">
          <h1>{channel.username}</h1>
          <p className="subscriber-count">
            {channel.subscriberCount >= 1000000
              ? `${(channel.subscriberCount / 1000000).toFixed(1)}M`
              : channel.subscriberCount >= 1000
              ? `${(channel.subscriberCount / 1000).toFixed(1)}K`
              : channel.subscriberCount} subscribers
          </p>
        </div>
        {isAuthenticated && id !== currentUser?.id && (
          <button
            className={`btn ${subscribed ? 'btn-secondary' : 'btn-primary'}`}
            onClick={handleSubscribe}
          >
            {subscribed ? 'Subscribed' : 'Subscribe'}
          </button>
        )}
      </div>

      <div className="channel-content">
        <h2>Videos</h2>
        <div className="videos-grid">
          {channel.videos?.map((video) => (
            <VideoCard key={video.id} video={{ ...video, users: channel }} />
          ))}
        </div>

        {channel.videos?.length === 0 && (
          <div className="empty-state">
            <p>No videos yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Channel;
