import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { videosAPI, commentsAPI, usersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { FiThumbsUp, FiThumbsDown, FiSend } from 'react-icons/fi';
import VideoCard from '../components/VideoCard';
import './Watch.css';

const Watch = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [userLike, setUserLike] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadVideo();
      loadComments();
      loadRelatedVideos();
      incrementView();
    }
  }, [id]);

  const loadVideo = async () => {
    try {
      const response = await videosAPI.getById(id);
      setVideo(response.data.video);

      if (isAuthenticated && response.data.video.users?.id !== user?.id) {
        checkSubscription(response.data.video.users.id);
      }
    } catch (error) {
      console.error('Failed to load video:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      const response = await commentsAPI.getByVideo(id);
      setComments(response.data.comments);
    } catch (error) {
      console.error('Failed to load comments:', error);
    }
  };

  const loadRelatedVideos = async () => {
    try {
      const response = await videosAPI.getAll({ limit: 10 });
      setRelatedVideos(response.data.videos.filter(v => v.id !== id));
    } catch (error) {
      console.error('Failed to load related videos:', error);
    }
  };

  const incrementView = async () => {
    try {
      await videosAPI.incrementView(id);
    } catch (error) {
      console.error('Failed to increment view:', error);
    }
  };

  const checkSubscription = async (channelId) => {
    try {
      const response = await usersAPI.checkSubscription(channelId);
      setSubscribed(response.data.subscribed);
    } catch (error) {
      console.error('Failed to check subscription:', error);
    }
  };

  const handleSubscribe = async () => {
    try {
      const response = await usersAPI.subscribe(video.users.id);
      setSubscribed(response.data.subscribed);
    } catch (error) {
      console.error('Failed to subscribe:', error);
    }
  };

  const handleLike = async (type) => {
    try {
      await videosAPI.like(id, type);
      setUserLike(userLike === type ? null : type);
      loadVideo();
    } catch (error) {
      console.error('Failed to like video:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      await commentsAPI.add({ videoId: id, text: commentText });
      setCommentText('');
      loadComments();
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      await commentsAPI.delete(commentId);
      loadComments();
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  const handleDeleteVideo = async () => {
    if (!window.confirm('Are you sure you want to delete this video? This action cannot be undone.')) return;

    try {
      await videosAPI.delete(id);
      alert('Video deleted successfully');
      navigate('/');
    } catch (error) {
      console.error('Failed to delete video:', error);
      alert('Failed to delete video');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!video) {
    return <div className="empty-state">Video not found</div>;
  }

  return (
    <div className="watch-page">
      <div className="watch-main">
        <div className="video-player">
          <video key={id} controls autoPlay>
            <source src={`http://localhost:5000${video.video_url}`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        <div className="video-info-section">
          <h1 className="video-title">{video.title}</h1>

          <div className="video-actions">
            <div className="video-stats">
              <span>{video.views} views</span>
              <span>•</span>
              <span>{formatDistanceToNow(new Date(video.created_at), { addSuffix: true })}</span>
            </div>

            <div className="action-buttons">
              <button
                className={`btn-icon-text ${userLike === 'like' ? 'active' : ''}`}
                onClick={() => handleLike('like')}
                disabled={!isAuthenticated}
              >
                <FiThumbsUp size={20} />
                <span>{video.likeCount || 0}</span>
              </button>
              <button
                className={`btn-icon-text ${userLike === 'dislike' ? 'active' : ''}`}
                onClick={() => handleLike('dislike')}
                disabled={!isAuthenticated}
              >
                <FiThumbsDown size={20} />
                <span>{video.dislikeCount || 0}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="channel-info-section">
          <Link to={`/channel/${video.users?.id}`} className="channel-link">
            <img src={video.users?.avatar_url} alt={video.users?.username} />
            <div>
              <h3>{video.users?.username}</h3>
              <p className="text-secondary text-sm">
                {video.users?.subscriberCount
                  ? `${video.users.subscriberCount >= 1000
                      ? `${(video.users.subscriberCount / 1000).toFixed(1)}K`
                      : video.users.subscriberCount} subscribers`
                  : 'Subscribers'}
              </p>
            </div>
          </Link>
          <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
            {isAuthenticated && video.users?.id !== user?.id && (
              <button
                className={`btn ${subscribed ? 'btn-secondary' : 'btn-primary'}`}
                onClick={handleSubscribe}
              >
                {subscribed ? 'Subscribed' : 'Subscribe'}
              </button>
            )}
            {isAuthenticated && video.users?.id === user?.id && (
              <button
                className="btn btn-danger"
                onClick={handleDeleteVideo}
                title="Delete video"
              >
                Delete Video
              </button>
            )}
          </div>
        </div>

        <div className="video-description">
          <p>{video.description}</p>
        </div>

        <div className="comments-section">
          <h3>{comments.length} Comments</h3>

          {isAuthenticated && (
            <form onSubmit={handleCommentSubmit} className="comment-form">
              <img src={user?.avatar_url} alt={user?.username} className="comment-avatar" />
              <input
                type="text"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button type="submit" className="btn-icon" disabled={!commentText.trim()}>
                <FiSend size={20} />
              </button>
            </form>
          )}

          <div className="comments-list">
            {comments.map((comment) => (
              <div key={comment.id} className="comment">
                <img src={comment.users?.avatar_url} alt={comment.users?.username} className="comment-avatar" />
                <div className="comment-content">
                  <div className="comment-header">
                    <span className="comment-author">{comment.users?.username}</span>
                    <span className="comment-time">
                      {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                    </span>
                    {isAuthenticated && comment.users?.id === user?.id && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="delete-comment-btn"
                        title="Delete comment"
                      >
                        ×
                      </button>
                    )}
                  </div>
                  <p className="comment-text">{comment.text}</p>

                  {comment.replies?.length > 0 && (
                    <div className="replies">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="comment reply">
                          <img src={reply.users?.avatar_url} alt={reply.users?.username} className="comment-avatar" />
                          <div className="comment-content">
                            <div className="comment-header">
                              <span className="comment-author">{reply.users?.username}</span>
                              <span className="comment-time">
                                {formatDistanceToNow(new Date(reply.created_at), { addSuffix: true })}
                              </span>
                            </div>
                            <p className="comment-text">{reply.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="watch-sidebar">
        <h3>Related Videos</h3>
        <div className="related-videos">
          {relatedVideos.map((relatedVideo) => (
            <VideoCard key={relatedVideo.id} video={relatedVideo} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Watch;
