/* eslint-disable consistent-return */
/* istanbul ignore file */

const authenticationMiddleware = (tokenManager) => async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) throw new Error('AUTHENTICATION.MISSING_TOKEN');

    const payload = await tokenManager.decodePayload(token);
    // console.log('ini adalah payload dari decode token', payload);

    req.auth = payload; // inject ke request untuk digunakan downstream
    next();
  } catch (err) {
    return res.status(401).json({
      status: 'fail',
      message: 'Token tidak valid atau tidak ada',
    });
  }
};

export default authenticationMiddleware;
