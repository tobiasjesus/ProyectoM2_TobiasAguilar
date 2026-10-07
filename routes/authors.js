const express = require('express');
const { getAllAuthors, getAuthorById } = require('../services/authorsService');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const authors = await getAllAuthors();
    res.status(200).json(authors);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
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

module.exports = router;