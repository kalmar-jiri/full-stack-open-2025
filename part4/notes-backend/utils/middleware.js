const logger = require('./logger');

const requestLogger = (request, response, next) => {
  logger.info(`Method: ${request.method}`);
  logger.info(`Path: ${request.path}`);
  logger.info(`Body: ${request.body}`);
  logger.info('---');
  next();
};

const errorHandler = (error, req, res, next) => {
  logger.info(error.message);
  if (error.name === 'CastError') {
    return res.status(404).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  }
  next(error);
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

module.exports = {
  requestLogger,
  errorHandler,
  unknownEndpoint,
};
