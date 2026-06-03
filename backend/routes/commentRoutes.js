const express = require('express');
const router = express.Router();
const { getComments, createComment, deleteComment } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

// Get comments for a post (Public)
router.get('/:postId', getComments);

// Create comment on a post (Private)
router.post('/:postId', protect, createComment);

// Delete a comment (Private — owner only)
router.delete('/:id', protect, deleteComment);

module.exports = router;
