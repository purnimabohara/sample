const crypto = require('crypto');
 
// Generate a random key
const generateRandomKey = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};
 
module.exports = generateRandomKey;
 