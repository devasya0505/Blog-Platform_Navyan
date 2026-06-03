const Post = require('../models/Post');
const Comment = require('../models/Comment');

// @desc    Get all posts (with pagination, search, tag filter)
// @route   GET /api/posts
// @access  Public
const getPosts = async (req, res) => {
  try {
    const { search, tag, page = 1, limit = 10 } = req.query;

    // Build filter
    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    if (tag) {
      filter.tags = tag.toLowerCase();
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const posts = await Post.find(filter)
      .populate('author', 'name bio')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const postsWithComments = await Promise.all(
      posts.map(async (post) => {
        const commentCount = await Comment.countDocuments({ post: post._id });
        return {
          ...post.toObject(),
          commentCount
        };
      })
    );

    const total = await Post.countDocuments(filter);

    res.json({
      posts: postsWithComments,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      totalPosts: total
    });
  } catch (error) {
    console.error('GetPosts error:', error.message);
    res.status(500).json({ message: 'Server error fetching posts' });
  }
};

// @desc    Get single post by ID
// @route   GET /api/posts/:id
// @access  Public
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name bio');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Get comment count
    const commentCount = await Comment.countDocuments({ post: post._id });

    res.json({ ...post.toObject(), commentCount });
  } catch (error) {
    console.error('GetPostById error:', error.message);
    res.status(500).json({ message: 'Server error fetching post' });
  }
};

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res) => {
  try {
    const { title, content, tags, coverImage } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Please provide title and content' });
    }

    const post = await Post.create({
      author: req.user._id,
      title,
      content,
      tags: tags || [],
      coverImage: coverImage || ''
    });

    const populatedPost = await Post.findById(post._id)
      .populate('author', 'name bio');

    res.status(201).json(populatedPost);
  } catch (error) {
    console.error('CreatePost error:', error.message);
    res.status(500).json({ message: 'Server error creating post' });
  }
};

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private (owner only)
const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check ownership
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }

    const { title, content, tags, coverImage } = req.body;

    post.title = title || post.title;
    post.content = content || post.content;
    post.tags = tags !== undefined ? tags : post.tags;
    post.coverImage = coverImage !== undefined ? coverImage : post.coverImage;

    const updatedPost = await post.save();
    const populatedPost = await Post.findById(updatedPost._id)
      .populate('author', 'name bio');

    res.json(populatedPost);
  } catch (error) {
    console.error('UpdatePost error:', error.message);
    res.status(500).json({ message: 'Server error updating post' });
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private (owner only)
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check ownership
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    // Delete all comments for this post
    await Comment.deleteMany({ post: post._id });

    // Delete the post
    await Post.findByIdAndDelete(post._id);

    res.json({ message: 'Post and related comments deleted' });
  } catch (error) {
    console.error('DeletePost error:', error.message);
    res.status(500).json({ message: 'Server error deleting post' });
  }
};

// @desc    Toggle like on a post
// @route   PUT /api/posts/:id/like
// @access  Private
const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const userId = req.user._id.toString();
    const likeIndex = post.likes.findIndex(id => id.toString() === userId);

    if (likeIndex === -1) {
      // Not liked yet — add like
      post.likes.push(req.user._id);
    } else {
      // Already liked — remove like (unlike)
      post.likes.splice(likeIndex, 1);
    }

    await post.save();

    res.json({
      likes: post.likes,
      likesCount: post.likes.length,
      isLiked: likeIndex === -1 // true if we just liked it
    });
  } catch (error) {
    console.error('LikePost error:', error.message);
    res.status(500).json({ message: 'Server error toggling like' });
  }
};

// @desc    Get my posts
// @route   GET /api/posts/user/me
// @access  Private
const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user._id })
      .populate('author', 'name bio')
      .sort({ createdAt: -1 });

    const postsWithComments = await Promise.all(
      posts.map(async (post) => {
        const commentCount = await Comment.countDocuments({ post: post._id });
        return {
          ...post.toObject(),
          commentCount
        };
      })
    );

    res.json(postsWithComments);
  } catch (error) {
    console.error('GetMyPosts error:', error.message);
    res.status(500).json({ message: 'Server error fetching your posts' });
  }
};

// @desc    Get posts by a specific user
// @route   GET /api/posts/user/:userId
// @access  Public
const getPostsByUser = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.userId })
      .populate('author', 'name bio')
      .sort({ createdAt: -1 });

    const postsWithComments = await Promise.all(
      posts.map(async (post) => {
        const commentCount = await Comment.countDocuments({ post: post._id });
        return {
          ...post.toObject(),
          commentCount
        };
      })
    );

    res.json(postsWithComments);
  } catch (error) {
    console.error('GetPostsByUser error:', error.message);
    res.status(500).json({ message: 'Server error fetching user posts' });
  }
};

module.exports = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  likePost,
  getMyPosts,
  getPostsByUser
};
