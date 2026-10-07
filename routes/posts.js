const express = require('express');
const {
  getAllPosts,
  getPostById,
  getPostsByAuthor,
  createPost,
  updatePost,
  deletePost,
} = require('../services/postsService');
const { getAuthorById } = require('../services/authorsService');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const posts = await getAllPosts();
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
});

router.get('/author/:authorId', async (req, res, next) => {
  try {
    const author = await getAuthorById(req.params.authorId);
    if (!author) {
      return res.status(404).json({ error: 'Author no encontrado' });
    }
    const posts = await getPostsByAuthor(req.params.authorId);
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const post = await getPostById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const post = await createPost(req.body);
    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const post = await updatePost(req.params.id, req.body);
    if (!post) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await deletePost(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;