function validateId(req, res, next) {
  for (const value of Object.values(req.params)) {
    const id = Number(value);
    if (!Number.isInteger(id) || id <= 0 || id > 2147483647) {
      return res.status(400).json({ error: 'El id debe ser un número entero positivo' });
    }
  }
  next();
}

function isEmptyString(value) {
  return typeof value !== 'string' || value.trim() === '';
}

function validateAuthor(req, res, next) {
  const { name, email } = req.body ?? {};
  if (isEmptyString(name)) {
    return res.status(400).json({ error: 'name es obligatorio y no puede estar vacío' });
  }
  if (isEmptyString(email)) {
    return res.status(400).json({ error: 'email es obligatorio y no puede estar vacío' });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'email no tiene un formato válido' });
  }
  next();
}

function validatePost(req, res, next) {
  const { title, content, author_id, published } = req.body ?? {};
  if (isEmptyString(title)) {
    return res.status(400).json({ error: 'title es obligatorio y no puede estar vacío' });
  }
  if (isEmptyString(content)) {
    return res.status(400).json({ error: 'content es obligatorio y no puede estar vacío' });
  }
  if (!Number.isInteger(author_id) || author_id <= 0) {
    return res.status(400).json({ error: 'author_id es obligatorio y debe ser un número entero positivo' });
  }
  if (published !== undefined && typeof published !== 'boolean') {
    return res.status(400).json({ error: 'published debe ser true o false' });
  }
  next();
}

module.exports = { validateId, validateAuthor, validatePost };