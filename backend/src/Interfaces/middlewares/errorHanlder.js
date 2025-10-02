/* eslint-disable no-unused-vars */
/* istanbul ignore file */

import DomainErrorTranslator from '../../Commons/exceptions/DomainErrorTranslator.js';
import ClientError from '../../Commons/exceptions/ClientError.js';

const errorHandler = (err, req, res, next) => {
  const translatedError = DomainErrorTranslator.translate(err);

  // console.error('ini adalah pesan error', err); // log detail untuk debugging

  if (translatedError instanceof ClientError) {
    return res.status(translatedError.statusCode).json({
      status: 'fail',
      message: translatedError.message,
    });
  }

  // fallback: error tidak dikenali
  console.error(err); // log detail untuk debugging
  return res.status(500).json({
    status: 'error',
    message: 'terjadi kegagalan pada server kami',
  });
};

export default errorHandler;
