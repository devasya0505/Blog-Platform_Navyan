import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import PostEditor from '../components/Posts/PostEditor';
import toast from 'react-hot-toast';
import './CreatePostPage.css';

const CreatePostPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (postData) => {
    setLoading(true);
    try {
      const { data } = await API.post('/posts', postData);
      toast.success('Post published!');
      navigate(`/post/${data._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to publish post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-page">
      <div className="create-post-container animate-fade-in-up">
        <h1 className="page-title">Write a new post</h1>
        <PostEditor onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
};

export default CreatePostPage;
