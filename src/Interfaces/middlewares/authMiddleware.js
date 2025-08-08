/* eslint-disable consistent-return */
/* istanbul ignore file */

function authenticationMiddleware(tokenManager) {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) throw new Error('AUTHENTICATION.MISSING_TOKEN');

      const token = await authHeader.replace('Bearer ', '');
      const payload = await tokenManager.decodePayload(token);

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
