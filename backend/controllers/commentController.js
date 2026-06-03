const Comment = require('../models/Comment');
const Post = require('../models/Post');

// @desc    Get comments for a post
// @route   GET /api/comments/:postId
// @access  Public
const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate('author', 'name')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    console.error('GetComments error:', error.message);
    res.status(500).json({ message: 'Server error fetching comments' });
  }
};

// @desc    Create a comment on a post
// @route   POST /api/comments/:postId
// @access  Private
const createComment = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Please provide comment content' });
    }

    // Check if post exists
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = await Comment.create({
      post: req.params.postId,
      author: req.user._id,
      content
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'name');

    res.status(201).json(populatedComment);
  } catch (error) {
    console.error('CreateComment error:', error.message);
    res.status(500).json({ message: 'Server error creating comment' });
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private (comment owner only)
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check ownership
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await Comment.findByIdAndDelete(comment._id);

    res.json({ message: 'Comment deleted' });
  } catch (error) {
    console.error('DeleteComment error:', error.message);
    res.status(500).json({ message: 'Server error deleting comment' });
  }
};

module.exports = { getComments, createComment, deleteComment };
