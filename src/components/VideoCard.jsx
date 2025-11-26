import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import './VideoCard.css';

const VideoCard = ({ video }) => {
  const formatViews = (views) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views;
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const timeAgo = formatDistanceToNow(new Date(video.created_at), { addSuffix: true });

  const thumbnailUrl = video.thumbnail_url?.startsWith('/uploads')
    ? `http://localhost:5000${video.thumbnail_url}`
    : video.thumbnail_url;

  return (
    <Link to={`/watch/${video.id}`} className="video-card">
      <div className="video-thumbnail">
        <img src={thumbnailUrl} alt={video.title} />
        <div className="video-duration">{formatDuration(video.duration)}</div>
      </div>
      <div className="video-info">
        <img
          src={video.users?.avatar_url}
          alt={video.users?.username}
          className="channel-avatar"
        />
        <div className="video-details">
          <h3 className="video-title">{video.title}</h3>
          <p className="channel-name">{video.users?.username}</p>
          <div className="video-meta">
            <span>{formatViews(video.views)} views</span>
            <span>•</span>
            <span>{timeAgo}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
