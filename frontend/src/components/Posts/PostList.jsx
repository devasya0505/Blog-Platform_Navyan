import PostCard from './PostCard';
import { FiFileText } from 'react-icons/fi';
import './PostList.css';

const PostList = ({ posts, loading }) => {
  if (loading) {
    return (
      <div className="post-list-loading">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="skeleton-card">
            <div className="skeleton-image" />
            <div className="skeleton-body">
              <div className="skeleton-line short" />
              <div className="skeleton-line" />
              <div className="skeleton-line medium" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="post-list-empty animate-fade-in">
        <FiFileText className="empty-icon" />
        <h3>No posts yet</h3>
        <p>Be the first to share your thoughts!</p>
      </div>
    );
  }

  return (
    <div className="post-list">
      {posts.map((post, index) => (
        <PostCard key={post._id} post={post} index={index} />
      ))}
    </div>
  );
};

export default PostList;
