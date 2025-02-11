const logger = require('./logger');

const errorHandler = (error, req, res, next) => {
  logger.info(error.message);
  if (error.name === 'CastError') {
    return res.response(404).json({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return res.response(400).json({ error: 'error.message' });
  }
  next(error);
};

const unknownEndpoint = (req, res) => {
  res.status(404).json({ error: 'unknown endpoint' });
};

module.exports = {
  errorHandler,
  unknownEndpoint,
};
