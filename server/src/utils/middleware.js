export const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// eslint-disable-next-line no-unused-vars
export const handleError = (error, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  console.log(`Error: ${error.message}`);
  res.json({ error: error.message });
};

export const isLoggedIn = (req, res, next) => {
  if (req.session.username) {
    next();
  } else {
    res.status(401);
    next(new Error('Unauthorized!'));
  }
};

export const wrap = (middleware) => (socket, next) => middleware(socket.request, {}, next);

export default {
  notFound, handleError, isLoggedIn, wrap,
};
