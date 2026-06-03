import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../utils/api';
import PostList from '../components/Posts/PostList';
import { FiSearch, FiX } from 'react-icons/fi';
import './HomePage.css';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState('');
  const [activeTag, setActiveTag] = useState('');
  const [allTags, setAllTags] = useState([]);

  const search = searchParams.get('search') || '';

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const params = { page: currentPage, limit: 9 };
        if (search) params.search = search;
        if (activeTag) params.tag = activeTag;

        const { data } = await API.get('/posts', { params });
        setPosts(data.posts);
        setTotalPages(data.totalPages);

        // Collect all unique tags
        const tags = new Set();
        data.posts.forEach(post => {
          post.tags?.forEach(tag => tags.add(tag));
        });
        setAllTags(prev => {
          const merged = new Set([...prev, ...tags]);
          return Array.from(merged);
        });
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage, search, activeTag]);

  // Sync search input with URL param
  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ search: searchInput.trim() });
    } else {
      setSearchParams({});
    }
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchInput('');
    setSearchParams({});
    setCurrentPage(1);
  };

  const handleTagClick = (tag) => {
    setActiveTag(activeTag === tag ? '' : tag);
    setCurrentPage(1);
  };

  return (
    <div className="home-page">
      {/* Hero section */}
      <section className="hero-section">
        <div className="hero-content animate-fade-in-up">
          <h1 className="hero-title">
            Discover stories, thinking, and expertise
          </h1>
          <p className="hero-subtitle">
            Read and share ideas from independent voices, world-class publications, and experts.
          </p>

          {/* Search */}
          <form className="hero-search" onSubmit={handleSearch}>
            <FiSearch className="hero-search-icon" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              id="home-search"
            />
            {searchInput && (
              <button type="button" className="clear-search" onClick={clearSearch}>
                <FiX />
              </button>
            )}
          </form>
        </div>
      </section>

      {/* Main content */}
      <section className="home-content">
        {/* Active filters */}
        {(search || activeTag) && (
          <div className="active-filters animate-fade-in">
            {search && (
              <span className="filter-badge">
                Searching: "{search}"
                <button onClick={clearSearch}><FiX /></button>
              </span>
            )}
            {activeTag && (
              <span className="filter-badge">
                Tag: {activeTag}
                <button onClick={() => setActiveTag('')}><FiX /></button>
              </span>
            )}
          </div>
        )}

        {/* Tags */}
        {allTags.length > 0 && (
          <div className="tag-filter-bar">
            {allTags.slice(0, 10).map(tag => (
              <button
                key={tag}
                className={`tag-filter-btn ${activeTag === tag ? 'active' : ''}`}
                onClick={() => handleTagClick(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* Post list */}
        <PostList posts={posts} loading={loading} />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="page-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
            >
              ← Previous
            </button>
            <span className="page-info">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="page-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
            >
              Next →
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
