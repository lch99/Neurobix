'use strict';

class HttpError extends Error {
  constructor(status, message, code) {
    super(message);
    this.status = status;
    if (code) this.code = code;
  }
}

const notFound = (what = 'Resource') => new HttpError(404, `${what} not found`);
const forbidden = () => new HttpError(403, 'Forbidden');
const badRequest = (message) => new HttpError(400, message);

module.exports = { HttpError, notFound, forbidden, badRequest };
