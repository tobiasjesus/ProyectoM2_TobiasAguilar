const express = require('express');
const {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
} = require('../services/authorsService');
const { validateId, validateAuthor } = require('../middlewares/validators');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const authors = await getAllAuthors();
    res.status(200).json(authors);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', validateId, async (req, res, next) => {
  try {
    const author = await getAuthorById(req.params.id);
    if (!author) {
      return res.status(404).json({ error: 'Author no encontrado' });
    }
    res.status(200).json(author);
  } catch (error) {
    next(error);
  }
});

router.post('/', validateAuthor, async (req, res, next) => {
  try {
    const author = await createAuthor(req.body);
    res.status(201).json(author);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', validateId, async (req, res, next) => {
  try {
    const author = await updateAuthor(req.params.id, req.body);
    if (!author) {
      return res.status(404).json({ error: 'Author no encontrado' });
    }
    res.status(200).json(author);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', validateId, async (req, res, next) => {
  try {
    const deleted = await deleteAuthor(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Author no encontrado' });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;