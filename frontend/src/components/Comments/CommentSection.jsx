import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../utils/api';
import CommentItem from './CommentItem';
import toast from 'react-hot-toast';
import { FiMessageCircle, FiSend } from 'react-icons/fi';
import './CommentSection.css';

const CommentSection = ({ postId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data } = await API.get(`/comments/${postId}`);
        setComments(data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchComments();
    }
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const { data } = await API.post(`/comments/${postId}`, { content: newComment });
      setComments([data, ...comments]);
      setNewComment('');
      toast.success('Comment added!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await API.delete(`/comments/${commentId}`);
      setComments(comments.filter(c => c._id !== commentId));
      toast.success('Comment deleted');
    } catch (error) {
      toast.error('Failed to delete comment');
    }
  };

  return (
    <div className="comment-section">
      <h3 className="comment-section-title">
        <FiMessageCircle />
        Comments ({comments.length})
      </h3>

      {/* Comment form */}
      {user ? (
        <form className="comment-form" onSubmit={handleSubmit}>
          <div className="comment-form-avatar">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="comment-form-input">
            <textarea
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
              maxLength={500}
              id="comment-input"
            />
            <div className="comment-form-actions">
              <span className="comment-char-count">
                {newComment.length}/500
              </span>
              <button
                type="submit"
                className="comment-submit-btn"
                disabled={submitting || !newComment.trim()}
              >
                <FiSend />
                {submitting ? 'Posting...' : 'Post'}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <p className="comment-login-prompt">
          <a href="/login">Sign in</a> to leave a comment
        </p>
      )}

      {/* Comments list */}
      <div className="comments-list">
        {loading ? (
          <div className="comments-loading">
            {[1, 2, 3].map(i => (
              <div key={i} className="skeleton-comment">
                <div className="skeleton-line short" />
                <div className="skeleton-line" />
              </div>
            ))}
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              currentUserId={user?._id}
              onDelete={handleDelete}
            />
          ))
        )}

        {!loading && comments.length === 0 && (
          <p className="no-comments">No comments yet. Be the first to share your thoughts!</p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
