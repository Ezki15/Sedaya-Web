/* eslint-disable no-lone-blocks */
class NewCustomer {
  constructor(payload, userId) {
    this._verifypayload(payload);

    const {
      name, email, phone, address,
    } = payload;

    this.name = name;
    this.email = email;
    this.phone = phone;
    this.address = address;
    this.userId = userId;
  }

  _verifypayload({
    name, email, phone, address,
  }) {
    {
      if (!name || !email || !phone || !address) {
        throw new Error('NEW_CUSTOMER.NOT_CONTAIN_NEEDED_PROPERTY');
      }

      if (typeof name !== 'string' || typeof email !== 'string' || typeof phone !== 'string' || typeof address !== 'string') {
        throw new Error('NEW_CUSTOMER.NOT_MEET_DATA_TYPE_SPECIFICATION');
      }
    }
  }
}

export default NewCustomer;
