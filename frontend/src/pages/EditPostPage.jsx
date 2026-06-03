import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import PostEditor from '../components/Posts/PostEditor';
import toast from 'react-hot-toast';
import './CreatePostPage.css';

const EditPostPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await API.get(`/posts/${id}`);

        // Check ownership
        if (data.author?._id !== user?._id) {
          toast.error('You can only edit your own posts');
          navigate('/');
          return;
        }

        setPost(data);
      } catch (error) {
        toast.error('Post not found');
        navigate('/');
      } finally {
        setFetching(false);
      }
    };

    fetchPost();
  }, [id, user, navigate]);

  const handleSubmit = async (postData) => {
    setLoading(true);
    try {
      await API.put(`/posts/${id}`, postData);
      toast.success('Post updated!');
      navigate(`/post/${id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update post');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="edit-post-page">
        <div className="edit-post-container">
          <div className="loading-spinner" style={{ margin: '4rem auto' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="edit-post-page">
      <div className="edit-post-container animate-fade-in-up">
        <h1 className="page-title">Edit post</h1>
        <PostEditor
          initialData={post}
          onSubmit={handleSubmit}
          loading={loading}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  );
};

export default EditPostPage;
