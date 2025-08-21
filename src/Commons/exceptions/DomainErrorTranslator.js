import InvariantError from './InvariantError.js';

const DomainErrorTranslator = {
  translate(error) {
    return DomainErrorTranslator._directories[error.message] || error;
  },
};

DomainErrorTranslator._directories = {
  // Users
  'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'),
  'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat user baru karena tipe data tidak sesuai'),
  'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError('tidak dapat membuat user baru karena karakter username melebihi batas limit'),
  'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang'),
  'LOGIN_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('harus mengirimkan email dan password'),
  'LOGIN_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('email dan password harus string'),

  // Authentication
  'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
  'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),
  'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
  'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),

  // Products
  'NEW_PRODUCT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat product baru karena properti yang dibutuhkan tidak ada'),
  'NEW_PRODUCT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat product baru karena tipe data tidak sesuai'),
  'NEW_PRODUCT.STOCK_AND_PRICE_VALUE_SHOULD_NOT_BE_NEGATIVE': new InvariantError('tidak dapat membuat product baru karena nilai data stock negatif'),
  'UPDATED_PRODUCT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat memperbarui product karena properti yang dibutuhkan tidak ada'),
  'UPDATED_PRODUCT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat memperbarui product karena tipe data tidak sesuai'),
  'UPDATED_PRODUCT.STOCK_AND_PRICE_VALUE_SHOULD_NOT_BE_NEGATIVE': new InvariantError('tidak dapat memperbarui product karena nilai data stock atau price negatif'),

  // Orders
  'NEW_ORDER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat order baru karena properti yang dibutuhkan tidak ada'),
  'NEW_ORDER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat order baru karena tipe data tidak sesuai'),
  'NEW_ORDER.QUANTITY_SHOULD_NOT_BE_NEGATIVE': new InvariantError('tidak dapat membuat order baru karena quantity tidak boleh negatif'),
  'UPDATED_ORDER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat memperbarui order karena properti yang dibutuhkan tidak ada'),
  'UPDATED_ORDER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat memperbarui order karena tipe data tidak sesuai'),
  'UPDATED_ORDER.INVALID_STATUS_DATA': new InvariantError('data status tidak valid'),

};

export default DomainErrorTranslator;
