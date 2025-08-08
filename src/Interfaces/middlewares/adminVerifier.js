/* eslint-disable consistent-return */
/* istanbul ignore file */

function adminVerifier(userRepository) {
  return async (req, res, next) => {
    try {
      const { id: userId } = req.auth;

      await userRepository.verifyAdmin(userId);

      next();
    } catch (err) {
      return res.status(403).json({
        status: 'fail',
        message: 'Akses dilarang',
      });
    }
  };
}

export default adminVerifier;
