const express = require('express');
const router = express.Router();
const {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  likePost,
  getMyPosts,
  getPostsByUser
} = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getPosts);
router.get('/user/:userId', getPostsByUser);

// Private routes (must come before /:id to avoid conflicts)
router.get('/user/me', protect, getMyPosts);
router.post('/', protect, createPost);
router.put('/:id/like', protect, likePost);

// Mixed routes (public read, private write)
router.get('/:id', getPostById);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);

module.exports = router;
