import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import CommentSection from '../components/Comments/CommentSection';
import { FiHeart, FiEdit, FiTrash2, FiArrowLeft, FiClock, FiUser } from 'react-icons/fi';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import './PostDetailPage.css';

const PostDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liking, setLiking] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await API.get(`/posts/${id}`);
        setPost(data);
      } catch (error) {
        toast.error('Post not found');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, navigate]);

  const handleLike = async () => {
    if (!user) {
      toast.error('Please sign in to like posts');
      return;
    }

    setLiking(true);
    try {
      const { data } = await API.put(`/posts/${id}/like`);
      setPost(prev => ({
        ...prev,
        likes: data.likes,
      }));
    } catch (error) {
      toast.error('Failed to like post');
    } finally {
      setLiking(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await API.delete(`/posts/${id}`);
      toast.success('Post deleted');
      navigate('/');
    } catch (error) {
      toast.error('Failed to delete post');
    }
  };

  const isLiked = user && post?.likes?.some(likeId => likeId === user._id || likeId._id === user._id);
  const isOwner = user && post?.author?._id === user._id;

  if (loading) {
    return (
      <div className="post-detail-loading">
        <div className="loading-spinner" />
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="post-detail-page animate-fade-in">
      <div className="post-detail-container">
        {/* Back button */}
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Back
        </button>

        {/* Cover image */}
        {post.coverImage && (
          <div className="post-detail-cover">
            <img src={post.coverImage} alt={post.title} />
          </div>
        )}

        {/* Header */}
        <header className="post-detail-header">
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="post-detail-tags">
              {post.tags.map((tag, i) => (
                <span key={i} className="tag">{tag}</span>
              ))}
            </div>
          )}

          <h1 className="post-detail-title">{post.title}</h1>

          {/* Author info */}
          <div className="post-detail-meta">
            <Link to={`/profile/${post.author?._id}`} className="post-detail-author">
              <div className="author-avatar-md">
                {post.author?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="author-details">
                <span className="author-name-lg">{post.author?.name}</span>
                <div className="meta-row">
                  <span className="meta-item">
                    <FiClock /> {format(new Date(post.createdAt), 'MMM d, yyyy')}
                  </span>
                  <span className="meta-item">
                    <FiUser /> {Math.ceil(post.content.length / 1000)} min read
                  </span>
                </div>
              </div>
            </Link>

            {/* Owner actions */}
            {isOwner && (
              <div className="owner-actions">
                <Link to={`/edit/${post._id}`} className="owner-btn edit-btn" title="Edit post">
                  <FiEdit />
                </Link>
                <button className="owner-btn delete-btn" onClick={handleDelete} title="Delete post">
                  <FiTrash2 />
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <article className="post-detail-content">
          {post.content.split('\n').map((paragraph, i) => (
            paragraph.trim() ? <p key={i}>{paragraph}</p> : <br key={i} />
          ))}
        </article>

        {/* Like section */}
        <div className="post-detail-actions">
          <button
            className={`like-btn ${isLiked ? 'liked' : ''}`}
            onClick={handleLike}
            disabled={liking}
          >
            <FiHeart className={isLiked ? 'filled' : ''} />
            <span>{post.likes?.length || 0} {post.likes?.length === 1 ? 'like' : 'likes'}</span>
          </button>
        </div>

        {/* Comments */}
        <CommentSection postId={post._id} />
      </div>
    </div>
  );
};

export default PostDetailPage;
