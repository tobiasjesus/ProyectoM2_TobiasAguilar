function errorHandler(error, req, res, next) {
  if (error.code === '23505') {
    return res.status(409).json({ error: 'El email ya está registrado' });
  }
  if (error.code === '23503') {
    return res.status(400).json({ error: 'El author_id no corresponde a un author existente' });
  }
  if (error.code === '23502' || error.code === '22P02') {
    return res.status(400).json({ error: 'Datos inválidos' });
  }
  if (error.status === 400) {
    return res.status(400).json({ error: 'El body no es un JSON válido' });
  }

  console.error(error);
  res.status(500).json({ error: 'Error interno del servidor' });
}

module.exports = errorHandler;