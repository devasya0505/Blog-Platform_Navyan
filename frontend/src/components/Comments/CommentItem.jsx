import { FiTrash2 } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import './CommentItem.css';

const CommentItem = ({ comment, currentUserId, onDelete }) => {
  const isOwner = currentUserId && comment.author?._id === currentUserId;

  return (
    <div className="comment-item animate-fade-in">
      <div className="comment-header">
        <div className="comment-author">
          <div className="comment-avatar">
            {comment.author?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="comment-meta">
            <span className="comment-name">{comment.author?.name}</span>
            <span className="comment-date">
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
            </span>
          </div>
        </div>

        {isOwner && (
          <button
            className="comment-delete-btn"
            onClick={() => onDelete(comment._id)}
            title="Delete comment"
          >
            <FiTrash2 />
          </button>
        )}
      </div>

      <p className="comment-content">{comment.content}</p>
    </div>
  );
};

export default CommentItem;
