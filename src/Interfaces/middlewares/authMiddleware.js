/* eslint-disable consistent-return */
function authenticationMiddleware(tokenManager) {
  return (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      console.log('Authentication Middleware:', authHeader);
      if (!authHeader) throw new Error('AUTHENTICATION.MISSING_TOKEN');

      const token = authHeader.replace('Bearer ', '');
      const payload = tokenManager.verifyToken(token);

      req.auth = payload; // inject ke request untuk digunakan downstream
      next();
    } catch (err) {
      return res.status(401).json({
        status: 'fail',
        message: 'Token tidak valid atau tidak ada',
      });
    }
  };
}

export default authenticationMiddleware;
