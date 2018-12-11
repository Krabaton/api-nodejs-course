const jwt = require('jwt-simple');

module.exports = (payload, secret) => jwt.encode(payload, secret);
