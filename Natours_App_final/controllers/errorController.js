module.exports = (err, req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    // Sending Error for API Calls
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    //sending Error for Web
    res.status(err.statusCode).render('error');
  }
};
