import { Link } from 'react-router-dom';
import { FiHeart, FiMessageCircle, FiClock } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import './PostCard.css';

const PostCard = ({ post, index }) => {
  const animationDelay = `${index * 80}ms`;

  return (
    <article
      className="post-card animate-fade-in-up"
      style={{ animationDelay }}
    >
      {/* Cover image */}
      {post.coverImage && (
        <Link to={`/post/${post._id}`} className="post-card-image">
          <img src={post.coverImage} alt={post.title} />
        </Link>
      )}

      <div className="post-card-body">
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="post-card-tags">
            {post.tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="tag">{tag}</span>
            ))}
          </div>
        )}

        {/* Title */}
        <Link to={`/post/${post._id}`} className="post-card-title-link">
          <h2 className="post-card-title">{post.title}</h2>
        </Link>

        {/* Excerpt */}
        <p className="post-card-excerpt">{post.excerpt}</p>

        {/* Footer */}
        <div className="post-card-footer">
          <Link
            to={`/profile/${post.author?._id}`}
            className="post-card-author"
          >
            <div className="author-avatar-sm">
              {post.author?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="author-info">
              <span className="author-name">{post.author?.name}</span>
              <span className="post-date">
                <FiClock />
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </span>
            </div>
          </Link>

          <div className="post-card-stats">
            <span className="stat">
              <FiHeart /> {post.likes?.length || 0}
            </span>
            <span className="stat">
              <FiMessageCircle /> {post.commentCount || 0}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
