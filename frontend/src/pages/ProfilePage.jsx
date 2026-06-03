import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import PostList from '../components/Posts/PostList';
import { FiEdit, FiFileText } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './ProfilePage.css';

const ProfilePage = () => {
  const { userId } = useParams();
  const { user, updateProfile } = useAuth();
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [saving, setSaving] = useState(false);

  const isOwnProfile = !userId || userId === user?._id;

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        if (isOwnProfile && user) {
          setProfileUser(user);
          const { data } = await API.get('/posts/user/me');
          setPosts(data);
        } else if (userId) {
          const { data: userData } = await API.get(`/auth/user/${userId}`);
          setProfileUser(userData);
          const { data: postsData } = await API.get(`/posts/user/${userId}`);
          setPosts(postsData);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, user, isOwnProfile]);

  const handleEdit = () => {
    setEditName(profileUser?.name || '');
    setEditBio(profileUser?.bio || '');
    setEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await updateProfile({ name: editName, bio: editBio });
      setProfileUser(updated);
      setEditing(false);
      toast.success('Profile updated!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <div className="loading-spinner" style={{ margin: '4rem auto' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Profile header */}
        <div className="profile-header animate-fade-in-up">
          <div className="profile-avatar-lg">
            {profileUser?.name?.charAt(0).toUpperCase()}
          </div>

          {editing ? (
            <div className="profile-edit-form">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  maxLength={50}
                />
              </div>
              <div className="form-group">
                <label>Bio</label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  maxLength={200}
                  rows={3}
                />
              </div>
              <div className="profile-edit-actions">
                <button className="save-btn" onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button className="cancel-btn" onClick={() => setEditing(false)}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="profile-info">
              <h1 className="profile-name">{profileUser?.name}</h1>
              {profileUser?.bio && (
                <p className="profile-bio">{profileUser.bio}</p>
              )}
              <p className="profile-stats">
                <FiFileText /> {posts.length} {posts.length === 1 ? 'post' : 'posts'}
              </p>

              {isOwnProfile && (
                <button className="profile-edit-btn" onClick={handleEdit}>
                  <FiEdit /> Edit Profile
                </button>
              )}
            </div>
          )}
        </div>

        {/* User's posts */}
        <div className="profile-posts">
          <h2 className="profile-posts-title">
            {isOwnProfile ? 'Your Posts' : `Posts by ${profileUser?.name}`}
          </h2>

          {posts.length === 0 ? (
            <div className="profile-empty">
              <p>No posts yet.</p>
              {isOwnProfile && (
                <Link to="/write" className="write-first-btn">Write your first post</Link>
              )}
            </div>
          ) : (
            <PostList posts={posts} loading={false} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
