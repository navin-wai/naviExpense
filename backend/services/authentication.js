require("dotenv").config();

const JWT = require("jsonwebtoken");

const secret = process.env.SECRET;

function createTokenForUser(user) {
  const payload = {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
  };

  const token = JWT.sign(payload, secret);
  return token;
}
function validateToken(token) {
  if (!token) {
    return null;
  }

  try {
    return JWT.verify(token, secret);
  } catch (error) {
    return null;
  }
}

module.exports = { createTokenForUser, validateToken };
