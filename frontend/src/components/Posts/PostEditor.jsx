import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import './PostEditor.css';

const PostEditor = ({ initialData, onSubmit, loading, submitLabel = 'Publish' }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [coverImage, setCoverImage] = useState('');

  // Pre-fill for editing
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setContent(initialData.content || '');
      setTags(initialData.tags || []);
      setCoverImage(initialData.coverImage || '');
    }
  }, [initialData]);

  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (newTag && !tags.includes(newTag) && tags.length < 5) {
        setTags([...tags, newTag]);
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, content, tags, coverImage });
  };

  return (
    <form className="post-editor" onSubmit={handleSubmit}>
      {/* Cover image URL */}
      <div className="editor-group">
        <label htmlFor="cover-image">Cover Image URL (optional)</label>
        <input
          id="cover-image"
          type="url"
          placeholder="https://example.com/image.jpg"
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
        />
        {coverImage && (
          <div className="cover-preview">
            <img src={coverImage} alt="Cover preview" onError={(e) => e.target.style.display = 'none'} />
          </div>
        )}
      </div>

      {/* Title */}
      <div className="editor-group">
        <input
          id="post-title"
          type="text"
          className="editor-title"
          placeholder="Your post title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={200}
        />
      </div>

      {/* Tags */}
      <div className="editor-group">
        <div className="tags-input-container">
          {tags.map((tag) => (
            <span key={tag} className="tag editor-tag">
              {tag}
              <button type="button" onClick={() => handleRemoveTag(tag)}>
                <FiX />
              </button>
            </span>
          ))}
          <input
            type="text"
            className="tag-input"
            placeholder={tags.length < 5 ? 'Add tags (press Enter)...' : 'Max 5 tags'}
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            disabled={tags.length >= 5}
          />
        </div>
      </div>

      {/* Content */}
      <div className="editor-group">
        <textarea
          id="post-content"
          className="editor-content"
          placeholder="Write your story..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={15}
        />
      </div>

      {/* Actions */}
      <div className="editor-actions">
        <span className="char-count">
          {content.length} characters
        </span>
        <button type="submit" className="publish-btn" disabled={loading || !title.trim() || !content.trim()}>
          {loading ? 'Publishing...' : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default PostEditor;
